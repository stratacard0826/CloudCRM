module.exports =
        {
            name: 'ScanLookup',
            props:
            {
                lookupMessage: String,
                lookupCssClass: String
            },
            data: function () {
                return {
                    currentAction: {
                        name: 'scan',
                        label: 'Scan Specimen'
                    },
                    actions: [
                        {
                            name: 'scan',
                            label: 'Scan Specimen'
                        },
                        {
                            name: 'lookup',
                            label: 'Enter Alternate ID'
                        }
                    ],
                    value: ''
                }
            },
            mounted: function () {
                $('.focusDefault').focus();
            },
            methods: {
                scanLookup: function (event) {
                    var vm = this;
                    vm.$emit('scanLookup', vm.currentAction.name, vm.value);
                    vm.$set(vm, 'value', '');
                },
                setAction: function (action) {
                    this.$set(this, 'currentAction', action);
                    $('.focusDefault').focus();
                }
            }
        };