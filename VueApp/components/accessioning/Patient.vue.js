import patientData from './Patient.vue.data.js';
import Multiselect from 'vue-multiselect';
import PatientInfo from '../entities/PatientInfo.vue';
import axios from 'axios';
import filter from '../../assets/js/setFilter.js';
//import debounce from 'lodash/debounce';

import GooglePlaces from '../plugins/externalData/GooglePlaces.vue';

import customDataHelpersMixin from '../../mixins/customDataHelpers.js';

const uuidV1 = require('uuid/v1');
import { find, propEq } from 'ramda'
import bus from '../../assets/js/bus';

module.exports = {
    name: "Patient",
    components: {
        Multiselect,
        GooglePlaces,
        PatientInfo
    },
    data: function ()
    {
        return {
            patientState: patientData.patientState,
            allowEditSave: false,
            detailsCollapsed: true,
            cacheDob: {
                date: null,
                dayValid: false,
                monthValid: false,
                yearValid: false
            }
        };
    },
    props: {
        prop_patientId: Number,
        prop_mrn: String,
        user: Object,
        organization: Object,
        prop_patients: Array,
        prop_accessionSavingNow: Boolean
    },
    watch: {
        prop_accessionSavingNow: function()
        {
            var vm = this;
            if(vm.prop_accessionSavingNow === true && (vm.allowEditSave || vm.patientSearched)){
                vm.savePatient();
            }
        }
    },
    computed: {
        computedDobDay:{
            get: function(){
                var vm = this;
                var day;
                if(vm.patientIsSet()) {
                    day = new Date(vm.patientState.patient.dob).getDate();
                }
                if(isNaN(day) && vm.cacheDob.dayValid){
                    day = vm.cacheDob.date.getDate();
                }
                return isNaN(day) ? '' : day;
            },
            set: function(value){ //refactor to minimize dup code in month, year
                var vm = this;

                if(isNaN(value)){
                    return;
                }

                var tempDob = new Date(vm.patientState.patient.dob);
                
                var validPatientDob = !isNaN(tempDob);
                
                if(!validPatientDob){
                    if(vm.cacheDob.date !== null){
                        tempDob = new Date(vm.cacheDob.date); //temp while other values are set
                    }                
                    else{
                        tempDob = new Date('01/01/1900');
                    }
                }
				if (tempDob.setDate(value)) {
					vm.patientState.patient.dob = tempDob;
				}
                

                if(!validPatientDob){
                    vm.$set(vm.cacheDob, 'date', new Date(tempDob)); //set the cached version
                    vm.$set(vm.cacheDob, 'dayValid', true);
                }

                if(vm.cacheDob.dayValid && vm.cacheDob.monthValid && vm.cacheDob.yearValid){ //all entries are good, apply to patient
                    vm.$set(vm, 'cacheDob', {date: null, dayValid: false, monthValid: false, yearValid: false});
                    vm.$set(vm.patientState.patient, 'dob', tempDob);
                }
            }
        },

        computedDobMonth:{
            get: function(){
                var vm = this;
                var month;
                if(vm.patientIsSet()) {
                    month = new Date(vm.patientState.patient.dob).getMonth() + 1;
                }
                if(isNaN(month) && vm.cacheDob.monthValid){
                    month = vm.cacheDob.date.getMonth() + 1;
                }
                return isNaN(month) ? '' : month;
            },
            set: function(value){ //refactor to minimize dup code in month, year
                var vm = this;

                if(isNaN(value)){
                    return;
                }

                var tempDob = new Date(vm.patientState.patient.dob);
                
                var validPatientDob = !isNaN(tempDob);
                
                if(!validPatientDob){
                    if(vm.cacheDob.date !== null){
                        tempDob = new Date(vm.cacheDob.date); //temp while other values are set
                    }                
                    else{
                        tempDob = new Date('01/01/1900');
                    }
                }
				if (tempDob.setMonth(value - 1)) {
					vm.patientState.patient.dob = tempDob;
				}

                if(!validPatientDob){
                    vm.$set(vm.cacheDob, 'date', new Date(tempDob)); //set the cached version
                    vm.$set(vm.cacheDob, 'monthValid', true);
                }

                if(vm.cacheDob.dayValid && vm.cacheDob.monthValid && vm.cacheDob.yearValid){ //all entries are good, apply to patient
                    vm.$set(vm, 'cacheDob', {date: null, dayValid: false, monthValid: false, yearValid: false});
                    vm.$set(vm.patientState.patient, 'dob', tempDob);
                }
            }
        },

        computedDobYear:{
            get: function(){
                var vm = this;
                var year;
                if(vm.patientIsSet()) {
                    year = new Date(vm.patientState.patient.dob).getFullYear();
                }
                if(isNaN(year) && vm.cacheDob.yearValid){
                    year = vm.cacheDob.date.getFullYear();
                }
                return isNaN(year) ? '' : year;
            },
            set: function(value){ //refactor to minimize dup code in year, year
                var vm = this;

                if(isNaN(value)){
                    return;
                }

                var tempDob = new Date(vm.patientState.patient.dob);
                
                var validPatientDob = !isNaN(tempDob);
                
                if(!validPatientDob){
                    if(vm.cacheDob.date !== null){
                        tempDob = new Date(vm.cacheDob.date); //temp while other values are set
                    }                
                    else{
                        tempDob = new Date('01/01/1900');
                    }
                }
                
				if (tempDob.setYear(value)) {
					vm.patientState.patient.dob = tempDob;
				}

                if(!validPatientDob){
                    vm.$set(vm.cacheDob, 'date', new Date(tempDob)); //set the cached version
                    vm.$set(vm.cacheDob, 'yearValid', true);
                }

                if(vm.cacheDob.dayValid && vm.cacheDob.monthValid && vm.cacheDob.yearValid){ //all entries are good, apply to patient
                    vm.$set(vm, 'cacheDob', {date: null, dayValid: false, monthValid: false, yearValid: false});
                    vm.$set(vm.patientState.patient, 'dob', tempDob);
                }
            }
        },

        patientSearched: {
            get: function(){
                return this.patientState.patientsSearched;
            },
            set: function(value){
                this.patientState.patientsSearched = value;
            }
        },

        searchBoxWidth: function () {
            return this.allowEditSave || this.patientSearched ? 'col-11' : 'col-12';
        },

        expandPanelArrow: function () {
            return (this.detailsCollapsed ? 'fa-chevron-down' : 'fa-chevron-up') + ' float-right';
        }

        //computedProp_patients:
        //{
        //    get: function() {
        //        var vm = this;
        //        return vm.prop_patients.map(function(p) {
        //            var patient_ext = {dobString: vm.getDobString(p.dob)};
        //            return Object.assign(p, patient_ext);
        //        });
        //    }
        //}
    },
    mounted: function(){
    	bus.$on('validate', this.onValidate)
		this.$watch(() => this.errors.errors, (newValue, oldValue) => {
			const newErrors = newValue.filter(error =>
				find(propEq('field', error.field))(oldValue) === undefined
			)
			const oldErrors = oldValue.filter(error =>
				find(propEq('field', error.field))(newValue) === undefined
			)
			bus.$emit('errors-changed', newErrors, oldErrors)
		})
    },
    created: function()
    {
        if(this.prop_patientId > 0){
            this.setPatient(this.organization, this.prop_patientId, this.prop_mrn);
        }
        else {
            this.newPatient();
        }

    },
    beforeMount: function()
    {
        //$('#dobField').daterangepicker({
        //    "singleDatePicker": true,
        //    "timePicker": false,
        //    locale: {
        //        format: 'MM/DD/YYYY'
        //    }
        //});
    },
    methods: {
        toolTips: function() {this.$nextTick(function(){$('[data-toggle="tooltip"]').tooltip();});},
        onValidate: function(){
        	this.$validator.validateAll().then(result => {
        		if (this.errors.any()) {
        			bus.$emit('errors-changed', this.errors.errors)
        		}
        	}).catch(() => {
        	});
        	return;
        },
        patientIsSet: function(){
            var vm = this;
            return  !(vm.patientState === null || typeof vm.patientState.patient === 'undefined' || vm.patientState.patient === null || typeof vm.patientState.patient === 'undefined');
        },

        customPatientDropdownLabel: function (patient) {
            if(patient.id == -1)
                return "Type to Search";
            else
                return 'Name: ' + patient.firstName + ' ' + patient.lastName + ', DOB: ' + this.$options.filters.MMDDYYYY(patient.dob) + ', SSN: ' + patient.ssn;
        },

        dateFormat: function(date) {
            return this.$options.filters.MMDDYYYY(date)
        },

        limitText: function(count) {
            return `and ${count} additional Patients`;
        },

        setMinWidth: function (options) {
            var vm = this;
            var width = 0;
            if (typeof vm.$refs.sizeCalculator === 'undefined') {
                return 'min-width: 150px';
            };
            var tester = vm.$refs.sizeCalculator;
            tester.style.display = 'block';

            if (Array.isArray(options)) {
                options.forEach(function (item) {
                    tester.textContent = item.name;
                    if (width < tester.clientWidth) {
                        width = tester.clientWidth;
                    }
                });
            }
            else {
                tester.textContent = options;
                if (width < tester.clientWidth) {
                    width = tester.clientWidth;
                }
            }
            tester.style.display = 'none';

            return 'min-width: ' + width + 'px';
        },

        patientChanged: function (value, dropDownId, doReload) { //can this be combined with setPatient?
            if(typeof value === 'undefined'){
                return;
            }
            this.allowEditSave = true;
            this.patientSearched = true;
            this.setPatientAttributes(this.patientState.patient);
            this.$emit('changed', value.id, doReload);
        },

        //getDobString: function(dob){
        //    var dobDt = new Date(dob);
        //    return (dobDt.getMonth() + 1) + '/' + dobDt.getDay() + '/' + dobDt.getFullYear();
        //},

        toggleDetailsVisibility: function() {
            this.detailsCollapsed = !this.detailsCollapsed;
        },

        addNewPatient: function() {
            this.allowEditSave = true;
            this.detailsCollapsed = false;
            if(this.patientState === null || (this.patientState.patient != null && this.patientState.patient.id !== -1)) {
                this.newPatient();
            }
        },

        newPatient: function () {
            this.patientState.patient = {
                "id": -1,
                "guid": uuidV1(),
                "lastName": '',
                "firstName": '',
                "fullName": '',
                "dob": '',
                //"dobString": '',
                "ssn": ''
            };
            this.patientState.mrn = "";
            this.setPatientAttributes(this.patientState.patient);
            this.$emit('new', -1);
        },

        setPatient: function(org, patientId, mrn)
        {
            var currentPatient = this.prop_patients.find(function(p){return p.id == patientId});
            if(currentPatient != null){
                this.$set(this.patientState, 'patient', currentPatient);
                //done in compute - this.$set(this.patientState.patient, 'dobString', this.getDobString(this.patientState.patient.dob));
                this.$set(this.patientState, 'mrn', mrn);
                this.setPatientAttributes(currentPatient);
                this.allowEditSave = true;
            }
            else
                this.newPatient();
        },

        savePatient: function()
        {
            var vm = this;
            //vm.$set(vm.patientState.patient, 'dob', new Date(vm.patientState.patient.dobString).toJSON());
            //vm.$delete(vm.patientState.patient, 'dobString');
            axios.post('/api/patient', {
                patient: vm.patientState.patient,
                orgCustomData: vm.organization.customData,
                userFullName: vm.user.fullName,
                userId: vm.user.id}).then(response=>{
                    vm.$set(vm.patientState.patient, 'id', response.data.id);
                    vm.$set(vm.patientState.patient, 'guid', response.data.guid);
                    vm.patientChanged(vm.patientState.patient, response.data.id, true);
                    vm.$set(vm, 'detailsCollapsed', true);
                });
        }

    },

};