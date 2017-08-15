import axios from 'axios';
import SpecimenSnapshot from '../entity_composites/SpecimenSnapshot.vue';
import ImageUploadView from '../tools/ImageUploadView.vue';
import SpecimenInfo from '../entities/SpecimenInfo.vue';
import PatientInfo from '../entities/PatientInfo.vue';
import AcquireSpecimen from '../orders/AcquireSpecimen.vue';

import specimenGroupsMixin from "../../mixins/specimenGroups.js";

module.exports = {
    name: "SpecimenView",
    props: {
        organization: Object,
        user: Object
    },
    components: {
        SpecimenSnapshot,
        ImageUploadView,
        SpecimenInfo,
        PatientInfo,
        AcquireSpecimen
    },
    data: function () {
        return {
            accession: null,
            hasRelatedSpecimens: false
        }
    },
    created: function () {
        var vm = this;
        vm.setAccessionBySpecimenGuid(vm.$route.params.guid);
    },
    computed: {
        specimen: {
            get: function () {
                var vm = this;
                return vm.accession.specimens.find(s => s.guid = vm.$route.params.guid);
            }
        },
        specimenGroup: {
            get: function () {
                var vm = this;
                return vm.getSpecimenGroupedList(vm.accession).find(g => g.primarySpecimen.guid === vm.specimen.guid);
            }
        }
    },
    methods: {
        setAccessionBySpecimenGuid: function (guid) {
            var vm = this;
            axios.get('/api/Accessioning/GetBySpecimen/' + guid).then(function (response) {
                if (typeof response.data.specimenGuid === 'undefined') {
                    throw 'Invalid response data for specimen: ' + response.data;
                }
                vm.setAccession(response.data.accessionGuid);
            }).catch(err => {
                console.log(err);
            });
        },
        setAccession: function (guid) {
            var vm = this;
            axios.get('/api/Accessioning/' + guid + '/' + vm.organization.nameKey).then(function (response) {
                if (typeof response.data.accession === 'undefined') {
                    throw 'Invalid response data for accession: ' + response.data;
                } //why continue? idk
                vm.$set(vm, 'accession', response.data.accession);
            }).catch(err => {
                console.log(err);
            });
        }
    }
};