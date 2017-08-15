import axios from 'axios';

var visualization;
var vm;
var axiosInstance;

module.exports = {
    name: "SpecimenGeochart",
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
            currentRegion: "",
            regions: [],
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
    },
    methods: {
        browse: function () {
            var vm = this;
            vm.$parent.$store.dispatch('accessionList/setAccessionList', 'search placeholder');

            axios.post('/api/Search/CustomSearch', {
                function: "search_georegion",
                parameterString: vm.currentRegion.indexOf('-') > 0 ? vm.currentRegion.split('-')[1] : vm.currentRegion
            }).then(response => {                
                vm.$parent.$store.dispatch('accessionList/setAccessionList', response.data); //.map(d => d.accession)); //TODO change inventory to use search result format
                if (vm.user.groups.items.findIndex(g => g.name === 'Customer') > -1) {
                    vm.$router.push({ name: 'Specimen Catalog' });
                }
                else {
                    vm.$router.push({ name: 'Specimen Inventory' });
                }
            }).catch(err => { console.log(err) });

        },

        getRegion: function (dataRegionType) {
            var retVal = vm.currentRegion;

            //if (dataRegionType === 'State' && retVal.indexOf('US') !== 0) {
            //    retVal = 'US';
            //}

            vm.$set(vm, 'currentRegion', retVal);

            return retVal;
        },

        setRegion(region, initial) {
            vm.$set(vm, 'currentRegion', typeof region === 'undefined' ? '' : region); //redunant
            vm.getPlaces(vm.currentRegion, initial);
        },

        selectRegion() {
            var selection = vm.chart.getSelection();
            var message = '';

            if (typeof selection !== 'undefined' && selection.length > 0) {
                vm.setRegion(vm.placeData[selection[0].row].CountryRegion);
            }

        },

        drawMap: function (id, mode, type) {

            var options = {};

            //options["width"] = '' + (vm.width - 50) + '';
            //options["height"] = '' + (vm.height > 0 ? (vm.height - 50) : 400) + '';

            var region = vm.getRegion(type);

            if (region.length > 0) {
                options["region"] = region;
            }

            if (type === "Metro") {
                options["resolution"] = 'metros';
            }
            else if (type === "State") {
                options["resolution"] = 'provinces';
            }

            var data = new google.visualization.DataTable();
            data.addColumn('string', type);
            data.addColumn('number', mode);
            data.addRows(vm.placeData.length);
            vm.placeData.forEach(function (p, index) {
                data.setCell(index, 0, p.CountryRegion);
                data.setCell(index, 1, p.Count);
            });

            //console.log('drawing map ' + id);
            vm.chart.draw(data, options);

            google.visualization.events.addListener(vm.chart, 'select', vm.selectRegion);
        },
        getPlaces: function (region, initial) {
            axiosInstance.post('/api/Analysis/GetGenericAnalysisResults', { name: 'get_accession_specimen_geomap', parameters: [] }).then(response => {
                var type = "Country";

                if (initial) {
                    response.config.vm.regions.push('');
                    response.data.forEach(function (p) {
                        if (response.config.vm.regions.indexOf(p.country) < 0) {
                            response.config.vm.regions.push(p.country);
                        }
                        if (p.country === 'US' && response.config.vm.regions.indexOf(p.region) < 0) {
                            response.config.vm.regions.push('US-' + p.region);
                        }

                    });
                }

                if (region.length > 0) {
                    if (region.indexOf('US') !== 0) {//it's not US so filter by country
                        response.data = response.data.filter(d => d.country === region)
                    }
                    else {  //handle some more detailed level rendering
                        response.data = response.data.filter(d => d.country === 'US');
                        //todo check if they're all metro codes - unlikely and requires additional data from db
                        if (response.data.every(d => d.country != d.region)) { //they're all state level or lower
                            type = 'State';
                            //finally if we want a particular state do a final filter
                            if (region.indexOf('-') > 0) {
                                response.data = response.data.filter(d => 'US-' + d.region === region);
                            }
                        }
                    }
                }

                var jsonArray;
                var regionString;
                switch (response.config.vm.mode) {
                    case "Accessions":
                        jsonArray = response.data.map(function (d) {
                            regionString = ((type === 'Country' || d.region === 'US') ? d.country : 'US-' + d.region);
                            return JSON.parse('{ "CountryRegion": "' + regionString + '", "Count": ' + d.accessions + ' }');
                        });                        
                        break;
                    default:
                        jsonArray = response.data.map(function (d) {
                            regionString = ((type === 'Country' || d.region === 'US') ? d.country : 'US-' + d.region);
                            return JSON.parse('{ "CountryRegion": "' + regionString + '", "Count": ' + d.specimens + ' }');
                        });
                        break;
                }
                
                response.config.vm.$set(vm, 'viewCount', jsonArray.map(j => j.Count).reduce(function (a, b) { return a + b }));

                //frakking javascript
                //var grouped = jsonArray.reduce(function (all, current) {
                //    (all[current["CountryRegion"]] = all[current["CountryRegion"]] || []).push(current);
                //    return all;
                //});

                var grouped = [];
                jsonArray.forEach(function (json) {
                    var existingIndex = grouped.findIndex(j => j.CountryRegion === json.CountryRegion);
                    if (existingIndex > -1) {
                        grouped[existingIndex].Count += json.Count;
                    }
                    else {
                        grouped.push(json);
                    }
                });

                response.config.vm.$set(vm, 'placeData', grouped);
                vm.drawMap(response.config.vm.prop_id, response.config.vm.mode, type);
            });

        },
    }
};