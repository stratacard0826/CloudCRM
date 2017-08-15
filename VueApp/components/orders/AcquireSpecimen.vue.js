import SpecimenInfo from "../entities/SpecimenInfo.vue";

import customDataHelpersMixin from '../../mixins/customDataHelpers.js';

const uuidV1 = require('uuid/v1');

module.exports = {
    name: "AcquireSpecimen",
    props: {
        specimen_group: Object,
        available_in_group: Number,
        user: Object,
        organization: Object
    },
    components: { SpecimenInfo },
    mixins: [customDataHelpersMixin],
    data: function() {
        return {
            group: {}
        }
    },
    created: function () {
        var vm = this;
        vm.$set(vm, 'group', {
            groupGuid: vm.specimen_group.groupGuid,
            primarySpecimen: vm.specimen_group.primarySpecimen,
            specimens: vm.specimen_group.specimens,
            maxQuantity: vm.available_in_group,
            selectedQuantity: 0
        });
    },
    watch: {
        specimen_group: function () {
            var vm = this;
            vm.$set(vm.group, 'groupGuid', vm.specimen_group.groupGuid);
            vm.$set(vm.group, 'primarySpecimen', vm.specimen_group.primarySpecimen);
            vm.$set(vm.group, 'specimens', vm.specimen_group.specimens);
        },
        available_in_group: function () {
            this.$set(this.group, 'maxQuantity', this.available_in_group);
        }
    },
    methods:
    {
        addToCart: function (group) {
            var vm = this;

            //var groupSpecimens = vm.specimens.filter(s => s.customData.groupGuid === group.groupGuid);

            var order = vm.$store.state.order.currentOrder;

            if (vm.$store.state.order.currentOrder.guid === '') {
                vm.$set(order, 'orgNameKey', vm.organization.nameKey);
                vm.$set(order, 'guid', uuidV1());
                vm.$set(order, 'customData', {});
                vm.$set(order, 'CreatedAuthId', vm.user.id);
                vm.$set(order, 'createdFullName', vm.user.fullName);
            }

            var orderSpecimens = vm.$store.state.order.currentOrder.specimens;

            for (var i = 0; i < group.selectedQuantity; i++) {
                var specimen = vm.group.specimens[i];
                if (typeof specimen === 'undefined') { //whatever
                    continue;
                }
                //this is temporary - fix cart to handle groups
                var specimenLevelOrderData = {
                    quantity: 1,
                    cost: vm.currentSpecimenAttributeValue(specimen, "Cost").length > 0 ? vm.currentSpecimenAttributeValue(specimen, "Cost")[0].value : 0
                };
                vm.$set(specimen, 'orderSpecimenCustomData', specimenLevelOrderData);

                var existingSpecimen = orderSpecimens.find(s => s.id === specimen.id);
                if (!existingSpecimen) {
                    orderSpecimens.push(specimen);
                }

            }

            vm.$store.dispatch('order/saveOrder', order);

            var warnAlertDiv = $("#smallWarningAlert");
            var warnAlertSpan = $("#smallWarningAlertText");
            warnAlertSpan.text('Added ' + group.selectedQuantity + ' specimens to your cart.');
            warnAlertDiv.show();
            window.setTimeout(function () { warnAlertDiv.hide(); }, 3500);

            vm.$set(group, 'maxQuantity', (group.maxQuantity - group.selectedQuantity) < 0 ? 0 : (group.maxQuantity - group.selectedQuantity));
            vm.$set(group, 'selectedQuantity', 0);
        }
    }
};