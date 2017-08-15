import Multiselect from 'vue-multiselect';
import cloneDeep from 'lodash/cloneDeep'
var countryData = require('country-data');
var countryjs = require('../../../assets/js/locationData/countryjs');

module.exports = {
    name: "LocationSelection",
    props: {
        prop_id: String,
        value: Object
    },
    components: {
        Multiselect
    },
    data: function () {
        return {
            currentLocation: {
                country: null,
                stateProvince: '',
                region: '',
                subregion: ''
            },
            countries: countryData.countries
        };
    },
    created: function() {
        var vm = this;
        if (typeof vm.value === 'undefined') { return; }
        vm.$set(vm, 'currentLocation', cloneDeep(vm.value));
    },
    methods: {
        countryChanged: function (newValue, id) {
            var vm = this;
            vm.$set(vm, 'currentLocation', {
                country: newValue,
                stateProvince: '',
                region: '', //set
                subregion: '' //set
            });
            vm.$emit('input', vm.currentLocation, id); //return as event per unidirectional data flow
        },
        stateProvinceChanged: function (newValue, id) {
            var vm = this;
            vm.$set(vm.currentLocation, 'stateProvince', newValue);
            vm.$emit('input', vm.currentLocation, id); //return as event per unidirectional data flow
        },
    },
    computed: {
        statesProvinces: {
            get: function () {
                var vm = this;
                var retVal = [];
                if (typeof vm.currentLocation.country !== 'undefined') {
                    var states = countryjs.states(vm.currentLocation.country.alpha2);
                    if (typeof states !== 'undefined') {
                        retVal = states;
                    }
                }
                return retVal;
            }
        }
    }
};