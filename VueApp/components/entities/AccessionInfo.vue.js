import PatientInfo from './PatientInfo.vue';
import { mapGetters, mapActions } from 'vuex';
import accessionInfoState from './AccessionInfo.vue.data.js';

import customDataHelpersMixin from '../../mixins/customDataHelpers.js';
import entityLookupMixin from '../../mixins/entityLookup.js';

module.exports = {
    name: "AccessionInfo",
    props:{
        organization: Object,
        accession: Object,
        layout: String
    },
    components: {PatientInfo},
    computed:{
        patient: {
            get: function(){
                var vm = this;
                return vm.lookup("patient", vm.accession.patientId, vm.patients);
            }
        },
        ...mapGetters('lookupData', ['clients', 'patients', 'doctors','labs','lookupDataLoaded'])
    },
    mixins: [customDataHelpersMixin, entityLookupMixin],
    methods:{
        
    }
}