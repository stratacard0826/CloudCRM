import customDataHelpersMixin from '../../../mixins/customDataHelpers.js';
import axios from 'axios';
var urlencode = require('urlencode');

module.exports = {
    name: "LabWorkflowChart",
    data: function () {
        var vm = this;
        return {
            attributes: [],
            currentType: "Paraffin Tissue",
            currentWorkflow: "Logistics",
            chart: {},
            chartName: "Top " + vm.mode,
            dataLoaded: false,

            tempData: [
                ["Day", "Received", "QC", "Archived", "Shipped/Checked Out"],
                ["6/18/2017", 12, 11, 7, 4],
                ["6/19/2017", 14, 12, 6, 5],
                ["6/20/2017", 10, 13, 4, 6],
                ["6/21/2017", 10, 14, 4, 5],
                ["6/22/2017", 9, 9, 5, 3],
            ],
            types: ["Paraffin Tissue"],
            workFlows: ["Logistics", "Histology"],
        };
    },
    props: {
        organization: Object,
        prop_id: String,
        mode: String,
        max_chart_records: { default: 0 },
        width: Number,
        default_attribute_name: { default: '' }
    },
    mixins: [
        customDataHelpersMixin
    ],
    created: function () {
        var vm = this;
        vm.dataLoaded = true;
    },
    mounted: function () {
        var vm = this;        
        vm.drawChart(vm.tempData);
    },
    methods: {
        getData: function () {
            var vm = this;

        },
        setType: function (type) {

        },
        setWorkflow: function (workflow) {

        },
        clearChart: function () {
            var vm = this;
            vm.chart.clearChart();
            document.getElementById(vm.prop_id + '_no_data').innerText = "No Records Found"; //hack
        },
        drawChart: function (data) {
            var vm = this;
          
            vm.chart = new google.visualization.SteppedAreaChart(document.getElementById(vm.prop_id + '_lab_workflow_div'));
        
            var chartData = google.visualization.arrayToDataTable(vm.tempData);

            var options = {
                //vAxis: { title: 'All Specimens' },                
                isStacked: 'percent',
                legend: 'bottom',
                height: '300'
            };

            vm.chart.draw(chartData, options);
        }
    }
};