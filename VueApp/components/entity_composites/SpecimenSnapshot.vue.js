import { mapGetters } from 'vuex';
import entityLookupMixin from '../../mixins/entityLookup.js';
module.exports = {
    name: "SpecimenSnapshot",
    props: {
        accession: Object,
        specimenGuid: String
    },
    data: function() {
        return {

        }
    },
    computed: {
        patient: function () {
            var vm = this;
            return vm.lookup('patient', vm.accession.patientId, vm.patients);
        },
        client: function () {
            var vm = this;
            return vm.lookup('client', vm.accession.clientId, vm.clients);
        },
        specimen: function () {
            var vm = this;
            return vm.accession.specimens.find(s => s.guid == vm.specimenGuid)
        },
        lab: function () {
            var vm = this;
            return vm.lookup('lab', vm.accession.orderingLabId, vm.labs);
        },
        specimenId: function () {
            var vm = this;
            var id = "# " + vm.specimen.id;
            if (vm.specimen.externalId && vm.specimen.externalId.length > 0) {
                id = vm.specimen.externalId;
            }
            return id;
        },
        ...mapGetters('lookupData', ['clients', 'patients', 'doctors', 'labs', 'lookupDataLoaded'])
    }
};