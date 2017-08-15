import AccessionInfo from '../entities/AccessionInfo.vue';

module.exports = {
    name: 'AccessionOverview',
    props: {
        accession: Object,
        organization: Object,
        showHeader: Boolean
    },
    components: {AccessionInfo}
};