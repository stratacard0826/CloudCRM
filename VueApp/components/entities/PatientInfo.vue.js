import { mapGetters, mapActions } from 'vuex';
import customDataHelpersMixin from '../../mixins/customDataHelpers.js';
import entityLookupMixin from '../../mixins/entityLookup.js';

module.exports = {
    name: "PatientInfo",
    props:{
        organization: Object,
        patientId: Number,
        compact: Boolean
    },
    methods: {
        getArrtibuteValueFromArray: function (array, addLinebreak) {
            if (!addLinebreak) {
                return array.map(v => v.name);
            }
            else {
                return array.map(v => v.name).join("\n");
            }
        }
    },
    computed:{
        patient: {
            get: function(){
                var vm = this;
                return vm.lookup("patient", vm.patientId, vm.patients);
            }
        },
        ...mapGetters('lookupData', ['clients', 'patients', 'doctors','labs','lookupDataLoaded'])
},
mixins: [customDataHelpersMixin, entityLookupMixin]
};