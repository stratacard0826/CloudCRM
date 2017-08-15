import customDataHelpersMixin from '../../../mixins/customDataHelpers.js';
import axios from 'axios';
var urlencode = require('urlencode');

module.exports = {
    name: "TopSpecimens",
    data: function () {
        var vm = this;
        return {
            attributes: [],
            currentAttribute: "",
            chart: {},
            chartName: "Top " + vm.mode,
            dataLoaded: false,
            rawData: []
        };
    },
    props: {        
        organization: Object,
        user: Object,
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
        vm.getPatientAttributes();
        vm.getSpecimenAttributes();
        vm.$set(vm, 'attributes', vm.attributes.sort(a => a.name));

        var att = vm.attributes.find(a => a.name == vm.default_attribute_name);
        if (typeof att === 'undefined') {
            att = vm.attributes[0];
        }      

        vm.$set(vm, 'currentAttribute', att);

        vm.setAttribute(vm.currentAttribute);
    },
    computed: {
        chartData: {
            get: function () {
                var vm = this;
                var chartDataArray = [[vm.currentAttribute.label, vm.mode]];

                if (vm.rawData.length === 0)
                {
                    vm.$set(vm, 'rawData', [{ value: "No Data", specimens: 0, accessions: 0 }]);
                }

                chartDataArray = chartDataArray.concat(vm.rawData.map(function (d) {
                    return [d.value, vm.mode === 'Specimens' ? d.specimens : d.accessions];
                }));

                if (vm.max_chart_records > 0) {
                    chartDataArray = chartDataArray.slice(0, vm.max_chart_records - 1);
                }

                var chartData = google.visualization.arrayToDataTable(chartDataArray);

                return chartData;
            }
        },
        maxValue: {
            get: function () {
                var vm = this;
                return Math.max.apply(null, vm.rawData.map(d => (vm.mode === 'Specimens' ? d.specimens : d.accessions)));
            }
        }
    },
    methods: {
        setAttribute: function (attribute) {
            var vm = this;
            vm.$set(vm, 'currentAttribute', attribute);
            vm.$set(vm, 'chartName', 'Top ' + (vm.max_chart_records === 0 ? '' : vm.max_chart_records + ' ') + vm.mode + ' by ' + attribute.label);
            vm.getData();
        },
        getPatientAttributes: function () {
            var vm = this;
            vm.$set(vm, 'attributes', vm.attributes.concat(vm.getPatientAttributesBySection('Demographics')));
        },
        getSpecimenAttributes: function () {
            var vm = this;
            for (var row of vm.organization.customData.specimenAccessionSections.rows) {
                for (var col of row.cols) {
                    vm.$set(vm, 'attributes', vm.attributes.concat(vm.getSpecimenAttributesBySection(col.sectionName)));
                }
            }
        },
        getData: function () {
            var vm = this;
            axios.post('/api/Analysis/GetGenericAnalysisResults', {
                name: 'get_generic_analysis_counts',
                parameters: [{ name: 'attribute_name', value: vm.currentAttribute.name }]
            }).then(function (response) {
                //if (response.data.length === 0) {
                //    vm.$set(vm, 'dataLoaded', false);
                //    vm.$nextTick(function () { vm.clearChart(); });
                //}
                //else {
                    vm.$set(vm, 'dataLoaded', true);
                    vm.$set(vm, 'rawData', response.data);
                    vm.$nextTick(function () { vm.drawChart(); });
                //}                
            });
        },
        clearChart: function () {
            var vm = this;
            vm.chart.clearChart();
            document.getElementById(vm.prop_id + '_no_data').innerText = "No Records Found"; //hack
        },
        drawChart: function () {
            var vm = this;            

            vm.$set(vm, 'chart', new google.visualization.BarChart(document.getElementById(vm.prop_id + '_attributes_div')));

            var options = {                

                //title: vm.chartName,
                //chartArea: { width: '50%' },
                hAxis: {
                    //title: 'Total ' + vm.mode,
                    minValue: 0,
                    maxValue: vm.maxValue
                },
                vAxis: {
                    //title: vm.currentAttribute.label
                },
                chartArea: {
                    left: 150,
                    width: 400
                },
                width: vm.width - 50,
                height: 350,
                legend: 'none'
            };                        

            vm.chart.draw(vm.chartData, options);

            google.visualization.events.addListener(vm.chart, 'select', vm.selectAttribute);
        },
        selectAttribute: function () {
            var vm = this;
            var selection = vm.chart.getSelection();
            //TODO figure out why vm.chartData.getValue is "not a function" - something to do with vue probably.  how to get chart handle without using vue.data???
            //TODO figure out multi-select/composite scenarios
            var att = vm.rawData[selection[0].row];

            vm.$parent.$store.dispatch('accessionList/setAccessionList', 'search placeholder');
            //get new data
            axios.post('/api/Search/SearchAttributes', {
                orgNameKey: vm.organization.nameKey,
                searchJson: [{
                    entityType: att.type,
                    attributeLabel: vm.currentAttribute.label,
                    attributeName: vm.currentAttribute.name,
                    criteria: [att.value]
                }]
            }).then(response => {
                vm.$parent.$store.dispatch('accessionList/setAccessionList', response.data);
                if (vm.user.groups.items.findIndex(g => g.name === 'Customer') > -1) {
                    vm.$router.push({ name: 'Specimen Catalog' });
                }
                else {
                    vm.$router.push({ name: 'Specimen Inventory' });
                }
                }).catch(err => { console.log(err) });

        }
    }
};