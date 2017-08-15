import specimenStatusData from './SpecimenStatus.vue.data.js';
import customDataHelpersMixin from '../../../mixins/customDataHelpers.js';
import axios from 'axios';
import cloneDeep from 'lodash/cloneDeep'
const uuidV1 = require('uuid/v1');

module.exports = {
    name: 'SpecimenStatus',
    mixins: [
        customDataHelpersMixin
    ],
    props: {
        accessionGuid: String,
        selectedSpecimens: Array, // guid array
        specimens: Array,
        organization: Object,
        user: Object
    },
    data: function ()
    {
        return {
            currentSpecimens: null,
            specimenGroups: null,
            specimenHistory: specimenStatusData.specimenHistory,
            currentWorkflow: specimenStatusData.currentWorkflow,
            specimenSelected: true,
            changesMade: false,
            initialSave: false,
            initialLoad: true
        };
    },
    computed:
        {
        },
    watch:
        {
            selectedSpecimens: function() {
                this.specimenSelected = this.initiateComponent();
            }
        },
    created: function()
    {
        this.specimenSelected = this.initiateComponent();
    },
    methods:
        {
            initiateComponent: function()
            {
                var vm = this;
                vm.specimenGroups = [];
                vm.currentSpecimens = [];

                vm.selectedSpecimens.forEach(function(guid) {
                    let groupGuid = '0';

                    var spec = vm.specimens.find(function(s) { return s.guid === guid; });
                    var isPrimary = vm.currentSpecimens.findIndex(function(cs) { return cs.groupGuid === spec.customData.groupGuid; }) < 0;
                    
                    if(spec.customData.groupGuid !== null && typeof spec.customData.groupGuid !== 'undefined') {
                        groupGuid = spec.customData.groupGuid;
                    }

                    if(groupGuid !== '0' && vm.specimenGroups.findIndex(function(gr) { return gr.groupGuid === groupGuid; }) < 0) {
                        let specCount = vm.specimens.filter(function(s) { return (s.customData.groupGuid === groupGuid && vm.selectedSpecimens.findIndex(function(sGuid) { return sGuid === s.guid; }) >= 0 ); }).length;
                        vm.specimenGroups.push({groupGuid, count: specCount, isExpanded: false, applyAll: true});
                    }

                    vm.currentSpecimens.push( {
                        groupGuid: spec.customData.groupGuid,
                        specimen: spec,
                        isPrimary: isPrimary,
                        isExpanded: false,
                        workflow: vm.loadCurrentWorkflow(spec, cloneDeep(specimenStatusData.currentWorkflow)),
                        history: [],
                        currentWorkflowHistory: null,
                        workflowStepsCount: -1,
                        currentStepPosition: -1,
                        currentStepTat: 0
                    });

                    vm.setWorkflow(vm.currentSpecimens[vm.currentSpecimens.length - 1]);
                    vm.currentSpecimens[vm.currentSpecimens.length - 1].currentWorkflowHistory = vm.getCurrentWorkflowHistory(spec,
                                                                                                                              vm.currentSpecimens[vm.currentSpecimens.length - 1].workflow,
                                                                                                                              vm.currentSpecimens[vm.currentSpecimens.length - 1].history);
                });

                if(this.initialSave) {
                    this.saveWorkflowChanges();
                    this.initialSave = false;
                }
                this.initialLoad = false;

                return vm.currentSpecimens.length > 0;
            },

            currentSpecimensByGroup: function(groupGuid)
            {
                return this.currentSpecimens.filter(function(cs) { return cs.groupGuid === groupGuid}) ;
            },

            expandGroup: function(groupGuid)
            {
                var vm = this;
                var group = vm.specimenGroups.find(function(gr) { return gr.groupGuid === groupGuid; });
                group.isExpanded = !group.isExpanded;

                if(group.isExpanded) {
                    group.applyAll = false;
                }
                else {
                    group.applyAll = true;
                }

                vm.currentSpecimens.filter(function(cs) { return cs.groupGuid === groupGuid; }).forEach(function(gcs) {
                    gcs.isExpanded = !gcs.isExpanded;
                });
            },

            applyAllChanged: function(groupGuid)
            {
                var group = this.specimenGroups.find(function(gr) { return gr.groupGuid === groupGuid; });
                group.applyAll = !group.applyAll;
            },

            getDueDate: function(currentSpecimen)
            {
                var startDate = new Date(currentSpecimen.currentWorkflowHistory.workflowStarted);
                return startDate.setDate(startDate.getDate() + (currentSpecimen.currentStepTat / 24));
            },
            getWorkflowStepWidth: function(workflowStepsCount)
            {
                var retVal = 96;
                if(workflowStepsCount > 0)
                    retVal = retVal / workflowStepsCount;
                return retVal; // 96 stands for 96% of the available parent width. a 100% would cause a new line
            },

            getStepStatus: function(stepName, currentSpecimen)
            {
                var retClass = '';
                var dueDate = new Date(this.getDueDate(currentSpecimen));
                var msDifference = dueDate - new Date();
                var dayDifference = msDifference / 86400000;
                if((dayDifference) >= 1) {
                    retClass += 'success';
                }
                else if((dayDifference > 0)) {
                    retClass += 'warning';
                }
                else {
                    retClass += 'danger';
                }

                if(stepName === currentSpecimen.workflow.currentStep) {
                    retClass += '-current';
                }
                return retClass;
            },

            getCompleted: function(stepName, currentWorkflowHistory)
            {
                var step = currentWorkflowHistory.stepHistory.find(function(h) { return h.step === stepName; });
                if(typeof step !== 'undefined') {
                    return this.$options.filters.localeDate(step.completed);
                }
                else {
                    return '';
                }
            },

            updateSpecimenHistory: function(currentSpecimen)
            {
                var history = cloneDeep(specimenStatusData.specimenHistory);
                history.workflow = currentSpecimen.workflow.name;
                history.workflowStep = currentSpecimen.workflow.currentStep;
                history.timeStarted = currentSpecimen.workflow.stepStarted;
                history.timeCompleted = new Date();
                history.userFullName = this.user.fullName;

                currentSpecimen.history.push(history);
            },

            changeWorkflow: function(workflowName, currentSpecimen)
            {
                var vm = this;
                if(currentSpecimen.workflow.name !== '') {
                    vm.updateSpecimenHistory(currentSpecimen);
                }

                if(this.isWorkflowAvailable(workflowName)) {
                    let newWorkflow = vm.getWorkflowByName(workflowName);
                    currentSpecimen.workflow.name = workflowName;
                    currentSpecimen.workflow.currentStep = '';              // Setting currentStep='' prevents changeStep from updating history again.
                    vm.changeStep('', currentSpecimen, true);                                    // Passing '' as StepName will get the initial step for this new workflow.
                
                    currentSpecimen.workflowStepsCount = newWorkflow.steps.length;
                    currentSpecimen.currentStepPosition = newWorkflow.steps.findIndex(function (s) { return s.initial }) + 1;
                }

                var group = vm.specimenGroups.find(function(gr) { return gr.groupGuid === currentSpecimen.groupGuid; });
                if(group.applyAll && !vm.initialLoad) {
                    group.applyAll = false;
                    vm.currentSpecimens.filter(function(cs) { return (cs.groupGuid === currentSpecimen.groupGuid && cs.specimen.guid !== currentSpecimen.specimen.guid); }).forEach(function(spec) {
                        vm.changeWorkflow(workflowName, spec);
                    });
                    group.applyAll = true;
                }
            },

            changeStep: function(stepName, currentSpecimen, calledFromWorkflow)
            {
                var vm = this;
                var fromWorkflow = (typeof calledFromWorkflow === 'undefined') ? false : calledFromWorkflow;
                var step = vm.getStepByName(stepName, currentSpecimen.workflow.name);
                if(step !== null && typeof step !== 'undefined')
                {
                    if(!fromWorkflow) {
                        vm.updateSpecimenHistory(currentSpecimen);
                    }

                    currentSpecimen.workflow.currentStep = step.name;
                    currentSpecimen.workflow.stepStarted = new Date();
                    currentSpecimen.workflow.lastUpdated = currentSpecimen.workflow.stepStarted;
                    currentSpecimen.workflow.userFullName = vm.user.fullName;

                    currentSpecimen.currentStepTat = step.TAT;

                    vm.changesMade = true;
                }

                var group = vm.specimenGroups.find(function(gr) { return gr.groupGuid === currentSpecimen.groupGuid; });
                if(group.applyAll && !vm.initialLoad) {
                    group.applyAll = false;
                    vm.currentSpecimens.filter(function(cs) { return (cs.groupGuid === currentSpecimen.groupGuid && cs.specimen.guid !== currentSpecimen.specimen.guid); }).forEach(function(spec) {
                        vm.changeStep(stepName, spec, fromWorkflow);
                    });
                    group.applyAll = true;
                }
            },

            setWorkflow: function(currentSpecimen)
            {
                var newWorkflow;

                if(currentSpecimen.workflow.name === '' || !this.isWorkflowAvailable(currentSpecimen.workflow.name)) {
                    newWorkflow = this.getDefaultWorkflow();
                    this.changeWorkflow(newWorkflow.name, currentSpecimen);
                    this.initialSave = true;
                }
                else {
                    newWorkflow = this.getWorkflowByName(currentSpecimen.workflow.name);
                    var step = this.getStepByName(currentSpecimen.workflow.currentStep, currentSpecimen.workflow.name);
                    currentSpecimen.currentStepTat = step.TAT;
                
                    currentSpecimen.workflowStepsCount = newWorkflow.steps.length;
                    currentSpecimen.currentStepPosition = newWorkflow.steps.findIndex(function (s) { return s.initial }) + 1;
                }

            },

            saveWorkflowChanges: function()
            {
                var vm = this;

                var newGroupGuid;
                var guidsForNewBarcode = [];
                var getNewBarcode = false;

                //handling new groups Guid
                vm.specimenGroups.forEach(function(group){
                    var groupSpec = vm.currentSpecimensByGroup(group.groupGuid);
                    var changes = [];
                    var noNewGroup = false;

                    groupSpec.forEach(function(spec) {
                        if(changes.findIndex(function(c) { return c.workflow === spec.workflow.name && c.step === spec.workflow.currentStep; }) < 0) {
                            changes.push({workflow: spec.workflow.name, step: spec.workflow.currentStep});
                        }
                    });

                    if(groupSpec.length === vm.specimens.filter(function(s) { return s.customData.groupGuid === group.groupGuid; }).length) {
                        newGroupGuid = group.groupGuid;
                        getNewBarcode = false;
                        if(changes.length === 1) {
                            noNewGroup = true;
                        }
                    }
                    else {
                        newGroupGuid = uuidV1();
                        getNewBarcode = true;
                    }

                    changes.forEach(function(ch) {
                        var specGuids = [];
                        groupSpec.filter(function(gs) { return gs.workflow.name === ch.workflow && gs.workflow.currentStep === ch.step; }).forEach(function(spec) {
                            spec.specimen.customData.groupGuid = newGroupGuid;
                            specGuids.push(spec.specimen.guid);
                        });
                        if(getNewBarcode) {
                            guidsForNewBarcode.push({groupGuid: newGroupGuid, specGuids });
                        }
                        if(!noNewGroup){
                            newGroupGuid = uuidV1();
                            getNewBarcode = true;
                        }
                    });
                });

                guidsForNewBarcode.forEach(function(gr){
                    axios.post('/api/barcode/', {
                        accessionGuid: vm.accessionGuid,
                        newBarcode: true,
                        number: '',
                        orgNameKey: vm.organization.nameKey,
                        SpecimenGuids: gr.specGuids,
                        userFullName: vm.user.fullName,
                        userId: vm.user.id}).then(response=>{
                            //vm.assignNewBarcodes(response.data, gr.groupGuid);
                        });
                });

                //save changes in customData
                vm.currentSpecimens.forEach(function(cs) {
                    vm.saveCurrentWorkflow(cs.specimen, cs.workflow);
                    vm.pushSpecimenHistory(cs.specimen, cs.history);
                });
                var specimensToSave = vm.currentSpecimens.map(function(cs) { return cs.specimen; });
                
                axios.post('/api/workflow/specimen', {
                    specimens: specimensToSave,
                    userFullName: vm.user.fullName,
                    userId: vm.user.id}).then(response=>{
                        vm.handleResponse(response.data.guid);
                    });

                this.changesMade = false;
                
                if(!vm.initialSave) {
                    vm.$emit('updateOthers', true);
                    this.initiateComponent();
                }
            },
            handleResponse: function(response)
            {
                if(response === '00000000-0000-0000-0000-000000000000' || this.selectedSpecimens.findIndex(function(guid) { return guid === response; }) < 0) {
                    console.log("Error occured while processing workflow request");
                }
            },
            assignNewBarcodes: function(number, groupGuid)
            {
                this.currentSpecimens.filter(function(cs) { return cs.specimen.customData.groupGuid === groupGuid; }).forEach(function(newGr) {
                    newGr.specimen.barcodeNumber === number;
                });
            }
        }
};