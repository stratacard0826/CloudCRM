import worklistData from './Worklist.vue.data.js'; //rename to worklist..
var urlencode = require('urlencode');

import axios from 'axios';
import WorklistSpecimens from '../entity_composites/WorklistSpecimens.vue';
import AccessionInfo from '../entities/AccessionInfo.vue';
import WorklistCaseDetail from '../entity_composites/WorklistCaseDetail.vue';

import customDataHelpersMixin from '../../mixins/customDataHelpers.js';

import { mapGetters } from 'vuex';

module.exports = {
    name: "Worklist",
    components: {
        WorklistSpecimens,
        AccessionInfo,
        WorklistCaseDetail
    },
    mixins: [customDataHelpersMixin],
    props: {
        organization: Object
    },
    data: function () {
        return {
            state: worklistData.worklistState,
            worklist: worklistData.worklist
        };
    },
    computed: {
        ...mapGetters('accessionList', ['accessions']),
    },
    methods: {
        applyDataTables: function () {
            var vm = this;
            var table;

            vm.$nextTick(function () {
                table = $('#worklistTable').DataTable(
                    {
                        destroy: true,
                        buttons: [

                            { extend: 'copy', className: 'btn-primary float-right mr-1 ml-1' },
                            'excel',
                            'pdf',
                            { extend: 'colvis', className: 'btn-primary float-right mr-1 ml-1', text: "Columns" },
                            {
                                text: 'Advanced Search',
                                className: 'btn-primary float-right mr-1 ml-1',
                                action: function (e, dt, node, config) {
                                    $("#searchModal").modal()
                                }
                            }
                        ],
                        columnDefs: [
                            {
                                //"targets": 1,
                                //"data": "createdDate",
                                //"render": function ( data, type, full, meta ) {
                                //    return vm.$options.filters.localeDate(data);
                                //}
                            }
                        ]
                    }
                );
                table.buttons().container()
                    .appendTo($('.col-sm-6:eq(0)', table.table().container()));

            });

        },

        loadData: function (org, config) {
            var vm = this;

            var worklistUrl = '/api/Worklist/' + org.nameKey + '/' + config.start + '/' + config.end + '/' + urlencode(JSON.stringify(config.options));

            //clear the data for loading display - originally tried using null but for some reason v-if and/or the watcher didn't respond to that
            vm.$parent.$store.dispatch('accessionList/setAccessionList', 'loading placeholder');

            axios.get(worklistUrl).then(function (worklistResponse) {
                //vm.$set(vm, 'worklist', worklistResponse.data);

                //switch to vuex
                //todo: mixin for this?
                vm.$parent.$store.dispatch('accessionList/setAccessionList', worklistResponse.data);

            }
            ).catch(err => { console.log(err) });
        },
        setWorklistConfig: function (org) {
            this.state.config.start = Date.now() - 90;
            this.state.config.end = Date.now();
            this.state.config.options.includeCases = this.organizationUsesCases;
            this.state.config.options.includeSpecimens = this.organizationUsesSpecimens;
            this.state.config.options.restrictToOrg = this.$route.name !== 'Specimen Catalog';
        },
        startAccessionsWatcher: function (vm) {
            vm.$parent.$store.watch(
                function (state) {
                    return state.accessionList.accessions;
                },
                function () {
                    if (Array.isArray(vm.accessions)) {
                        vm.applyDataTables();
                    }
                }
            );
        },
    },
    mounted: function () {
        var vm = this;

        vm.startAccessionsWatcher(vm);

        vm.setWorklistConfig(vm.organization);

        if (vm.accessions === 'load placeholder') {
            vm.loadData(vm.organization, vm.state.config);
        }

    },
};