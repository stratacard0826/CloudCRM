import SpecimenInfo from "../../entities/SpecimenInfo.vue";
import barcodesMixin from "../../../mixins/barcodes.js";

module.exports = {
    name: "SpecimenList",
    props: {
        accessionGuid: String,
        specimens: Array,
        selectedSpecimens: Array,
        updateNeeded: Boolean,
        organization: Object
    },
    data: function() {
        return {
            specimenGroupedList: [],
            barcodes: [],
            changedInternally: false
        }
    },
    watch: {
        barcodes: function(val){
            var vm = this;
            val.forEach(function(bc)
            {
                if(typeof bc.customData.specimenGuids === 'undefined')
                    return;
                bc.customData.specimenGuids.forEach(function(sguid) {
                    var group ='0'
                    if(vm.specimenGroupedList.findIndex(function(spec) { return spec.specimen.guid === sguid; }) >= 0) {
                        group = vm.specimenGroupedList.find(function(spec) { return spec.specimen.guid === sguid; }).groupGuid;
                        vm.specimenGroupedList.filter(function(gr) { return gr.groupGuid === group ;}).forEach(function(s) {
                            vm.$set(s.specimen,'barcodeNumber', bc.number);
                        });
                    }
                });
            });            
        },

        selectedSpecimens: function() {
            if(!this.changedInternally) {
                this.initiateSpecimenList();
            }
            else {
                this.changedInternally = false;
            }
        },

        updateNeeded: function() {
            if(this.updateNeeded) {
                this.initiateSpecimenList();
                this.$emit('updateOthers', false);
            }
        }
    },
    components: {SpecimenInfo},
    created: function()
    {
        this.initiateSpecimenList();
        this.applyDataTables();
    },
    methods: {
        applyDataTables: function(){
            var vm = this;
            this.$nextTick(function () {
                var table = $('#SpecimenListTable').DataTable(
                    {
                        "info":         false,
                        "paging":       false,
                        "searching":    false,
                        columnDefs: [
                            { targets: [0], orderable: true },
                            { targets: '_all', orderable: false }
                        ],
                        orderFixed: [0, 'asc'],
                        rowGroup: {
                            dataSrc: 0
                        }
                    }
               );
            });
        },

        initiateSpecimenList: function() {
            var vm = this;
            var sortedSpecimens = vm.specimens.sort(function(a, b) { return a.id - b.id; });
            vm.specimenGroupedList = [];

            sortedSpecimens.forEach(function (s) {
                let isPrimary = false;
                let isSelected = false;
                if(vm.specimenGroupedList.findIndex(function(gr) { return gr.groupGuid === s.customData.groupGuid; }) === -1) {
                    isPrimary = true;
                }
                if(vm.selectedSpecimens.findIndex(function(guid) { return guid === s.guid; }) !== -1) {
                    isSelected = true;
                }
                vm.specimenGroupedList.push({groupGuid: s.customData.groupGuid, specimen: s, primarySpecimen: isPrimary, selected: isSelected, collapsed: true});
            });
            vm.getBarcodes(vm.organization.nameKey, vm.accessionGuid, vm);
        },

        getGroupSize: function(groupGuid)
        {
            return this.specimenGroupedList.filter(function(g) { return g.groupGuid === groupGuid; }).length;
        },

        getWorkflowStep: function(specimen)
        {
            // @Ian - please advise how to handle this
            if (specimen.customData === null || typeof specimen.customData === 'undefined' ||
                  specimen.customData.workflow === null || typeof specimen.customData.workflow === 'undefined') {
                return "Not yet in workflow"
            }
            else {
                return specimen.customData.workflow.currentStep;
            }
        },

        showSpecimenInfo: function(event)
        {
            var display = this.$refs[event.target.id][0].style.display;

            if(display === 'none') {
                this.$refs[event.target.id][0].style.display = 'flex';
            }
            else {
                this.$refs[event.target.id][0].style.display = 'none';
            }
        },

        specimenChanged: function(event)
        {
            var vm = this;
            var idParams = event.target.id.split('_');
            var newSelected = [];
            vm.changedInternally = true;

            var specimen = vm.specimenGroupedList.find(function (s) { return s.specimen.guid === idParams[0]; });
            if(typeof specimen === 'undefined') {
                throw new Error("Selected specimen does not exist"); // shouldn't happen - just in case ;)
            }
            if(specimen.primarySpecimen) {
                let selected = !specimen.selected;
                vm.specimenGroupedList.filter(function (s) { return s.groupGuid === specimen.groupGuid; }).forEach(function(s) {
                    s.selected = selected;
                });
            }
            else {
                vm.specimenGroupedList.find(function(s) { return s.specimen.guid === specimen.specimen.guid; }).selected = !specimen.selected;
            }

            vm.specimenGroupedList.filter(function(s) { return s.selected; }).forEach(function(s) {
                newSelected.push(s.specimen.guid);
            });

            vm.$emit('changed', newSelected);
        },

        getRowVisibility: function(collapsed, isPrimary)
        {
            return (collapsed && !isPrimary) ? false : true;
        },

        expandCollapseRow: function(event)
        {
            var vm = this;
            var selectedGroup = '';
            if(event.target.localName === 'td') {
                selectedGroup = event.target.parentElement.firstElementChild.outerText;
            }
            else if(event.target.localName === 'span') {
                selectedGroup = event.target.parentElement.parentElement.firstElementChild.outerText;
            }
            else if(event.target.localName === 'i') {
                selectedGroup = event.target.parentElement.parentElement.parentElement.firstElementChild.outerText;
            }
            else if (event.target.localName === 'tr') {
                selectedGroup = event.target.firstElementChild.outerText;
            }

            var primarySpecimen = vm.specimenGroupedList.find(function(g) { return g.groupGuid === selectedGroup && g.primarySpecimen; });
            if(primarySpecimen === null || typeof primarySpecimen === 'undefined') {
                return;
            }

            if(primarySpecimen.collapsed) {
                vm.specimenGroupedList.filter(function (s) { return s.groupGuid === primarySpecimen.groupGuid; }).forEach(function(s) {
                    s.collapsed = false;
                });
            }
            else {
                vm.specimenGroupedList.filter(function (s) { return s.groupGuid === primarySpecimen.groupGuid; }).forEach(function(s) {
                    s.collapsed = true;
                });
            }
        }
    }
};