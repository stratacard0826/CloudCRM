import { mapGetters, mapActions } from 'vuex';
import AttributeSearch from './AttributeSearch.vue';
import Worklist from '../route_pages/Worklist.vue';
import axios from 'axios';

import entityLookupMixin from '../../mixins/entityLookup.js'
import customDataHelpersMixin from '../../mixins/customDataHelpers.js';

require('../../assets/js/move.js');

module.exports = {
    name: "SearchModal",
    props: {
        organization: Object,
        user: Object
    },
    mixins:[
        entityLookupMixin,
        customDataHelpersMixin
    ],
    components:{
        AttributeSearch,
        Worklist
    },
    data: function()
    {
        return {
            searchValues: [],
            allAttributes: [],
            //searchResult: []
        }
    },
    methods: {

        attributesLoaded: function(attributes, entityType)
        {
            var vm = this;
            vm.allAttributes = vm.allAttributes.filter(v=> v.entityType !== entityType);
            vm.$set(vm, 'allAttributes', vm.allAttributes.concat(attributes.map(function(a) { a["entityType"] = entityType; return a; })));
        },
        searchValuesChanged: function(values, entityType)
        {
            var vm = this;
            vm.searchValues = vm.searchValues.filter(v=> v.entityType !== entityType); //remove existing values for this type
            vm.$set(vm, 'searchValues', vm.searchValues.concat(values));

            var nextIndex = 0;
            //reorder attributes list
            for(let attribute of vm.allAttributes.map(a=> a)) //should create a copy hopefully
            {
                var foundIndex = vm.searchValues.map(v => v.attributeName).indexOf(attribute.name);
                if(foundIndex > -1)
                {
                    vm.allAttributes.move(vm.allAttributes.indexOf(attribute), nextIndex);
                    nextIndex++;
                }
            }
        },

        search: function()
        {
            var vm = this;

            //switch to vuex
            //todo: mixin for this?
            //clear the data for loading display
            vm.$parent.$store.dispatch('accessionList/setAccessionList', 'search placeholder');
            //get new data
            axios.post('/api/Search/SearchAttributes', { orgNameKey: vm.organization.nameKey, searchJson: vm.searchValues }).then(response => {
                vm.$parent.$store.dispatch('accessionList/setAccessionList', response.data);
            }).catch(err => { console.log(err) });


            var savedSearches = vm.user.customData.savedSearches;
            if(typeof savedSearches === 'undefined'){
                savedSearches = [];
            }
            var existingSearchIndex = savedSearches.findIndex(s => JSON.stringify(s.searchValues.sort()) === JSON.stringify(vm.searchValues.sort()));
            if(existingSearchIndex > -1){
                savedSearches.splice(existingSearchIndex, 1);
            }

            savedSearches.push({date: new Date().toJSON(), searchValues: vm.searchValues});
            vm.$parent.$store.dispatch({type: 'user/updateCustomData', dataKeyValue: {key: 'savedSearches', value: savedSearches}});
            //update locally also to avoid roundtrip to stormpath/etc
            vm.$set(vm.user.customData, 'savedSearches', savedSearches);

            if (vm.$route.path.indexOf('worklist') < 0) { //only navigate if we're not already looking at a list
                if (vm.user.groups.items.findIndex(g => g.name === 'Customer') > -1) {
                    vm.$router.push({ name: 'Specimen Catalog' });
                }
                else {
                    vm.$router.push({ name: 'Specimen Inventory' });
                }
            }

            $("#searchModal").modal("hide");

            //bug here - hack
            $(".modal-backdrop").hide();
        },

        //selectAccession: function(accession)
        //{
        //    var vm = this;
        //    if (vm.user.groups.findIndex(g => g.name === 'Customer User') > -1) {
        //        vm.$router.push({ name: 'Specimen View', params: { guid: vm.getMatchingSpecimen(accession).guid } });
        //    }
        //    else {
        //        vm.$router.push({ name: 'Specimen Tracking', params: { guid: vm.getMatchingSpecimen(accession).guid } });
        //    }
        //},

        //getAccessionValueByAttribute: function(accession, attribute){
        //    var vm = this;
        //    var retVal = "";
        //    var value = vm.searchValues.find(v=> v.attributeName === attribute.name && v.entityType === attribute.entityType);
        //    if(typeof value !== 'undefined')
        //        {retVal = vm.getAccessionValue(accession, value);}
        //    return retVal;
        //},

        getMatchingSpecimen: function(accession)
        {
            //now handled in DAL
            return accession.specimens[0];
        },

        getAccessionValue: function(accession, attribute)
        {
            var vm = this;
            var retVal = '[no data]';
            switch(attribute.entityType){
                case "patient":
                    var values = vm.currentPatientAttributeValue(vm.lookup('patient', accession.patientId, vm.patients), attribute.name, false);
                    if(Array.isArray(values)) { retVal = values.map(v => v.name).join(', '); }
                    break;
                case "specimen":
                    var allAttr = [];
                    for (var specimen of accession.specimens){
                        var specAtts = vm.currentSpecimenAttributeValue(specimen, attribute.name);
                        if(Array.isArray(specAtts)){
                            allAttr = allAttr.concat(specAtts.map(v => v.name));
                        }
                    }
                    retVal = allAttr.filter(function(elem, index, self) {
                        return index == self.indexOf(elem);
                    }).join(', ');;
                    break;
            }
            return retVal;
        }
    },
    computed:{
        ...mapGetters('lookupData', ['clients', 'patients', 'doctors','labs','lookupDataLoaded'])
}
};