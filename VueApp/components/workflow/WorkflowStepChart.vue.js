import { entityLocal, currentWorkflow, workflowHistory, allWorkflow } from './WorkflowStepChart.vue.data';

module.exports = {
    name: "WorkflowStepChart",
    props: {
        type: String,
        entity: Object,
        organization: Object,
        allowMoveStep: Boolean,
        allowChangeWorkflow: Boolean
    },
    data: function () {

    }
    created: function () {
        var vm = this;
        vm.$set(vm, 'entityLocal', cloneDeep(entity));
        vm.loadWorkflowState()
    },
    computed: {
        currentStepTat: function () {
            return 240;
        }
        dueDate: function () {
            var startDate = new Date(vm.workflowHistory.timeStarted);
            return startDate.setDate(startDate.getDate() + (currentStepTat / 24));
        }
    },
    methods:
    {
        loadWorkflowState: function () {
            var vm = this;
            vm.setWorkflow(vm.entityLocal);
        }        

        setWorkflow: function (currentSpecimen) {
            var newWorkflow;

            if (currentSpecimen.workflow.name === '' || !this.isWorkflowAvailable(currentSpecimen.workflow.name)) {
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

        getWorkflowStepWidth: function (workflowStepsCount) {
            var retVal = 96;
            if (workflowStepsCount > 0)
                retVal = retVal / workflowStepsCount;
            return retVal; // 96 stands for 96% of the available parent width. a 100% would cause a new line
        },

        getStepStatus: function (stepName) {
            var vm = this;
            var retClass = '';
            var dueDate = new Date(vm.getDueDate(vm.entityLocal));
            var msDifference = dueDate - new Date();
            var dayDifference = msDifference / 86400000;
            if ((dayDifference) >= 1) {
                retClass += 'success';
            }
            else if ((dayDifference > 0)) {
                retClass += 'warning';
            }
            else {
                retClass += 'danger';
            }

            if (stepName === vm.currentWorkflow.currentStep) {
                retClass += '-current';
            }
            return retClass;
        },

        getCompleted: function (stepName) {
            var step = vm.workflowHistory.find(function (h) { return h.workflowStep === stepName; });
            if (typeof step !== 'undefined') {
                return this.$options.filters.localeDate(step.completed);
            }
            else {
                return '';
            }
        },

        updateworkflowHistory: function (currentSpecimen) {
            var vm = this;

            var history = cloneDeep(vm.workflowHistory);
            history.workflow = vm.currentWorkflow.name;
            history.workflowStep = vm.currentWorkflow.currentStep;
            history.timeStarted = vm.currentWorkflow.stepStarted;
            history.timeCompleted = new Date();
            history.userId = this.user.id;
            history.userFullName = this.user.fullName;
        
            currentSpecimen.history.push(history);
        },

        ///todo cont

        changeWorkflow: function (workflowName, currentSpecimen) {
            var vm = this;
            if (currentSpecimen.workflow.name !== '') {
                vm.updateworkflowHistory(currentSpecimen);
            }

            if (this.isWorkflowAvailable(workflowName)) {
                let newWorkflow = vm.getWorkflowByName(workflowName);
                currentSpecimen.workflow.name = workflowName;
                currentSpecimen.workflow.currentStep = '';              // Setting currentStep='' prevents changeStep from updating history again.
                vm.changeStep('', currentSpecimen, true);                                    // Passing '' as StepName will get the initial step for this new workflow.

                currentSpecimen.workflowStepsCount = newWorkflow.steps.length;
                currentSpecimen.currentStepPosition = newWorkflow.steps.findIndex(function (s) { return s.initial }) + 1;
            }

            var group = vm.specimenGroups.find(function (gr) { return gr.groupGuid === currentSpecimen.groupGuid; });
            if (group.applyAll && !vm.initialLoad) {
                group.applyAll = false;
                vm.currentSpecimens.filter(function (cs) { return (cs.groupGuid === currentSpecimen.groupGuid && cs.specimen.guid !== currentSpecimen.specimen.guid); }).forEach(function (spec) {
                    vm.changeWorkflow(workflowName, spec);
                });
                group.applyAll = true;
            }
        },

        changeStep: function (stepName, currentSpecimen, calledFromWorkflow) {
            var vm = this;
            var fromWorkflow = (typeof calledFromWorkflow === 'undefined') ? false : calledFromWorkflow;
            var step = vm.getStepByName(stepName, currentSpecimen.workflow.name);
            if (step !== null && typeof step !== 'undefined') {
                if (!fromWorkflow) {
                    vm.updateworkflowHistory(currentSpecimen);
                }

                currentSpecimen.workflow.currentStep = step.name;
                currentSpecimen.workflow.stepStarted = new Date();
                currentSpecimen.workflow.lastUpdated = currentSpecimen.workflow.stepStarted;
                currentSpecimen.workflow.userFullName = vm.user.fullName;

                currentSpecimen.currentStepTat = step.TAT;

                vm.changesMade = true;
            }

            var group = vm.specimenGroups.find(function (gr) { return gr.groupGuid === currentSpecimen.groupGuid; });
            if (group.applyAll && !vm.initialLoad) {
                group.applyAll = false;
                vm.currentSpecimens.filter(function (cs) { return (cs.groupGuid === currentSpecimen.groupGuid && cs.specimen.guid !== currentSpecimen.specimen.guid); }).forEach(function (spec) {
                    vm.changeStep(stepName, spec, fromWorkflow);
                });
                group.applyAll = true;
            }
        },

        

        saveWorkflowChanges: function () {
            var vm = this;

            var newGroupGuid;
            var guidsForNewBarcode = [];
            var getNewBarcode = false;

            //handling new groups Guid
            vm.specimenGroups.forEach(function (group) {
                var groupSpec = vm.currentSpecimensByGroup(group.groupGuid);
                var changes = [];
                var noNewGroup = false;

                groupSpec.forEach(function (spec) {
                    if (changes.findIndex(function (c) { return c.workflow === spec.workflow.name && c.step === spec.workflow.currentStep; }) < 0) {
                        changes.push({ workflow: spec.workflow.name, step: spec.workflow.currentStep });
                    }
                });

                if (groupSpec.length === vm.specimens.filter(function (s) { return s.customData.groupGuid === group.groupGuid; }).length) {
                    newGroupGuid = group.groupGuid;
                    getNewBarcode = false;
                    if (changes.length === 1) {
                        noNewGroup = true;
                    }
                }
                else {
                    newGroupGuid = uuidV1();
                    getNewBarcode = true;
                }

                changes.forEach(function (ch) {
                    var specGuids = [];
                    groupSpec.filter(function (gs) { return gs.workflow.name === ch.workflow && gs.workflow.currentStep === ch.step; }).forEach(function (spec) {
                        spec.specimen.customData.groupGuid = newGroupGuid;
                        specGuids.push(spec.specimen.guid);
                    });
                    if (getNewBarcode) {
                        guidsForNewBarcode.push({ groupGuid: newGroupGuid, specGuids });
                    }
                    if (!noNewGroup) {
                        newGroupGuid = uuidV1();
                        getNewBarcode = true;
                    }
                });
            });

            guidsForNewBarcode.forEach(function (gr) {
                axios.post('/api/barcode/', {
                    accessionGuid: vm.accessionGuid,
                    newBarcode: true,
                    number: '',
                    orgNameKey: vm.organization.nameKey,
                    SpecimenGuids: gr.specGuids,
                    userFullName: vm.user.fullName,
                    userId: vm.user.id
                }).then(response => {
                    //vm.assignNewBarcodes(response.data, gr.groupGuid);
                });
            });

            //save changes in customData
            vm.currentSpecimens.forEach(function (cs) {
                vm.saveCurrentWorkflow(cs.specimen, cs.workflow);
                vm.pushworkflowHistory(cs.specimen, cs.history);
            });
            var specimensToSave = vm.currentSpecimens.map(function (cs) { return cs.specimen; });

            axios.post('/api/workflow/specimen', {
                specimens: specimensToSave,
                userFullName: vm.user.fullName,
                userId: vm.user.id
            }).then(response => {
                vm.handleResponse(response.data.guid);
            });

            this.changesMade = false;

            if (!vm.initialSave) {
                vm.$emit('updateOthers', true);
                this.initiateComponent();
            }
        },
        handleResponse: function (response) {
            if (response === '00000000-0000-0000-0000-000000000000' || this.selectedSpecimens.findIndex(function (guid) { return guid === response; }) < 0) {
                console.log("Error occured while processing workflow request");
            }
        },
        assignNewBarcodes: function (number, groupGuid) {
            this.currentSpecimens.filter(function (cs) { return cs.specimen.customData.groupGuid === groupGuid; }).forEach(function (newGr) {
                newGr.specimen.barcodeNumber === number;
            });
        }
    }
};