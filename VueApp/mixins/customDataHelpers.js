import specimenWorkflowTemplate from '../components/entity_composites/SpecimenStatus.vue.data.js';

import Vue from 'vue';
const uuidV1 = require('uuid/v1');
import cloneDeep from 'lodash/cloneDeep'

Vue.mixin({
    methods: {

        getSpecimenTransports: function (typeCode) {
            var type = this.organization.customData.specimenDefinitions.filter(
                function (s) { return s.code === typeCode; })[0];
            return type.transports;
        },

        getSpecimenAttributesBySection: function (sectionName) {
            var vm = this;
            var allAttr = [];

            for (var definition of vm.organization.customData.specimenDefinitions) {
                allAttr = allAttr.concat(definition.accessionAttributes.filter(function (a) { return a.section === sectionName }));
            }
            //unique
            return allAttr.filter(function (elem, index, self) {
                return index === self.indexOf(elem);
            });
        },

        getSpecimenAttributesBySectionAndType: function (sectionName, specimenTypeCode) {
            var allAttr = this.organization.customData.specimenDefinitions.filter(
                function (s) { return s.code === specimenTypeCode; })[0].accessionAttributes;
            return allAttr.filter(function (a) { return a.section === sectionName });
        },

        ///apply organization custom data to new and existing specimens (additive)
        setSpecimenAttributes: function (specimen) {
            if (specimen.attributesAreSet)
                return;

            var vueVm = this;
            var specAttributes = vueVm.organization.customData.specimenDefinitions.filter(
                function (s) { return s.code === specimen.type.code; })[0].accessionAttributes;

            for (let attribute of specAttributes) {

                if (typeof specimen.customData === "undefined") {
                    vueVm.$set(specimen, "customData", {});
                }

                if (specimen.customData === null) {
                    vueVm.$set(specimen, "customData", {});
                }

                if (typeof specimen.customData.attributes === "undefined") {
                    vueVm.$set(specimen.customData, "attributes", []);
                }

                if (typeof specimen.customData.attributes.find(function (a) { return a.name === attribute.name; }) === "undefined") {
                    if (attribute.type === 'multiple-large' || attribute.type === 'multiple-small' || attribute.type === 'civic-gene-api')
                        specimen.customData.attributes.push({ name: attribute.name, value: [{ id: "", name: "" }] });
                    else
                        specimen.customData.attributes.push({ name: attribute.name, value: { id: "", name: "" } });
                }

                vueVm.$set(specimen, "attributesAreSet", true);

            }
            this.$nextTick(function () { this.toolTips(); });
        },

        updateSpecimenAttributeFromText: function (event) {
            var idParams = event.target.id.split('_');
            var specimenGuid = idParams[0];
            var attributeName = idParams[1];
            var attributeType = idParams[2];
            this.updateSpecimenAttribute(this.currentSpecimen, attributeName, { id: '0', name: event.target.value });
        },

        updateSpecimenAttributeFromMultiSelect: function (value, id) {
            var idParams = id.split('_');
            var specimenGuid = idParams[0];
            var attributeName = idParams[1];
            var attributeType = idParams[2];
            
            var specimen = this.currentSpecimen; //this.specimens.find(function (s) { return s.guid === specimenGuid });

            this.updateSpecimenAttribute(specimen, attributeName, value);
        },

        updateSpecimenAttribute: function (specimen, attributeName, attributeValue) {
            var attr = specimen.customData.attributes.find(function (a) { return a.name === attributeName });
            var newSet = new Set(Array.isArray(attributeValue) ? attributeValue : [].concat(attributeValue));
            attributeValue = Array.from(newSet);
            this.$set(attr, "value", attributeValue); 
        },

        currentSpecimenAttributeValue: function (specimen, attributeName, single, nameOnly) {

            var value = null;

            if (typeof specimen.customData.attributes !== 'undefined') {
                var attributeOnSpecimen = specimen.customData.attributes.find(function (a) { return a.name.toLowerCase() === attributeName.toLowerCase() });
                if (typeof attributeOnSpecimen !== 'undefined' && typeof attributeOnSpecimen.value !== 'undefined')
                    value = attributeOnSpecimen.value;
            }

            if (value === null) {
                value = { id: '', name: '' };
            }

            if (!Array.isArray(value)) {
                if (typeof value.name === 'undefined') { //deal with some old bad data
                    value = { id: '', name: '' };
                }
                value = [value];
            }

            var newVal = [];

            value.forEach(function (val) {
                if (val !== null && typeof (val) === 'object') {
                    newVal.push(val);
                }
            });

            if (single)
            {
                newVal = newVal[0];
                if (nameOnly) {
                    newVal = newVal.name;
                }
            }
            else if (newVal.length === 1 && newVal[0].id === '') { //the default value, which isn't needed for multi-select types
                newVal = [];
            }

            return newVal;
        },

        /*
        *
        *   SPECIMEN WORKFLOW SECTION
        *
        */

        isWorkflowAvailable: function (workflowName) {
            return typeof this.organization.customData.specimenDefinitions[0].workflows.find(function (w) { return w.name === workflowName }) !== 'undefined';
        },

        getDefaultWorkflow: function () {
            return this.organization.customData.specimenDefinitions[0].workflows.find(function (w) { return w.default });
        },

        getWorkflowByName: function (workflowName) {
            return this.organization.customData.specimenDefinitions[0].workflows.find(function (w) { return w.name === workflowName });
        },

        isStepInWorkflow: function (stepName, workflowName) {
            var workflow = this.organization.customData.specimenDefinitions[0].workflows.find(function (w) { return w.name === workflowName });
            if (workflow !== null && typeof workflow !== 'undefined') {
                return (typeof workflow.steps.find(function (s) { return s.name === stepName }) !== 'undefined');
            }

            return false;
        },

        getStepByName: function (stepName, workflowName) {
            var retStep = null;
            var workflow = this.organization.customData.specimenDefinitions[0].workflows.find(function (w) { return w.name === workflowName });
            if (workflow !== null && typeof workflow !== 'undefined') {
                if (stepName !== '') {
                    retStep = workflow.steps.find(function (s) { return s.name === stepName });
                }
                else {
                    retStep = this.getInitialWorkflowStep(workflowName);
                }
            }
            return retStep;
        },

        getInitialWorkflowStep: function (workflowName) {
            return this.organization.customData.specimenDefinitions[0].workflows.find(function (w) { return w.name === workflowName }).steps.find(function (s) { return s.initial });
        },

        currentWorkflowSteps: function (workflowName) {
            var workflow = this.organization.customData.specimenDefinitions[0].workflows.find(function (w) { return w.name === workflowName });

            if (workflow !== null && typeof workflow !== 'undefined') {
                return workflow.steps;
            }
            return new Array();
        },

        setSpecimenWorkflow: function (specimen) {
            if (typeof specimen.workflowIsSet !== 'undefined' && specimen.workflowIsSet)
                return;

            var vueVm = this;

            if (typeof specimen.customData === "undefined" || specimen.customData === null) {
                vueVm.$set(specimen, "customData", {});
            }

            if (typeof specimen.customData.workflow === "undefined") {
                vueVm.$set(specimen.customData, "workflow", {});
            }

            vueVm.$set(specimen, "workflowIsSet", true);
        },

        isWorkflowInitialized: function (specimens) {
            var isInitialized = false;
            if (Array.isArray(specimens)) {
                specimens.forEach(function (spec) {
                    if (typeof spec.customData !== 'undefined' &&
                        typeof spec.customData.workflow !== 'undefined' &&
                        typeof spec.customData.workflow.name !== 'undefined' &&
                        spec.customData.workflow.name !== '') {
                        isInitialized = true;
                    }
                });
            }
            else {
                if (typeof specimens.customData !== 'undefined' &&
                    typeof specimens.customData.workflow !== 'undefined' &&
                    typeof specimens.customData.workflow.name !== 'undefined' &&
                    specimens.customData.workflow.name !== '') {
                    isInitialized = true;
                }
            }
            return isInitialized;
        },

        initializeWorkflow: function (specimens) {
            var vm = this;
            var defaultWorkflow = vm.getDefaultWorkflow();
            var initialStep = vm.getInitialWorkflowStep(defaultWorkflow.name);
            var workflowTemplate = cloneDeep(specimenWorkflowTemplate.currentWorkflow);

            workflowTemplate.name = defaultWorkflow.name;
            workflowTemplate.currentStep = initialStep.name;
            workflowTemplate.stepStarted = new Date();
            workflowTemplate.lastUpdated = workflowTemplate.stepStarted;
            workflowTemplate.userFullName = vm.user.fullName;

            if (Array.isArray(specimens)) {
                specimens.forEach(function (spec) {
                    vm.setSpecimenWorkflow(spec);
                    vm.saveCurrentWorkflow(spec, workflowTemplate);
                });
            }
            else {
                vm.setSpecimenWorkflow(specimens);
                vm.saveCurrentWorkflow(specimens, workflowTemplate);
            }

        },

        loadCurrentWorkflow: function (specimen, currentWorkflow) {
            var vm = this;
            if (specimen.customData === null || typeof specimen.customData === 'undefined' ||
                typeof specimen.customData.workflow === 'undefined' || Object.getOwnPropertyNames(specimen.customData.workflow) <= 1) {
                this.setSpecimenWorkflow(specimen);
                vm.$set(specimen.customData, 'workflow', cloneDeep(currentWorkflow));     // at this point currentWorkflow is empty so it's used to set up workflow's properties
            }

            return cloneDeep(specimen.customData.workflow);
        },

        saveCurrentWorkflow: function (specimen, currentWorkflow) {
            var vm = this;
            if (typeof specimen.workflow === 'undefined' || !specimen.workflowIsSet) {
                this.setSpecimenWorkflow(specimen);
            }
            vm.$set(specimen.customData, 'workflow', cloneDeep(currentWorkflow));
        },

        setSpecimenHistory: function (specimen) {
            if (typeof specimen.historyIsSet !== 'undefined' && specimen.historyIsSet)
                return;

            var vueVm = this;

            if (typeof specimen.customData === "undefined" || specimen.customData === null) {
                vueVm.$set(specimen, "customData", {});
            }

            if (typeof specimen.customData.specimenHistory === "undefined") {
                vueVm.$set(specimen.customData, "specimenHistory", []);
            }

            vueVm.$set(specimen, "historyIsSet", true);
        },

        pushSpecimenHistory: function (specimen, specimenHistory) {
            if (typeof specimen.historyIsSet === 'undefined' || !specimen.historyIsSet) {
                this.setSpecimenHistory(specimen);
            }
            if (Array.isArray(specimenHistory)) {
                specimenHistory.forEach(function (h) {
                    specimen.customData.specimenHistory.push(h);
                });
            }
            else {
                specimen.customData.specimenHistory.push(cloneDeep(specimenHistory));
            }
        },

        getCurrentWorkflowHistory: function (specimen, workflow, history) {
            if (typeof this.organization === 'undefined') {
                console.log('No organization prop present');
            }

            var workflowSteps = this.organization.customData.specimenDefinitions[0].workflows.find(function (w) { return w.name === workflow.name }).steps;
            var priorSteps = [];
            var currentStepIndex = workflowSteps.findIndex(function (ws) { return ws.name === workflow.currentStep; });

            while (currentStepIndex >= 1) {
                priorSteps.push(workflowSteps[--currentStepIndex].name);
            }

            var historyComplete = false;
            var workflowHistory = [];
            var workflowStarted = workflow.stepStarted;

            for (let i = history.length - 1; i >= 0; i--) {
                if (history[i].workflow !== workflow.name) {
                    historyComplete = true;
                    break;
                }
                if (priorSteps.findIndex(function (ps) { return ps === history[i].workflowStep }) >= 0) {
                    workflowHistory.push({ step: history[i].workflowStep, completed: history[i].timeCompleted });
                    workflowStarted = history[i].timeStarted;
                };
            }

            if (!historyComplete && typeof specimen.customData.specimenHistory !== 'undefined') {
                for (let i = specimen.customData.specimenHistory.length - 1; i >= 0; i--) {
                    if (specimen.customData.specimenHistory[i].workflow !== workflow.name) {
                        historyComplete = true;
                        break;
                    }
                    if (priorSteps.findIndex(function (ps) { return ps === specimen.customData.specimenHistory[i].workflowStep }) >= 0) {
                        workflowHistory.push({ step: specimen.customData.specimenHistory[i].workflowStep, completed: specimen.customData.specimenHistory[i].timeCompleted });
                        workflowStarted = specimen.customData.specimenHistory[i].timeStarted;
                    };
                }
            }

            return { workflowStarted, stepHistory: workflowHistory };
        },

        /*
        *
        *   PATIENT CUSTOM DATA SECTION
        *
        */

        //getPatientDemographicDetails: function () {
        getPatientAttributesBySection: function (sectionName) {
            return this.organization.customData.patientAttributes.filter(function (a) { return a.section === sectionName; });
        },

        //setPatientDemographics: function (patient) {
        setPatientAttributes: function (patient) {
            if (patient === null || patient.detailsAreSet) {
                return;
            }

            var vueVm = this;

            for (let attr of vueVm.organization.customData.patientAttributes) {

                if (typeof patient.customData === "undefined") {
                    vueVm.$set(patient, "customData", {});
                }

                if (patient.customData === null) {
                    vueVm.$set(patient, "customData", {});
                }

                if (typeof patient.customData.attributes === "undefined") {
                    vueVm.$set(patient.customData, "attributes", []);
                }

                if (typeof patient.customData.attributes.find(function (a) { return a.name === attr.name; }) === "undefined") {
                    if (attr.type === 'multiple-large' || attr.type === 'multiple-small')
                        patient.customData.attributes.push({ name: attr.name, value: [{ id: "", name: "" }] });
                    else
                        patient.customData.attributes.push({ name: attr.name, value: { id: "", name: "" } });
                }

                vueVm.$set(patient, "detailsAreSet", true);

            }
            this.$nextTick(function () { this.toolTips(); });
        },

        //updatePatientDetails: function(value, id) {
        updatePatientAttribute: function (value, id) {
            var idParams = id.split('_');
            var detailName = idParams[0];
            var detailType = idParams[1];

            //var multiple = detailType === 'multiple-large' || detailType === 'multiple-small';

            this.updatePatientAttributeValue(detailName, value, true); //long story.  save them all as arrays.
        },

        //currentPatientDetailValue: function(patient, detailName, expectsSingle){
        currentPatientAttributeValue: function (patient, attributeName, expectsSingle) {
            var originallySingle = false;
            var value = null;

            if (typeof patient === 'undefined')
                console.log('Patient not found');

            if (this.completePatient(patient)) {
                var attr = patient.customData.attributes.find(function (a) { return a.name === attributeName });
                if (typeof attr !== 'undefined' && typeof attr.value !== 'undefined')
                    value = attr.value;
            }
            if (!Array.isArray(value)) {
                originallySingle = true;
                value = [value];
            }
            var newVal = [];
            value.forEach(function (val) {
                if (val !== null && typeof (val) === 'object') {
                    newVal.push(val);
                }
            });
            if ((expectsSingle || originallySingle) && newVal.length > 0)
                newVal = newVal[0];
            else if (newVal.length === 1 && newVal[0].id === '') //the default value, which isn't needed for multi-select types
                newVal = [];

            return newVal;
        },

        completePatient: function (patient) {
            var retVal = true;
            if (typeof patient === 'undefined')
                retVal = false;
            else if (typeof patient.customData === 'undefined')
                retVal = false;
            else if (typeof patient.customData.attributes === 'undefined')
                retVal = false;
            return retVal;
        },

        //updatePatientDetailValue: function (detailName, value, singleToMultiple) {
        updatePatientAttributeValue: function (attributeName, value, singleToMultiple) {
            var attr = this.patientState.patient.customData.attributes.find(function (d) { return d.name === attributeName });
            if (singleToMultiple) {
                var newSet = new Set(Array.isArray(value) ? value : [].concat(value));
                value = Array.from(newSet);
            }
            this.$set(attr, "value", value);
        }

    },
    computed: {
        organizationSpecimenTypes: function () {
            return Array.from(new Set(this.organization.customData.specimenDefinitions.map(function (spec) {
                return { type: spec.type, code: spec.code };
            }))); //set should de-dup .. maybe
        },
        organizationSpecimenWorkflows: function () {
            return this.organization.customData.specimenDefinitions[0].workflows;
        },
        organizationUsesCases: function () {
            return false; //todo
        },
        organizationUsesSpecimens: function () {
            return true; //todo
        }
    }
});