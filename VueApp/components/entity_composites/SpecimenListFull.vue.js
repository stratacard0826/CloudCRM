import SpecimenInfo from "../entities/SpecimenInfo.vue";
import SpecimenStatusSingle from "./SpecimenStatusSingle.vue";
import SpecimenLocationSnapshot from "./SpecimenLocationSnapshot.vue";
import AcquireSpecimen from "../orders/AcquireSpecimen.vue";
import SpecimenDetail from "../entities/SpecimenDetail.vue";
import barcodesMixin from "../../mixins/barcodes.js";
import specimenGroupsMixin from "../../mixins/specimenGroups.js";
import ImageUploadView from '../tools/ImageUploadView.vue';

module.exports = {
    name: "SpecimenListFull",
    props: {
        updateNeeded: Boolean,
        organization: Object,
        accession: Object
    },
    components: {
        SpecimenStatusSingle,
        SpecimenInfo,
        SpecimenLocationSnapshot,
        AcquireSpecimen,
        SpecimenDetail,
        ImageUploadView
    },
    created: function () {
        
    },
    data: function() {
        return {
            barcodes: [],
            changedInternally: false
        }
    },
    watch: {
        //barcodes: function(val){
        //    var vm = this;
        //    val.forEach(function(bc)
        //    {
        //        if(typeof bc.customData.specimenGuids === 'undefined')
        //            return;
        //        bc.customData.specimenGuids.forEach(function(sguid) {
        //            var group ='0'
        //            if(vm.specimenGroupedList.findIndex(function(spec) { return spec.specimen.guid === sguid; }) >= 0) {
        //                group = vm.specimenGroupedList.find(function(spec) { return spec.specimen.guid === sguid; }).groupGuid;
        //                vm.specimenGroupedList.filter(function(gr) { return gr.groupGuid === group ;}).forEach(function(s) {
        //                    vm.$set(s.specimen,'barcodeNumber', bc.number);
        //                });
        //            }
        //        });
        //    });            
        //},

        //selectedSpecimens: function() {
        //    if(!this.changedInternally) {
        //        this.initiateSpecimenList();
        //    }
        //    else {
        //        this.changedInternally = false;
        //    }
        //},

        updateNeeded: function() {
            if(this.updateNeeded) {      
                this.$emit('updateOthers', false);
            }
        }
    },
    methods: {
        //applyDataTables: function(){
        //    var vm = this;
        //    this.$nextTick(function () {
        //        var table = $('#SpecimenListTable').DataTable(
        //            {
        //                "info":         false,
        //                "paging":       false,
        //                "searching":    false,
        //                columnDefs: [
        //                    { targets: [0], orderable: true },
        //                    { targets: '_all', orderable: false }
        //                ],
        //                orderFixed: [0, 'asc'],
        //                rowGroup: {
        //                    dataSrc: 0
        //                }
        //            }
        //       );
        //    });
        //},        

        specimenImagesChanged: function(specimenGuid, imageGuids) {
            //TODO: refactor and trigger specimenChanged()
            var vm = this;
            var specimen = vm.accession.specimens.find(function(s) { return s.guid === specimenGuid });
            vm.$set(specimen.customData, 'generalImages', imageGuids);
        },

        getWorkflowStep: function(specimen)
        {
            // @Ian - please advise how to handle this
            if (specimen.customData === null || typeof specimen.customData === 'undefined' ||
                  specimen.customData.workflow === null || typeof specimen.customData.workflow === 'undefined') {
                  // @Bartek: pull blank custom data based on specimen type config in org, and apply the "default" workflow  :)
                return "Not yet in workflow"
            }
            else {
                return specimen.customData.workflow.currentStep;
            }
        },

        //showSpecimenInfo: function(event)
        //{
        //    var display = this.$refs[event.target.id][0].style.display;

        //    if(display === 'none') {
        //        this.$refs[event.target.id][0].style.display = 'flex';
        //    }
        //    else {
        //        this.$refs[event.target.id][0].style.display = 'none';
        //    }
        //},

        specimenChanged: function(event)
        {
            var vm = this;
            var idParams = event.target.id.split('_');
            var newSelected = [];
            vm.changedInternally = true;

            var groupedList = vm.getSpecimenGroupedList(vm.accession);

            var specimen = groupedList.find(function (s) { return s.specimen.guid === idParams[0]; });
            if(typeof specimen === 'undefined') {
                throw new Error("Selected specimen does not exist"); // shouldn't happen - just in case ;)
            }
            if(specimen.primarySpecimen) {
                let selected = !specimen.selected;
                groupedList.filter(function (s) { return s.groupGuid === specimen.groupGuid; }).forEach(function(s) {
                    s.selected = selected;
                });
            }
            else {
                groupedList.find(function(s) { return s.specimen.guid === specimen.specimen.guid; }).selected = !specimen.selected;
            }

            groupedList.filter(function(s) { return s.selected; }).forEach(function(s) {
                newSelected.push(s.specimen.guid);
            });

            vm.$emit('changed', newSelected);
        },

        //getRowVisibility: function(collapsed, isPrimary)
        //{
        //    return (collapsed && !isPrimary) ? false : true;
        //},

        //expandCollapseRow: function(event)
        //{
        //    var vm = this;
        //    var selectedGroup = '';
        //    if(event.target.localName === 'td') {
        //        selectedGroup = event.target.parentElement.firstElementChild.outerText;
        //    }
        //    else if(event.target.localName === 'span') {
        //        selectedGroup = event.target.parentElement.parentElement.firstElementChild.outerText;
        //    }
        //    else if(event.target.localName === 'i') {
        //        selectedGroup = event.target.parentElement.parentElement.parentElement.firstElementChild.outerText;
        //    }
        //    else if (event.target.localName === 'tr') {
        //        selectedGroup = event.target.firstElementChild.outerText;
        //    }

        //    var primarySpecimen = vm.specimenGroupedList.find(function(g) { return g.groupGuid === selectedGroup && g.primarySpecimen; });
        //    if(primarySpecimen === null || typeof primarySpecimen === 'undefined') {
        //        return;
        //    }

        //    if(primarySpecimen.collapsed) {
        //        vm.specimenGroupedList.filter(function (s) { return s.groupGuid === primarySpecimen.groupGuid; }).forEach(function(s) {
        //            s.collapsed = false;
        //        });
        //    }
        //    else {
        //        vm.specimenGroupedList.filter(function (s) { return s.groupGuid === primarySpecimen.groupGuid; }).forEach(function(s) {
        //            s.collapsed = true;
        //        });
        //    }
        //}
    }
};