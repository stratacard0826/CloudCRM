import caseState from './WorklistCaseDetail.vue.data.js';

import customDataHelpersMixin from '../../mixins/customDataHelpers.js';

module.exports = {
    name: "WorklistCaseDetail",
    props:{
        organization: Object,
        _case: Object
    },
    components: {},
    mixins: [customDataHelpersMixin],
    data: function ()
    {
        return {
            //case: caseState.case,
            options: caseState.options
        };
    },
    methods:{}
};