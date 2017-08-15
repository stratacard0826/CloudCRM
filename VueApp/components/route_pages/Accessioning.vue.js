//vue
import { mapGetters, mapActions } from 'vuex';
import filter from '../../assets/js/setFilter.js';

//local data
import accessionData from './Accessioning.vue.data.js';

//mixins
import accessionLoadSaveMixin from '../../mixins/accessionLoadSave.js';
import historyItemsMixin from '../../mixins/historyItems.js';

//components
import Patient from '../accessioning/Patient.vue';
import Specimens from '../accessioning/Specimens.vue';
import Multiselect from 'vue-multiselect';
import QuillEditor from '../tools/QuillEditor.vue';

//general
import cloneDeep from 'lodash/cloneDeep'
const uuidV1 = require('uuid/v1');

import bus from '../../assets/js/bus';

module.exports = {
    name: "Accessioning",
    components: {
        Multiselect,
        QuillEditor,
        Patient,
        Specimens
    },
    mixins: [
        accessionLoadSaveMixin,
        historyItemsMixin
    ],
    props: {
        user: Object,
        organization: Object,

    },

    data: function () {
        return {
            accessionState: accessionData.accessionState,
            saveState: accessionData.saveState,
        };
    },

    watch: {
        '$route': function () {
            var vm = this;
            vm.initView();
        },
        'saveState.messages': function () {
            var vm = this;
            var retVal = '';
            vm.saveState.messages.forEach(function (m) {
                switch (m.type) {
                    case "Bullet":
                        retVal += '\n - ' + m.text; //todo figure out html <ul> formatting
                        break;
                    default:
                        retVal += '\n' + m.text;
                        break;
                }
            });
            vm.$set(vm.saveState, 'saveMessage', retVal);
        }
    },

    created: function () {
        var vm = this;
        this.$on('veeValidate', () => {
            bus.$emit('validate');
        })
        bus.$on('errors-changed', (newErrors, oldErrors) => {
            newErrors.forEach(error => {
                if (!this.errors.has(error.field)) {
                    this.errors.add(error.field, error.msg)
                }
            });
            if (oldErrors) {
                oldErrors.forEach(error => {
                    this.errors.remove(error.field)
                })
            }
        })
        const dictionary = {
            en: {
                custom: {
                    firstNameField: {
                        required: "First name is required."
                    },
                    lastNameField: {
                        required: "Last name is required."
                    },
                    mrnField: {
                        required: "MRN is required."
                    }
                }
            }
        };
        this.$validator.updateDictionary(dictionary);
        this.initView();
    },

    mounted: function () {

    },

    methods: {

        initView: function () {
            var accGuid = null;
            var vm = this;

            vm.$nextTick(function () { $("#loadingModal").modal("show"); });

            vm.$set(vm.accessionState, 'loaded', false);
            vm.$set(vm.accessionState, 'savedStatus', null);

            if (vm.$route.name === 'New Accession')
                vm.newAccession(false);
            else {
                vm.$set(vm.accessionState, 'isNew', false);
                accGuid = vm.$route.params.guid;
                vm.$set(vm.accessionState, 'currentAction', 'Loading');
            }

            if (vm.accessionState.isNew || vm.accessionState.accession.guid != accGuid) {
                vm.loadAccession(vm.$route.params.guid, vm.$route.params.orgNameKey, vm.accessionState);
            }
            else {
                vm.$set(vm.accessionState, 'loaded', true);
                vm.$nextTick(function () { vm.finalizeView(); });
            }

            vm.hideError(1000);
        },

        finalizeView: function () { //see watcher on loaded property

            $("#loadingModal").modal("hide");

            //bug here - hack
            $(".modal-backdrop").hide();

            $('.dateOnlyPicker').daterangepicker({
                "singleDatePicker": true,
                "timePicker": false,
                locale: {
                    format: 'M/D/YYYY'
                }
            });

            $('.dateTimePicker').daterangepicker({
                "singleDatePicker": true,
                "timePicker": true,
            });

        },

        setAccessionHistory: function (updated) {
            var vm = this;
            var route = { name: 'Edit Accession', meta: vm.$route.meta, params: { guid: vm.accessionState.accession.guid, orgNameKey: vm.organization.nameKey } };
            if (vm.patient.lastName)
                var subject = vm.patient.lastName + ', ' + vm.patient.firstName;
            else
                var subject = "";

            var specTypes = vm.accessionState.accession.specimens.map(function (s) { return s.type.type });
            var countedSpecTypes = [];
            specTypes.forEach(function (s) {
                typeof countedSpecTypes.find(function (c) {
                    return c.string === s
                }) === 'undefined' ? countedSpecTypes.push({ string: s, count: 1 }) : countedSpecTypes.find(function (c) {
                    return c.string === s
                }).count++;
            });
            var content = countedSpecTypes.map(function (c) { return c.count + ' ' + vm.$options.filters.pluralize(c.count, c.string) }).join(', ');

            var hold = vm.accessionState.accession.customData.hold === 'undefined' ? false : vm.accessionState.accession.customData.hold;

            var headline = 'Accession # ' + vm.accessionState.accession.id + (hold ? ' (HOLD)' : '');

            var showWarning = false;
            if (hold) {
                var warning = 'Accession # ' + vm.accessionState.accession.id + ' (HOLD) can be found in your Recent Accessions list.';
                showWarning = true;
            }

            vm.setHistoryItems(vm.accessionState.accession, route, subject, content, headline, showWarning, warning, updated);

        },

        cleanup: function (err) {
            //todo: error handling here...
            var vm = this;
            vm.$set(vm.accessionState, 'loaded', true);
            vm.$set(vm.accessionState, 'isNew', false);
            vm.$set(vm.accessionState, 'savingNow', false);
            vm.$nextTick(function () {
                vm.finalizeView();
                vm.showError(err.message, false);
            });
        },

        showError: function (text, autoDismiss) {
            var dangerAlertDiv = $("#smalldangerAlert");
            var dangerAlertSpan = $("#smalldangerAlertText");
            dangerAlertSpan.text(text);
            dangerAlertDiv.show();
            if (autoDismiss) {
                this.hideError(3500);
            }
        },

        hideError: function (delay) {
            //window.setTimeout(function () { $("#smalldangerAlert").hide(); }, delay);
        },

        checkValidate: function () {
            var vm = this;
            bus.$emit('validate');
            vm.setErrorMessages();
        },

        setErrorMessages: function (specimensValidate) {
            var vm = this;
            var saveState = {
                errorState: true,
                messages: []
            }

            saveState.messages.push({ type: "Main", text: "Failed to save Accession" });
            if (!vm.client) {
                saveState.messages.push({ type: "Bullet", text: "Client is required" });
            }
            if (!vm.facility) {
                saveState.messages.push({ type: "Bullet", text: "Facility is required" });
            }
            if (!vm.lab) {
                saveState.messages.push({ type: "Bullet", text: "Lab (Received At) is required" });
            }
            if (!vm.patient) {
                saveState.messages.push({ type: "Bullet", text: "Patient is required" });
            }
            if (!specimensValidate) {
                saveState.messages.push({ type: "Bullet", text: "Specimen validation problems, please review the Specimens section" });
            }

            vm.$validator.errorBag.errors.forEach(e =>
                saveState.messages.push({ type: "Bullet", text: e.msg })
            );

            vm.$set(vm, 'saveState', saveState);
        },

        validateSave: function () {
            var vm = this;
            var retVal = true;

            var specimensValidate = true;

            vm.accessionState.accession.specimens.forEach(function (s) {
                //console.log(JSON.stringify(s))
                if (!s.type.code || !s.transport.code || vm.currentGroupQuantity <= 0) {
                    specimensValidate = false;
                }
            });

            if ((vm.$validator.errorBag && vm.$validator.errorBag.any()) || !vm.client || !vm.facility || !vm.lab || !vm.patient || !specimensValidate) {
                vm.$set(vm.accessionState, 'savedStatus', 'failed');

                vm.setErrorMessages(specimensValidate);

                retVal = false;

            }

            return retVal;
        },

        //todo printing

        printAccession: function () { },

        printLabels: function () { },

        //component event handlers

        patient_changed: function (patientId, doReload) {
            var vm = this;
            vm.$set(vm.accessionState.accession, 'patientId', patientId);
            if (doReload) {
                vm.$parent.$store.dispatch({ type: 'lookupData/loadPatients', orgNameKey: vm.organization.nameKey });
            }
        },

        addComment: function (type) {
            var vm = this;
            var comment = {
                type: type,
                guid: uuidV1(),
                user: vm.user.fullName,
                dateTime: new Date().toJSON(),
                html: ''
            };
            vm.accessionState.accession.customData.comments.push(comment);
            vm.$set(vm.accessionState, 'editingComment', comment);
        },

        editComment: function (comment) {
            var vm = this;
            vm.$set(vm.accessionState, 'editingComment', comment);
        },

        onEditorBlur: function (editor) {
            //console.log('editor blur!', editor);
        },

        onEditorFocus: function (editor) {
            //console.log('editor focus!', editor);
        },

        onEditorReady: function (editor) {
            //console.log('editor ready!', editor);
        },

        onEditorChange: function ({ editor, html, text }) {
            //console.log('editor change!', editor, html, text);
            //this.content = html;
        }
    },
    computed: {
        client: {
            get: function () {
                var cId = this.accessionState.accession.clientId;
                return this.clients.find(function (c) { return c.id == cId; });
            },
            set: function (value) {
                this.$set(this.accessionState.accession, 'clientId', value.id);
                //facility depends on client, choose the first one
                this.$set(this.accessionState.accession, 'facilityId', value.facilities[0].id);
            }
        },
        facility: {
            get: function () {
                var fId = this.accessionState.accession.facilityId;
                return this.facilities.find(function (f) { return f.id == fId; });
            },
            set: function (value) {
                this.$set(this.accessionState.accession, 'facilityId', value.id);
            }
        },
        lab: {
            get: function () {
                var lId = this.accessionState.accession.orderingLabId;
                return this.labs.find(function (l) { return l.id == lId; });
            },
            set: function (value) {
                this.$set(this.accessionState.accession, 'orderingLabId', value.id);
            }
        },
        patient: {
            get: function () {
                var pId = this.accessionState.accession.patientId;
                return this.patients.find(function (p) { return p.id == pId; });
            }
        },

        facilities: function () {
            var facilities = [{ id: 0, name: "" }];
            var cId = this.accessionState.accession.clientId;
            var cli = this.clients.find(function (c) { return c.id == cId; });
            if (typeof (cli) != 'undefined')
                facilities = cli.facilities;
            return facilities;
        },

        ...mapGetters('lookupData', ['clients', 'patients', 'doctors', 'labs', 'lookupDataLoaded'])
    }
};