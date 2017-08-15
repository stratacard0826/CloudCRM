//components
import ScanLookup from '../tools/ScanLookup.vue';
import AcquireSpecimens from '../orders/AcquireSpecimens.vue';
import AccessionOverview from '../entity_composites/AccessionOverview.vue';
import SpecimenListFull from '../entity_composites/SpecimenListFull.vue';
import SavedSearches from '../plugins/dashboardCards/SavedSearches.vue';

//data
import dashboardData from './SpecimenTracking.vue.data.js';

//utilities
import axios from 'axios';

//mixins
import historyItemsMixin from '../../mixins/historyItems.js';

module.exports = {
    name: 'SpecimenTracking',
    components: {
        ScanLookup,
        //SpecimenStatus,
        AcquireSpecimens,
        AccessionOverview,
        SpecimenListFull,
        SavedSearches
    },
    props: {
        organization: Object,
        user: Object,
    },
    mixins: [
        historyItemsMixin
    ],
    data: function () {
        return {
            dashboardState: dashboardData.dashboardState
        }
    },
    computed: {
        dashboardPlugins: {
            get: function () {
                var vm = this;
                var cards = [];
                var componentNames = [];
                //WTF: where does the data property on customData.dashboard come from?  It's not in the JSON???
                if (vm.userHasDashboardConfig()) {
                    cards = vm.user.customData.dashboard.data.dashboards.find(d => d.name === 'SpecimenTracking').cards;
                }
                else if (vm.orgHasDashboardConfig()) {
                    if (typeof vm.user.customData === 'undefined')
                        vm.user.customData = {};
                    vm.$set(vm.user.customData, 'dashboard', vm.organization.customData.dashboard);
                    cards = vm.user.customData.dashboard.data.dashboards.find(d => d.name === 'SpecimenTracking').cards;
                }
                for (var card of cards) {
                    componentNames.push(card.name)
                }

                return componentNames; //todo org-->user custom data parse
            }
        }
    },
    created: function () {
        var vm = this;
        if (typeof vm.$route.params.guid !== 'undefined') {
            vm.lookupSpecimenByGuid(vm, vm.$route.params.guid);
        }
    },
    mounted: function () {
        //bricklayer = new Bricklayer(document.querySelector('.bricklayer'));

    },
    methods: {
        userHasDashboardConfig: function () {
            var vm = this;
            var retVal = true;
            if (typeof vm.user.customData === 'undefined')
                retval = false;
            else if (typeof vm.user.customData.dashboard === 'undefined')
                retVal = false;
            else if (typeof vm.user.customData.dashboard.data === 'undefined') //WTF
                retVal = false;
            else if (typeof vm.user.customData.dashboard.data.dashboards === 'undefined')
                retVal = false;
            else if (vm.user.customData.dashboard.data.dashboards.find(d => d.name === 'SpecimenTracking') === null)
                retVal = false;
            return retVal;
        },

        orgHasDashboardConfig: function () {
            var vm = this;
            var retVal = true;
            if (typeof vm.organization.customData === 'undefined' ||
                typeof vm.organization.customData.dashboard === 'undefined' ||
                typeof vm.organization.customData.dashboard.data === 'undefined' ||
                typeof vm.organization.customData.dashboard.data.dashboards === 'undefined' ||
                vm.organization.customData.dashboard.data.dashboards.find(d => d.name = 'SpecimenTracking') === null) {
                retVal = false;
            }
            return retVal;
        },

        scanLookup: function (action, value) {
            var vm = this;

            vm.clearData(vm);

            switch (action) {
                case 'scan':
                    vm.setScanLookupMessage('Scanning barcode #', value);
                    vm.lookupSpecimenByBarcode(vm, value);
                    break;
                case 'lookup':
                default:
                    break;
            }
        },

        setScanLookupMessage: function (message, value, state) {
            var vm = this;
            vm.$set(vm.dashboardState, 'scanLookupMessage', message + ' ' + value);
            switch (state) {
                case 'success':
                    vm.$set(vm.dashboardState, 'lookupStateCssClass', 'text-success');
                    break;
                case 'failure':
                    vm.$set(vm.dashboardState, 'lookupStateCssClass', 'text-danger');
                    break;
                default:
                    vm.$set(vm.dashboardState, 'lookupStateCssClass', 'text-info');
                    break;
            }
        },

        lookupSpecimenByBarcode: function (vm, specimenBarcodeValue) {
            axios.get('/api/Barcode/' + specimenBarcodeValue + '/' + vm.organization.nameKey).then(barcodeResponse =>
                vm.$set(vm.dashboardState, 'barcode', barcodeResponse.data === '' ? null : barcodeResponse.data)
            ).then(function () {
                if (vm.dashboardState.barcode === null) {
                    vm.setScanLookupMessage('Could not locate barcode #', specimenBarcodeValue, 'failure');
                    return;
                }
                var specGuid = vm.getPrimarySpecimenGuidFromBarcode(vm.dashboardState.barcode);
                vm.setScanLookupMessage('Located barcode #', specimenBarcodeValue, 'info');
                vm.getAccession(vm, vm.dashboardState.barcode.accessionGuid, 'Successfully loaded data for barcode #', 'There was a problem loading data for barcode #', specimenBarcodeValue, specGuid);
            }).catch(err => {
                console.log(err);
                vm.setScanLookupMessage('There was a problem locating barcode #', specimenBarcodeValue, 'failure');
            })
        },

        lookupSpecimenByGuid: function (vm, guid) {
            axios.get('/api/Accessioning/GetBySpecimen/' + guid).then(function (response) {
                if (typeof response.data.specimenGuid === 'undefined') {
                    throw 'Invalid response data: ' + response.data;
                }
                var specId = response.data.externalSpecimenId === '' ? response.data.specimenId : response.data.externalSpecimenId;
                var specGuid = response.data.specimenGuid;
                vm.getAccession(vm, response.data.accessionGuid, 'Successfully loaded data for specimen #', 'There was a problem loading data for specimen #', specId, specGuid);
            }).catch(err => {
                console.log(err);
                vm.setScanLookupMessage('There was a problem loading data for specimen with unique ID', guid, 'failure');
            });
        },

        getAccession: function (vm, guid, successMessage, failureMessage, lookupValue, currentSpecimenGuid) {
            axios.get('/api/Accessioning/' + guid + '/' + vm.organization.nameKey).then(function (response) {
                if (typeof response.data.accession === 'undefined') {
                    vm.setScanLookupMessage(failureMessage, lookupValue, 'failure');
                    return;
                } //why continue? idk
                vm.setAccession(vm, response.data.accession);
                vm.setCurrentSpecimen(vm, response.data.accession, currentSpecimenGuid);
                vm.setScanLookupMessage(successMessage, lookupValue, 'success');
            }).catch(err => {
                console.log(err);
                vm.setScanLookupMessage(failureMessage, lookupValue, 'failure');
            });
        },

        getPrimarySpecimenGuidFromBarcode: function (barcode) {

            if (typeof barcode.customData === 'undefined')
                return null;
            if (typeof barcode.customData.specimenGuids === 'undefined')
                return null;
            if (barcode.customData.specimenGuids.length === 0)
                return null;

            return barcode.customData.specimenGuids[0];
        },

        clearData: function (vm) {
            vm.$set(vm.dashboardState, 'barcode', null);
            vm.$set(vm.dashboardState, 'accession', null);
            vm.$set(vm.dashboardState, 'currentSpecimen', null);
        },

        setAccession: function (vm, accession) {
            vm.$set(vm.dashboardState, 'accession', accession);
            vm.$nextTick(function () { $("#rightColumn").height($("#leftColumn").height()); });
        },

        setCurrentSpecimen: function (vm, accession, specimenGuid) {
            if (accession.specimens.length > 0) {
                vm.$set(vm.dashboardState, 'currentSpecimen',
                    accession.specimens.find(function (s) {
                        if (specimenGuid === null) {
                            return true;
                        }
                        return s.guid === specimenGuid;
                    }));

                vm.$set(vm.dashboardState, 'selectedSpecimens', []);
                accession.specimens.filter(function (s) { return s.customData.groupGuid === vm.dashboardState.currentSpecimen.customData.groupGuid; }).forEach(function (gr) {
                    vm.dashboardState.selectedSpecimens.push(gr.guid);
                });
                vm.setLookupHistory();
            }
        },

        specimenChanged: function (specimenIDs) // array of guids
        {
            this.$set(this.dashboardState, 'selectedSpecimens', specimenIDs);

        },

        updateOthers: function (updateNeeded) {
            this.$set(this.dashboardState, 'updateNeeded', updateNeeded);
        },

        setLookupHistory: function () {
            var vm = this;
            var spec = vm.dashboardState.currentSpecimen;

            var route = { name: vm.$route.name, meta: vm.$route.meta, params: { guid: spec.guid, orgNameKey: vm.organization.nameKey } };

            var subject = spec.type.type + ' ' + spec.transport.name;
            var headline = "Specimen " + (spec.externalId === '' || spec.externalId === null ? '# ' + spec.id : spec.externalId);

            var specTypes = vm.dashboardState.accession.specimens.map(function (s) { return s.type.type });
            var countedSpecTypes = [];

            specTypes.forEach(function (s) {
                typeof countedSpecTypes.find(function (c) {
                    return c.string === s
                }) === 'undefined' ? countedSpecTypes.push({ string: s, count: 1 }) : countedSpecTypes.find(function (c) {
                    return c.string === s
                }).count++;
            });
            var content = countedSpecTypes.map(function (c) { return c.count + ' ' + vm.$options.filters.pluralize(c.count, c.string) }).join(', ');            

            vm.setHistoryItems(spec, route, subject, content, headline, false, "", false);

        },

        //setCurrentLab: function(vm, accession)
        //{
        //    vm.currentLab = vm.lookup('lab', accession.orderingLabId, vm.labs);
        //},

        //setCurrentClient: function(vm, accession){
        //    vm.currentClient = vm.lookup('client', accession.clientId, vm.clients);
        //},

        //setCurrentPatient: function(vm, accession)
        //{
        //    vm.currentPatient = vm.lookup('patient', accession.patientId, vm.patients);
        //}
    }
};