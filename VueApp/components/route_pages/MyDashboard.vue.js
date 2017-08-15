import SpecimenGeochart from '../plugins/dashboardCards/SpecimenGeoChart.vue';
import TopSpecimens from '../plugins/dashboardCards/TopSpecimens.vue';
import ClientTools from '../plugins/dashboardCards/ClientTools.vue';
import CustomerTools from '../plugins/dashboardCards/CustomerTools.vue';
import LabWorkflowChart from '../plugins/dashboardCards/LabWorkflowChart.vue';
import LabGeochart from '../plugins/dashboardCards/LabGeoChart.vue';

require('jquery-match-height');

module.exports = {
    name: 'MyDashboard',
    props: {
        organization: Object,
        user: Object
    },
    components: {
        LabGeochart,
        SpecimenGeochart,
        TopSpecimens,
        ClientTools,
        CustomerTools,
        LabWorkflowChart
    },
    mounted: function()
    {
        var vm = this;
        var bricklayer = new Bricklayer(document.querySelector('.bricklayer'));
        vm.$nextTick(function () {
            $('.dash-height-match').matchHeight(
                {
                    byRow: false,
                    property: 'height',
                    target: null,
                    remove: false
                });
        });
    },
    watch: {
        '$route': function () {
            window.document.title = vm.organization.name + ' - ' + vm.$route.meta.title;
        },
    },
};