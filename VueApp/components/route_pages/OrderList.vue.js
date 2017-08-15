import axios from 'axios';
import { mapGetters } from 'vuex';

import PatientInfo from '../entities/PatientInfo.vue';
import SpecimenInfo from '../entities/SpecimenInfo.vue';
import OrderDetail from '../entity_composites/OrderDetail.vue';

module.exports = {
    name: "OrderList",
    components: {
        PatientInfo,
        SpecimenInfo,
        OrderDetail
    },
    mixins: [],
    props: {
        organization: Object
    },
    data: function () {
        return {

        };
    },
    computed: {
        ...mapGetters('order', ['orders']),
    },
    created: function () {
        var vm = this;
        vm.orders.forEach(function (o) {
            vm.getAccession(o);
        });
    },
    mounted: function () {
        //applyDataTables();
    },
    methods: {
        getAccession: function (order) {
            var vm = this;
            axios.get('/api/Accessioning/' + order.accessionGuid + '/' + vm.organization.nameKey).then(function (response) {
                vm.$set(order, 'accession', response.data);
            });
        },
        getSpecimenId: function (specimen) {
            var id = "# " + specimen.id;
            if (specimen.externalId && specimen.externalId.length > 0) {
                id = specimen.externalId;
            }
            return id;
        },
        applyDataTables: function () {
            var vm = this;
            var table;

            vm.$nextTick(function () {
                table = $('#orderListTable').DataTable(
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

        }
    }
};