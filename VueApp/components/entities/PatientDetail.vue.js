import PatientInfo from '../../entities/PatientInfo.vue';

module.exports = {
    name: "PatientDetail",
    props:{
        organization: Object,
        accession: Object
    },
    components: {PatientInfo}
};