import AddressVue from '../entities/Address.vue';
import OrderInfo from '../entities/OrderInfo.vue';
module.exports = {
    name: "OrderDetail",
    props: {
        order: Object
    },
    components: {
        AddressVue,
        OrderInfo
    },
    computed: {
        addresses: function () {
            var vm = this;
            var _addresses = [];
            if (!vm.order.customData) {
                return _addresses
            }
            if (vm.order.customData.shippingAddress) {
                _addresses.push({ type: "Shipping Address", address: vm.order.customData.shippingAddress });
            }
            if (vm.order.customData.billingAddress) {
                _addresses.push({ type: "Billing Address", address: vm.order.customData.billingAddress });
            }
            return _addresses;
        }
    }
};