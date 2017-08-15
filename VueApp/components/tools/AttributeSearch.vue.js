import CivicGeneSelectionPlugin from '../plugins/externaldata/CivicGeneSelection.vue';
import Multiselect from 'vue-multiselect';
import customDataHelpersMixin from '../../mixins/customDataHelpers.js';
require('../../assets/js/selectmany.js');

module.exports = {
    name: "AttributeSearch",
    props: {
        organization: Object,
        user: Object,
        entityType: String
    },
    components:{
        CivicGeneSelectionPlugin,
        Multiselect
    },
    data: function(){
        return {
            columnAttributes: [],   
            civicGenesCache: [],
            values: []
        };
    },
    created: function(){
        var vm = this;
        vm.getAttributeFields();
        vm.$emit('attributesLoaded', vm.columnAttributes.selectMany(a => a.attributes), vm.entityType);
    },
    methods: {

        //public event
        valuesChanged: function()
        {
            var vm = this;
            vm.$emit('valuesChanged', vm.values, vm.entityType);
        },

        getAttributeFields: function(){
            var vm = this;
            switch (vm.entityType) {
                case "patient":
                    vm.getPatientAttributeFields();
                    break;
                case "specimen":
                    vm.getSpecimenAttributeFields();
                    break;
            }
        },

        getPatientAttributeFields: function()
        {
            var vm = this;
            vm.columnAttributes.push(
                {
                        
                    "class": "col-auto",
                    section: "Patient Demographics",
                    attributes: vm.getPatientAttributesBySection('Demographics')
                                                                                       
                });
        },

        getSpecimenAttributeFields: function () {
            var vm = this;
            for (var row of vm.organization.customData.specimenAccessionSections.rows)
            {
            //flatten this
                var attributes = [];
                for (var col of row.cols)
                {
                    attributes = attributes.concat(vm.getSpecimenAttributesBySection(col.sectionName));
                }               
                vm.columnAttributes.push(
                {
                    "class": "col-auto",
                    section: "Specimen Attributes",
                    attributes: attributes                                                                                           
                });
            }
        },

        //have to consider using a plugin vuex store or similar so a plugin can access global data
        cacheCivicGenes: function(genes) {
            var vm = this;
            vm.$set(vm, 'civicGenesCache', genes);
        },

        textValueChanged: function(event){
            var vm = this;
            var idParams = event.target.id.split('_');
            var attributeName = idParams[0];
            var attributeType = idParams[1];

            var attributeLabel = vm.columnAttributes.attributes.find(a => a.name == attributeName).label;
            
            var stringValue = event.target.value;
            var arrayValue = [];
            
            arrayValue.push(stringValue);

            var currentValue = vm.values.find(v=> v.attributeName === attributeName);
            
            if(stringValue === '' && typeof currentValue !== 'undefined')
            {
                //remove empty criteria
                var index = vm.values.indexOf(currentValue);
                vm.values.splice(index, 1);
            }
            else {
                if(typeof currentValue === 'undefined')
                {
                    currentValue = {
                        entityType: vm.entityType,
                        attributeName: attributeName,
                        attributeLabel: attributeLabel,
                        criteria: []
                    };
                    vm.values.push(currentValue);
                }
                currentValue.criteria = arrayValue;
            }
            vm.valuesChanged();
        },

        multiSelectValueChanged: function (value, id) {
            var vm = this;

            var idParams = id.split('_');
            var attributeName = idParams[0];
            var attributeType = idParams[1];

            var attributeLabel = vm.columnAttributes[0].attributes.find(a => a.name == attributeName).label;

            var values = value.map(function(v) { return v.name} ); //just get the string values

            var values = values.filter(v=> v !== '');

            var currentValue = vm.values.find(v=> v.attributeName === attributeName);
            
            if(values.length === 0 && typeof currentValue !== 'undefined')
            {
                vm.values.splice(vm.values.indexOf(currentValue), 1);
            }
            else{
                if(typeof currentValue === 'undefined')
                {
                    currentValue = {
                        entityType: vm.entityType,
                        attributeName: attributeName,
                        attributeLabel: attributeLabel,
                        criteria: []
                    };
                    vm.values.push(currentValue);
                }
                currentValue.criteria = values;
            }
            vm.valuesChanged();
        },
    }
};