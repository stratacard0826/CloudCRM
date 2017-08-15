
import AcquireSpecimen from './AcquireSpecimen.vue';

module.exports = {
    name: 'AcquireSpecimens',
    props: {
        selectedSpecimens: Array,
        specimens: Array,
        organization: Object,
        user: Object
    },
    data: function ()
    {
        return {
            addedCartQuantity: 0,
            groups: []
        };
    },
    components: {AcquireSpecimen},
    created: function(){
        var vm = this;

        vm.selectedSpecimens.forEach(function(guid) {
            let spec = vm.specimens.find(function(s) { return s.guid === guid; });
            if(typeof spec !== 'undefined' && typeof spec.customData !== 'undefined' && typeof spec.customData.groupGuid !== 'undefined') {
                let groupGuid = spec.customData.groupGuid;
                var group = vm.groups.find(function(gr) { return gr.groupGuid === groupGuid; });
                if(typeof group === 'undefined') {
                    group = {groupGuid: spec.customData.groupGuid, primarySpecimen: true, selectedQuantity: 0, maxQuantity: 1};
                    vm.groups.push(group);
                }   
                else{
                    group.maxQuantity++;
                }
            }
        });

    },

};