
import specimenState from './WorklistSpecimenDetail.vue.data.js';

import customDataHelpersMixin from '../../mixins/customDataHelpers.js';

import SpecimenInfo from "../entities/SpecimenInfo.vue";

module.exports = {
    name: "WorklistSpecimenDetail",
    props:{
        organization: Object,
        specimen: Object,
        specimenIndex: Number
    },
    components: {SpecimenInfo},
    mixins: [customDataHelpersMixin],
    data: function ()
    {
        return {
            //specimen: specimenState.specimen,
            options: specimenState.options
        };
    },
    methods:{
        getCost: function(specimen)
        {
            var vm = this;
            var cost = 214.50;
            var value = vm.currentSpecimenAttributeValue(specimen, 'Cost', true, true);
            if (value.length > 0) {
                cost = value;
            }
            return cost;
        }
    }
};