import { mapGetters, mapActions } from 'vuex';

module.exports = {
    name: 'ShoppingCart',
    props: {
        user: Object,
        organization: Object
    },
    data: function () {
        return {
            copyShippingAddress: true,           
            totalAmount: 0,
            totalQuantity: 0
        };
    },
    created: function () {
        var vm = this;
        this.billingAddress = this.shippingAddress;

        var guid = vm.$route.params.guid ? vm.$route.params.guid : (vm.currentOrder.id > 0 ? vm.currentOrder.guid : "f3e146d0-3f45-11e7-876a-17f754a1f27011");
        if (typeof guid !== 'undefined') { //this might need to check for empty string instead of undefined
            vm.$parent.$store.dispatch('order/loadOrder', guid);
        } else if (typeof vm.currentOrder === 'undefined') {
            vm.$parent.$store.dispatch({ type: 'order/newOrder', params: { user: vm.user, organization: vm.organization } });
        }
        console.log('finished Pending Acquisitions create');
    },
    watch: {
        copyShippingAddress: function (val, oldVal) {
            if (val) {
                this.billingAddress = this.shippingAddress;
            } else {
                this.billingAddress = JSON.parse(JSON.stringify(this.billingAddress));
                this.shippingAddress = JSON.parse(JSON.stringify(this.shippingAddress));
            }
        }
    },
    methods:
    {
        saveOrder: function () {
            var vm = this;
            vm.$set(vm.currentOrder, 'customData', customData); //shouldn't mutate outside vuex
            vm.$parent.$store.dispatch('order/saveOrder', vm.currentOrder);
        },
    },
    computed: {
        ...mapGetters('order', ['currentOrder']),
        totalQuantity: function () {
            var totalQty = 0;
            for (var i = 0; i < this.currentOrder.specimens.length; i++) {
                var specimen = this.currentOrder.specimens[i];
                totalQty += Number(specimen.orderSpecimenCustomData.quantity);
            }
            console.log("this.order.specimens", totalQty)
            return totalQty;
        },
        totalPrice: function () {
            var totalPrice = 0;
            for (var i = 0; i < this.currentOrder.specimens.length; i++) {
                var specimen = this.currentOrder.specimens[i];
                totalPrice += Number(specimen.orderSpecimenCustomData.quantity) * specimen.orderSpecimenCustomData.cost;
            }
            console.log("this.order.totalPrice", totalPrice)
            return totalPrice;
        },
        shippingAddress: {
            get: function () {
                var vm = this;
                if (!vm.currentOrder.customData.shippingAddress) {
                    vm.$set(vm.currentOrder.customData, 'shippingAddress', {
                        addressLine1: "",
                        addressLine2: "",
                        city: "",
                        state: "",
                        postalcode: "",
                        country: ""
                    });
                }
                return vm.currentOrder.customData.shippingAddress;
            },
            set: function (value) {
                var vm = this;
                vm.$set(vm.currentOrder.customData, 'shippingAddress', value);
            }
        },
        billingAddress: {
            get: function () {
                var vm = this;
                if (!vm.currentOrder.customData.billingAddress) {
                    vm.$set(vm.currentOrder.customData, 'billingAddress', {
                        addressLine1: "",
                        addressLine2: "",
                        city: "",
                        state: "",
                        postalcode: "",
                        country: ""
                    });
                }
                return vm.currentOrder.customData.billingAddress;
            },
            set: function (value) {
                var vm = this;
                vm.$set(vm.currentOrder.customData, 'billingAddress', value);
            }
        },
        shippingMethod: {
            get: function () {
                var vm = this;
                if (!vm.currentOrder.customData.shippingMethod) {
                    vm.$set(vm.currentOrder.customData, 'shippingMethod', "");
                }
                return vm.currentOrder.customData.shippingMethod;
            },
            set: function (value) {
                var vm = this;
                vm.$set(vm.currentOrder.customData, 'shippingMethod', value);
            }
        },
        paymentInfo: {
            get: function () {
                var vm = this;
                if (!vm.currentOrder.customData.paymentInfo) {
                    vm.$set(vm.currentOrder.customData, 'paymentInfo', {
                        cardNumber: "",
                        expMonth: "",
                        expYear: "",
                        ccv: "",
                        cardName: "",
                    } );
                }
                return vm.currentOrder.customData.paymentInfo;
            },
            set: function (value) {
                vm.$set(vn.currentOrder.customData, 'paymentInfo', value);
            }
        }
    }
};