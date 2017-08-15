import customDataHelpersMixin from './customDataHelpers.js';

import Vue from 'vue';
import axios from 'axios'

//mixin
import barcodesMixin from './barcodes.js';

const uuidV1 = require('uuid/v1');
import cloneDeep from 'lodash/cloneDeep'

Vue.mixin({
    mixins: [
        barcodesMixin
    ],
    methods: {    
        loadAccession: function(guid, orgNameKey, container){
            var vm = this;
            
            axios.all([
                vm.getAccessionOrNew(guid, orgNameKey) //note that this will either do an actual axios http post, or set response to the local new accession template
            ]).then(axios.spread(function (accResponse) { 
                vm.$set(container, 'accession', accResponse.data.accession);
                vm.afterLoad(vm);
            }
                )).catch(err => {console.log(err)});
        },

        afterLoad: function(vm){
            if(!vm.accessionState.isNew){
                vm.setAccessionHistory(false);
                vm.getBarcodes(vm.organization.nameKey, vm.accessionState.accession.guid, vm.accessionState);
            }

            vm.$set(vm.accessionState, 'loaded', true); 

            vm.$nextTick(function() { vm.finalizeView(); });          

            //init customData/comments - refactor
            if(typeof vm.accessionState.accession.customData === 'undefined')
                vm.$set(vm.accessionState.accession, 'customData', {});

            if(typeof vm.accessionState.accession.customData.comments === 'undefined')
                vm.$set(vm.accessionState.accession.customData, 'comments', []);
            else if (vm.accessionState.accession.customData.comments.length > 0) {
                vm.$set(vm.accessionState, 'editingComment', vm.accessionState.accession.customData.comments[0]);
            }
        },

        loadPatients: function(orgNameKey){ //unused?  vuex entityLookup?
            var vm = this;
            axios.get('/api/Patient/' + orgNameKey).then(function(response)
            {
                vm.$set(vm.accessionState, 'patients', response.data);
            }).catch(err=>{console.log(err)});
        },

        saveAccession: function(launch){
            var vm = this;

            if(!vm.validateSave())
            {
                //vm.$set(vm.accessionState, 'savedStatus', 'failed');
                //handled in validateSave
                return;
            }

            vm.$set(vm.accessionState.accession.customData, 'hold', !launch);

            vm.$set(vm.accessionState, 'currentAction', vm.accessionState.isNew ? 'Saving New': 'Saving');
            vm.$set(vm.accessionState, 'savingNow', true);

            vm.$set(vm.accessionState, 'loaded', false);

            if (!vm.isWorkflowInitialized(vm.accessionState.accession.specimens)) {
                vm.initializeWorkflow(vm.accessionState.accession.specimens);
            }
            vm.$nextTick(function() {$("#loadingModal").modal("show");});

            axios.post('/api/accessioning', {
                accession: vm.accessionState.accession,
                orgCustomData: vm.organization.customData,
                orgNameKey: vm.organization.nameKey,
                userFullName: vm.user.fullName,
                userId: vm.user.id}).then(response=>{
					vm.postSave(vm, response, true);
                    vm.$set(vm.accessionState, 'savedStatus', 'success');

                    var saveState = {
                        errorState: false,
                        messages: []
                    }

                    saveState.messages.push({ type: "Main", text: "Successfully saved Accession" });

                    vm.$set(vm, 'saveState', saveState);

     //               setTimeout(() => {
					//	vm.$set(vm.accessionState, 'savedStatus', null);
					//}, 3000);
                    //vm.$nextTick(function() { vm.finalizeView(); });
                    //vm.newAccession(true);
                }).catch(err => {                    
					vm.$set(vm.accessionState, 'savedStatus', 'failed');
                    var saveState = {
                        errorState: false,
                        messages: []
                    }

                    saveState.messages.push({ type: "Main", text: "Failed to save Accession" });
                    saveState.messages.push({ type: "Main", text: err });

                    vm.$set(vm, 'saveState', saveState);
                    vm.cleanup(err);
                });

        },

        postSave: function(vm, response, redirect){    
            //todo research mixin callbacks...
            vm.$set(vm.accessionState.accession, 'id', response.data.id);
            vm.setAccessionHistory(true);

            vm.$set(vm.accessionState,'loaded', true);
            vm.$set(vm.accessionState,'isNew', false);
            vm.$set(vm.accessionState, 'savingNow', false);

            if(redirect){
                vm.$nextTick(function() {  
                    vm.$router.push({name: 'New Accession', params:{guid: null, orgNameKey: vm.organization.nameKey}, query: {random: uuidV1()} }); //should reset querystring - doesn't belong here
                });
                return;
            }
            else{                        
                response.data.specimensInfo.forEach(function(s){
                    var spec = vm.accessionState.accession.specimens.find(function(s1){
                        return s1.guid === s.guid;
                    });
                    vm.$set(spec, 'barcodeNumber', s.barcodeNumber);
                });            
            }
            vm.$nextTick(function() { vm.finalizeView(); }); //circular reference hmm                      
        },

        getAccessionOrNew: function(guid, orgNameKey)
        {
            var vm = this;            
            if(vm.accessionState.isNew)
            {
                guid = uuidV1();
                vm.$set(this.accessionState.accession, 'guid', guid);
                return {"data": {"accession": vm.accessionState.accession}}; //use the default empty template
            }
            else
                return axios.get('/api/Accessioning/' + guid + '/' + orgNameKey)
           
        },

        newAccession: function(redirect){
            var vm = this;
            vm.$set(vm.accessionState, 'currentAction', 'Loading New');
            vm.$set(vm.accessionState, 'accession', null);
            vm.$set(vm.accessionState, 'accession', cloneDeep(vm.accessionState.accessionTemplate));
            vm.$set(vm.accessionState, 'editingComment', null);            
            vm.$set(vm.accessionState, 'isNew', true);       
        },

    }
});