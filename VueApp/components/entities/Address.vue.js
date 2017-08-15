import cloneDeep from 'lodash/cloneDeep'

module.exports = {
    name: "AddressVue",
    props: {
        value: Object,
        readOnly: Boolean
    },
    data: function () {
        return {
            addressLocal: {}
        }
    },
    created: function () {
        var vm = this;
        vm.$set(vm, 'addressLocal', cloneDeep(vm.value));
    },
    watch: {
        addressLocal: function (val, oldVal) {
            var vm = this;
            vm.$emit('changed', val);
        }
    },
};