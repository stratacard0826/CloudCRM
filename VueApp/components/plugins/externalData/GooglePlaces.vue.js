import axios from 'axios';
//import Multiselect from 'vue-multiselect';
import cloneDeep from 'lodash/cloneDeep'

var vm;

 var autocomplete;

module.exports = {
    name: "GooglePlaces",
    components: {
        //Multiselect
    },
    props: {
        prop_id: String,
        value: Object
    },
    data: function () {
        return {
            selectedPlace: {},
            isLoading: false
        };
    },
    created: function () {
        vm = this;
        if (typeof vm.value === 'undefined') { return; }
        vm.$set(vm, 'selectedPlace', cloneDeep(vm.value));
    },
    mounted: function(){
        var input = document.getElementById(vm.prop_id + '_autocomplete');

        autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.setTypes(['geocode']);
        autocomplete.addListener('place_changed', vm.placeChanged);

        var existingPlaceDiv = $('#' + vm.prop_id + '_existingPlace');
        if(typeof existingPlaceDiv !== 'undefined'){
            vm.hideEdit();
        }
            
    },
    methods: {
        editPlace: function(){
            vm.showEdit();
        },

        placeChanged: function () {            
            var newPlace = autocomplete.getPlace();
            vm.$set(vm, 'selectedPlace', cloneDeep(newPlace));
            vm.$emit('input', newPlace, vm.prop_id);
            vm.hideEdit();
        },
        hideEdit: function() {
            vm.$nextTick(function () {
                $('#' + vm.prop_id + '_existingPlace_div').show();
                $('#' + vm.prop_id + '_autocomplete_div').hide();
            });
        },
        showEdit: function() {
            vm.$nextTick(function () {
                $('#' + vm.prop_id + '_existingPlace_div').hide();
                $('#' + vm.prop_id + '_autocomplete_div').show();
            });
        },
        clearEdit: function () {
            var input = document.getElementById(vm.prop_id + '_autocomplete');
            input.value = "";
        }
    }
};