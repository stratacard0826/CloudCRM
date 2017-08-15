
import customDataHelpersMixin from '../../mixins/customDataHelpers.js';

module.exports = {
    name: "SpecimenInfo",
    props:{
        organization: Object,
        specimen: Object,
    },
    components: {},
    mixins: [customDataHelpersMixin],
}