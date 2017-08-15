import axios from 'axios';

var visualization;
var vm;
var axiosInstance;

module.exports = {
    name: "LabGeochart",
    props: {
        organization: Object,
        user: Object,
        prop_id: String,
        region: String,
        mode: String,
        chartName: String,
        width: Number,
        height: Number
    },
    data: function () {
        return {
            placeData: [],
            currentRegion: "us_metro",
            regions: ["us_metro"],
            chart: {},
            viewCount: 0
        }
    },
    created: function () {
        vm = this;
        axiosInstance = axios.create({ vm: vm });
        vm.setRegion(vm.region, true);
    },
    mounted: function () {
        //google.charts.load('current', { 'packages': ['geochart'] } );      //see main    
        vm.chart = new google.visualization.GeoChart(document.getElementById(vm.prop_id + '_regions_div'));

        //temp
        vm.$nextTick(function () { vm.drawChart(); });;
    },
    methods:
    {
        getRegion: function () {
            var retVal = vm.currentRegion;

            //if (dataRegionType === 'State' && retVal.indexOf('US') !== 0) {
            //    retVal = 'US';
            //}

            vm.$set(vm, 'currentRegion', retVal);

            return retVal;
        },

        setRegion: function(region, initial) {
            vm.$set(vm, 'currentRegion', typeof region === 'undefined' ? '' : region); //redunant
            //vm.getPlaces(vm.currentRegion, initial);
        },

        selectRegion: function() {
            var selection = vm.chart.getSelection();
            var message = '';

            if (typeof selection !== 'undefined' && selection.length > 0) {
                //vm.setRegion(vm.placeData[selection[0].row].CountryRegion);
                vm.setRegion("")
            }

        },

        drawChart: function () {
                var data = google.visualization.arrayToDataTable([
                    ['Country', 'Specimens'],
                    ['NASHVILLE US-TN', 501],
                    ['GENEVA CH', 96]
            ]);

                //var data = new google.visualization.DataTable();
                //data.addColumn('string', 'Country');
                //data.addColumn('number', 'Value');
                //data.addColumn({ type: 'string', role: 'tooltip' });
                //data.addRows([[{ v: "Philadelphia, PA", f: "Philadelphia" }, 1, "Where I live"]]);
                //data.addRows([[{ v: "San Francsico, CA", f: "San Francsico" }, 1, "Where I'm moving to"]]);

                var options = {};

                options["region"] = "US";
                options['dataMode'] = 'markers';
                //options["width"] = '100%'; //'' + (vm.width - 50) + '';
                //options['height'] = '100%'; //'' + $('.dash-height-match').height() - 50 + '';
                options["resolution"] = 'metro';
                //options["colorAxis"] = { colors: ['red', 'blue'] };
                options["enableRegionInteractivity"] = true;

                //var region = vm.getRegion();

                //if (region.length > 0) {
                //    options["region"] = region;
                //}
                //options["resolution"] = 'metros';            

                //var chart = new google.visualization.GeoChart(document.getElementById('chart_div'));
                vm.chart.draw(data, options);
        }

    }
};