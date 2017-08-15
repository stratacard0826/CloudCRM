import { mapGetters } from 'vuex'

import searchData from './SpecimenCatalog.vue.data.js';
import SpecimenInfo from '../entities/SpecimenInfo.vue';
import PatientInfo from '../entities/PatientInfo.vue';
import AcquireSpecimen from '../orders/AcquireSpecimen.vue';
import ImageUploadView from '../tools/ImageUploadView.vue';
import customDataHelpersMixin from '../../mixins/customDataHelpers.js';
import specimenGroupsMixin from "../../mixins/specimenGroups.js";
import axios from 'axios';
import debounce from 'lodash/debounce';
var urlencode = require('urlencode');

module.exports = {
    name: "SpecimenCatalog",
    props: {
        organization: Object,
        user: Object
    },
    components: {
        PatientInfo,
        SpecimenInfo,
        AcquireSpecimen,
        ImageUploadView
    },
    data: function () {
        return {
            searchState: searchData.searchState,
            idsToHide: []
        };
    },
    created: function ()
    {
        var vm = this;
        if (Array.isArray(vm.accessions) && vm.accessions.length > 0) {
            vm.$set(vm.searchState, 'searched', true);
        }
        else {
            vm.loadRawWorklist();
        }
        //vm.getBarcodes(vm.organization.nameKey, vm.accessionGuid, vm);
    },
    computed: {
        searchResults: {
            get: function () {
                var vm = this;
                var resultCounter = 0;
                var retVal = [];
                if (!Array.isArray(vm.accessions)) { //handle some weird code for the other worklist - todo fix that
                    return retVal;
                }
                vm.accessions.forEach(function (acc) {
                    let patient = vm.patients.find(function (p) { return p.id === acc.accession.patientId; });
                    var groupedList = vm.getSpecimenGroupedList(acc.accession);
                    //let specimenGroup = [];
                    //acc.accession.specimens.forEach(function (spec) {
                    //    if (specimenGroup.findIndex(function (sg) { return sg.groupGuid === spec.customData.groupGuid; }) < 0) {
                    //        specimenGroup.push({
                    //            groupGuid: spec.customData.groupGuid,
                    //            primarySpecimen: spec,
                    //            specimens: [spec]
                    //        });
                    //    }
                    //    else {
                    //        specimenGroup.find(function (sg) { return sg.groupGuid === spec.customData.groupGuid; }).specimens.push(spec);
                    //    }
                    //});

                    groupedList.forEach(function (specGr) {
                        retVal.push({
                            id: resultCounter++,
                            patient,
                            specimenGroup: specGr,
                            accession: acc.accession
                        });
                    });
                });
                return retVal.filter(r => vm.idsToHide.indexOf(r.id) < 0);
            }
        },
        filtersData: {
            get: function () {
                var vm = this;
                var filters = [];

                var specimenGeneral = vm.getSpecimenAttributesBySection('General');
                var specimenPathology = vm.getSpecimenAttributesBySection('Pathology Detail');
                var patientDemographics = vm.getPatientAttributesBySection('Demographics');

                filters.push({
                    type: 'specimen',
                    label: 'Specimen',
                    attributes: []
                });

                filters.push({
                    type: 'patient',
                    label: 'Patient Demographics',
                    attributes: []
                });

                vm.searchResults.forEach(function (sr) {
                    sr.specimenGroup.specimens.forEach(function (spec) {
                        if (typeof spec.customData.attributes === 'undefined') {
                            return;
                        }
                        spec.customData.attributes.forEach(function (att) {
                            if (filters.find(function (flt) { return flt.type === 'specimen'; }).attributes.findIndex(function (a) { return a.name === att.name; }) < 0) {
                                let attribute = specimenGeneral.find(function (sg) { return sg.name === att.name; });
                                if (typeof attribute === 'undefined') {
                                    attribute = specimenPathology.find(function (sp) { return sp.name === att.name; });
                                }
                                if (typeof attribute === 'undefined') {
                                    return;
                                }
                                let values = [];
                                if (Array.isArray(att.value)) {
                                    att.value.forEach(function (val) {
                                        values.push({ name: val.name, count: 1 });
                                    });
                                }
                                else {
                                    values.push({ name: att.value.name, count: 1 });
                                }
                                if (att.name !== "Cost") {
                                    filters.find(function (flt) { return flt.type === 'specimen'; }).attributes.push({
                                        name: attribute.name,
                                        label: attribute.label,
                                        values
                                    });
                                }
                                else {
                                    let sortedCosts = values.sort(function (a, b) { if (a === "") { a = 0; } if (b === "") { b = 0; } return a.name - b.name; });
                                    if (vm.searchState.initialSearch) {
                                        vm.searchState.currentMinCost = Number(sortedCosts[0].name);
                                        vm.searchState.currentMaxCost = Number(sortedCosts[sortedCosts.length - 1].name);
                                    }
                                    filters.find(function (flt) { return flt.type === 'specimen'; }).attributes.push({
                                        name: attribute.name,
                                        label: attribute.label,
                                        values: [],
                                        min_value: Number(sortedCosts[0].name),
                                        max_value: Number(sortedCosts[sortedCosts.length - 1].name)
                                    });
                                }
                            }
                            else {
                                let filterAttribute = filters.find(function (flt) { return flt.type === 'specimen'; }).attributes.find(function (a) { return a.name === att.name; });
                                if (Array.isArray(att.value)) {
                                    att.value.forEach(function (val) {
                                        if (att.name === "Cost") {
                                            let cost = val.name === "" ? 0 : Number(val.name);
                                            if (Number(filterAttribute.min_value) > cost) {
                                                filterAttribute.min_value = cost;
                                                if (vm.searchState.initialSearch) {
                                                    vm.searchState.currentMinCost = cost;
                                                }
                                            }
                                            else if (Number(filterAttribute.max_value) < cost) {
                                                filterAttribute.max_value = cost;
                                                if (vm.searchState.initialSearch) {
                                                    vm.searchState.currentMaxCost = cost;
                                                }
                                            }
                                        }
                                        else {
                                            if (filterAttribute.values.findIndex(function (v) { return v.name === val.name; }) >= 0) {
                                                filterAttribute.values.find(function (v) { return v.name === val.name; }).count++;
                                            }
                                            else {
                                                filterAttribute.values.push({ name: val.name, count: 1 });
                                            }
                                        }
                                    });
                                }
                                else {
                                    if (att.name === "Cost") {
                                        let cost = att.value.name === "" ? 0 : Number(att.value.name);
                                        if (Number(filterAttribute.min_value) > cost) {
                                            filterAttribute.min_value = cost;
                                            if (vm.searchState.initialSearch) {
                                                vm.searchState.currentMinCost = cost;
                                            }
                                        }
                                        else if (Number(filterAttribute.max_value) < cost) {
                                            filterAttribute.max_value = cost;
                                            if (vm.searchState.initialSearch) {
                                                vm.searchState.currentMaxCost = cost;
                                            }
                                        }
                                    }
                                    else {
                                        if (filterAttribute.values.findIndex(function (v) { return v.name === att.value.name; }) >= 0) {
                                            filterAttribute.values.find(function (v) { return v.name === att.value.name; }).count++;
                                        }
                                        else {
                                            filterAttribute.values.push({ name: att.value.name, count: 1 });
                                        }
                                    }
                                }
                            }
                        });
                    });

                    if (typeof sr.patient.customData.attributes === 'undefined') {
                        return;
                    }
                    sr.patient.customData.attributes.forEach(function (att) {
                        if (filters.find(function (flt) { return flt.type === 'patient'; }).attributes.findIndex(function (a) { return a.name === att.name; }) < 0) {
                            let attribute = patientDemographics.find(function (pd) { return pd.name === att.name; });
                            if (typeof attribute === 'undefined') {
                                return;
                            }
                            let values = [];
                            if (Array.isArray(att.value)) {
                                att.value.forEach(function (val) {
                                    values.push({ name: val.name, count: 1 });
                                });
                            }
                            else {
                                values.push({ name: att.value.name, count: 1 });
                            }
                            filters.find(function (flt) { return flt.type === 'patient'; }).attributes.push({
                                name: attribute.name,
                                label: attribute.label,
                                values
                            });
                        }
                        else {
                            let filterAttribute = filters.find(function (flt) { return flt.type === 'patient'; }).attributes.find(function (a) { return a.name === att.name; });
                            if (Array.isArray(att.value)) {
                                att.value.forEach(function (val) {
                                    if (filterAttribute.values.findIndex(function (v) { return v.name === val.name; }) >= 0) {
                                        filterAttribute.values.find(function (v) { return v.name === val.name; }).count++;
                                    }
                                    else {
                                        filterAttribute.values.push({ name: val.name, count: 1 });
                                    }
                                });
                            }
                            else {
                                if (filterAttribute.values.findIndex(function (v) { return v.name === att.value.name; }) >= 0) {
                                    filterAttribute.values.find(function (v) { return v.name === att.value.name; }).count++;
                                }
                                else {
                                    filterAttribute.values.push({ name: att.value.name, count: 1 });
                                }
                            }
                        }
                    });
                });

                filters.forEach(function (flt) {
                    flt.attributes.forEach(function (att) {
                        att.values.filter(function (val) { return val.name === ""; }).forEach(function (v) {
                            v.name = "Not Specified";
                        });
                    });
                });

                vm.searchState.initialSearch = false;
                return filters;
            }
        },
        ...mapGetters('lookupData', ['patients']),
        ...mapGetters('accessionList', ['accessions'])
    },
    methods: {

        runSearch: function () {
            var vm = this;
            vm.$set(vm.searchState, 'searching', true);
            vm.searchState.initialSearch = true;
            axios.post('/api/Search/CatalogSearch', {
                attributePattern: vm.searchState.query
            }).then(response => {
                vm.handleSearchResponse(response.data);
                });
        },

        handleSearchResponse: function (data) {
            var vm = this;
            vm.$parent.$store.dispatch('accessionList/setAccessionList', data);
            vm.$set(vm.searchState, 'searched', true);
            vm.$set(vm.searchState, 'searching', false);
        },

        getIDsToHide: function (type, attribute, attributeValue, minCost, maxCost) {
            var vm = this;
            var retArray = [];
            minCost = Number(minCost);
            maxCost = Number(maxCost);

            vm.searchResults.forEach(function (sr) {
                if (typeof sr.specimenGroup.primarySpecimen === 'undefined') {
                    retArray.push(sr.id);
                    return;
                }
                let costAttribute = sr.specimenGroup.primarySpecimen.customData.attributes.find(function (att) { return att.name === 'Cost' });
                if (typeof costAttribute === 'undefined') {
                    retArray.push(sr.id);
                    return;
                }
                if ((Array.isArray(costAttribute.value) && (costAttribute.value.every(function (ca) { return Number(ca.name) < minCost }) || costAttribute.value.every(function (ca) { return Number(ca.name) > maxCost }))) ||
                    (!Array.isArray(costAttribute.value) && (Number(costAttribute.value.name) < minCost || Number(costAttribute.value.name) > maxCost ))) {
                    retArray.push(sr.id);
                    return;
                }
                if (attribute === "Cost") {
                    return retArray;
                }
                let resultAttribute;
                if (type === 'patient') {
                    if (typeof sr.patient.customData.attributes === 'undefined') {
                        retArray.push(sr.id);
                        return;
                    }
                    resultAttribute = sr.patient.customData.attributes.find(function (att) {
                        let isValue = false;
                        if (att.name !== attribute) {
                            return false;
                        }
                        if (Array.isArray(att.value)) {
                            if (att.value.findIndex(function (v) { return v.name === attributeValue; }) >= 0) {
                                isValue = true;
                            }
                        }
                        else {
                            isValue = (att.value.name === attributeValue);
                        }

                        return isValue;
                    });
                }
                else if (type === 'specimen') {
                    if (typeof sr.specimenGroup.primarySpecimen.customData.attributes === 'undefined') {
                        retArray.push(sr.id);
                        return;
                    }
                    resultAttribute = sr.specimenGroup.primarySpecimen.customData.attributes.find(function (att) {
                        let isValue = false;
                        if (att.name !== attribute) {
                            return false;
                        }
                        if (Array.isArray(att.value)) {
                            if (att.value.findIndex(function (v) { return v.name === attributeValue; }) >= 0) {
                                isValue = true;
                            }
                        }
                        else {
                            isValue = (att.value.name === attributeValue);
                        }

                        return isValue;
                    });
                }

                if (typeof resultAttribute === 'undefined') {
                    retArray.push(sr.id);
                }
            });

            return retArray;
        },

        filterSelected: function (eventData) {
            var vm = this;
            var filterSpecificHiddenIDs = [];

            vm.$set(vm.searchState, 'filtering', true); //not really needed

            var type = eventData.currentTarget.getAttribute("attributeType");
            var attribute = eventData.currentTarget.getAttribute("parentAttribute");
            var attributeValue = eventData.currentTarget.getAttribute("attributeValue");
            var minCost = vm.$refs.minCostFilter[0].value === "" ? Number(vm.searchState.currentMinCost) : Number(vm.$refs.minCostFilter[0].value);
            var maxCost = vm.$refs.maxCostFilter[0].value === "" ? Number(vm.searchState.currentMaxCost) : Number(vm.$refs.maxCostFilter[0].value);
            
            if (attributeValue === 'Not Specified' || attributeValue === 'Not Specified') {
                attributeValue = "";
            }

            if (!eventData.currentTarget.checked) {
                let flt = vm.searchState.filterSelectedList.find(function (f) { return f.type === type && f.name === attribute && f.value === attributeValue; });
                let ind = vm.searchState.filterSelectedList.indexOf(flt);
                vm.idsToHide = [];
                if (ind >= 0) {
                    vm.searchState.filterSelectedList.splice(ind, 1);
                }
                vm.searchState.filterSelectedList.forEach(function (fsl) {
                    filterSpecificHiddenIDs = vm.getIDsToHide(fsl.type, fsl.name, fsl.value, minCost, maxCost);
                    vm.idsToHide = vm.idsToHide.concat(filterSpecificHiddenIDs);
                    fsl.hiddenIDs = fsl.hiddenIDs.concat(filterSpecificHiddenIDs);
                });
            }
            else {
                filterSpecificHiddenIDs = vm.getIDsToHide(type, attribute, attributeValue, minCost, maxCost);
                vm.idsToHide = vm.idsToHide.concat(filterSpecificHiddenIDs);
                vm.searchState.filterSelectedList.push({
                    type,
                    name: attribute,
                    value: attributeValue,
                    hiddenIDs: filterSpecificHiddenIDs
                });
            }

            vm.$set(vm.searchState, 'filtering', false);
        },

        costFiltered: debounce(function (eventData) {
            var vm = this;
            vm.$set(vm.searchState, 'filtering', true); //not really needed

            var type = eventData.target.getAttribute("attributeType");
            var attribute = eventData.target.getAttribute("parentAttribute");
            var minCost = vm.$refs.minCostFilter[0].value === "" ? Number(vm.searchState.currentMinCost) : Number(vm.$refs.minCostFilter[0].value);
            var maxCost = vm.$refs.maxCostFilter[0].value === "" ? Number(vm.searchState.currentMaxCost) : Number(vm.$refs.maxCostFilter[0].value);
            var filterSpecificHiddenIDs = [];
            var changes = [];
            var rangeSet = false;
            var rangeUnset = false;

            if ((vm.$refs.minCostFilter[0].value === vm.searchState.previousMinCost) && (vm.$refs.maxCostFilter[0].value === vm.searchState.previousMaxCost)) {
                vm.$set(vm.searchState, 'filtering', false);
                return;
            }
            if ((vm.searchState.previousMinCost === "" && vm.$refs.minCostFilter[0].value !== "") || vm.searchState.previousMaxCost === "" && vm.$refs.maxCostFilter[0].value !== "") {
                rangeSet = true;
            }
            if ((vm.searchState.previousMinCost !== "" && vm.$refs.minCostFilter[0].value === "") || vm.searchState.previousMaxCost !== "" && vm.$refs.maxCostFilter[0].value === "") {
                rangeUnset = true;
            }
            vm.searchState.previousMinCost = vm.$refs.minCostFilter[0].value;
            vm.searchState.previousMaxCost = vm.$refs.maxCostFilter[0].value;


            var flt = vm.searchState.filterSelectedList.find(function (f) { return f.type === type && f.name === attribute });
            if (rangeUnset) {
                if (typeof flt !== 'undefined') {
                    let ind = vm.searchState.filterSelectedList.indexOf(flt);
                    if (ind >= 0) {
                        vm.searchState.filterSelectedList.splice(ind, 1);
                    }
                }
                vm.idsToHide = [];
                vm.searchState.filterSelectedList.forEach(function (fsl) {
                    filterSpecificHiddenIDs = vm.getIDsToHide(fsl.type, fsl.name, fsl.value, minCost, maxCost);
                    vm.idsToHide = vm.idsToHide.concat(filterSpecificHiddenIDs);
                    fsl.hiddenIDs = fsl.hiddenIDs.concat(filterSpecificHiddenIDs);
                });
            }
            if (rangeSet) {
                filterSpecificHiddenIDs = vm.getIDsToHide(type, attribute, 0, minCost, maxCost);
                vm.idsToHide = vm.idsToHide.concat(filterSpecificHiddenIDs);
                vm.searchState.filterSelectedList.push({
                    type,
                    name: attribute,
                    value: "",
                    hiddenIDs: filterSpecificHiddenIDs
                });
            }

            vm.$set(vm.searchState, 'filtering', false);
        }, 1000),

        isFilterChecked: function (type, name, value) {
            var val = value === 'Not Specified' ? "" : value;
            return this.searchState.filterSelectedList.findIndex(function (f) { return f.type === type && f.name === name && f.value === val; }) >= 0;
        },

        clearFilters: function () {
            var vm = this;
            vm.$set(vm, 'idsToHide', []);
            vm.$set(vm.searchState, 'filterSelectedList', []);
            if (typeof vm.$refs.minCostFilter[0] !== 'undefined') {
                vm.$refs.minCostFilter[0].value = "";
                vm.$refs.maxCostFilter[0].value = "";
            }
            vm.searchState.previousMinCost = "";
            vm.searchState.previousMaxCost = "";
        },

        loadRawWorklist: function () {
            var vm = this;

            vm.$set(vm.searchState, 'loading', true);
            vm.searchState.initialSearch = true;

            var config = {
                start: Date.now() - 90,
                end: Date.now(),
                options: {
                    includeCases: false,
                    includeSpecimens: true,
                    restrictToOrg: false
                }
            };

            var worklistUrl = '/api/Worklist/' + vm.organization.nameKey + '/' + config.start + '/' + config.end + '/' + urlencode(JSON.stringify(config.options));

            //clear the data for loading display - originally tried using null but for some reason v-if and/or the watcher didn't respond to that
            vm.$parent.$store.dispatch('accessionList/setAccessionList', 'loading placeholder');

            axios.get(worklistUrl).then(function (worklistResponse) {
                vm.$parent.$store.dispatch('accessionList/setAccessionList', worklistResponse.data);
                vm.$set(vm.searchState, 'loading', false); //not really needed
            }
            ).catch(err => { console.log(err) });
        },
    }
}