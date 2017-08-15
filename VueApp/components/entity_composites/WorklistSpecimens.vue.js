import specimensState from './WorklistSpecimens.vue.data.js';

import WorklistSpecimenDetail from './WorklistSpecimenDetail.vue';

module.exports = {
    name: "WorklistSpecimens",
    props:{
        organization: Object,
        specimens: Array
    },
    components: {
        WorklistSpecimenDetail
    }
};