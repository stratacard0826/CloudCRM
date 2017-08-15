<template>
    <div :class="'card card-accent-info ' + (specimenGroupedList.length < 2 ? 'dashboard-card-25' : 'dashboard-card-36')">
        <div class="card-header">
            <div class="row">
                <div class="col-12">
                    <span class="specimenLabel">Specimen</span> List
                </div>
            </div>
        </div>
        <div class="card-block text-nowrap" style="max-height:35rem; overflow-y:auto">
            <table id="SpecimenListTable" class="nowrap table table-bordered table-condensed table-hover table-primary w-100 datatable-header-hidden">
                <thead>
                    <tr>
                        <th style="display:none"></th>
                        <th></th>
                        <th>ID</th>
                        <!--<th>Barcode</th>
                        <th>Type - Transport</th>
                        <th>Workflow Step</th>-->
                        <th style="min-width:14rem;">Info</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="spec in specimenGroupedList"
                        v-show="getRowVisibility(spec.collapsed, spec.primarySpecimen)"
                        @click="expandCollapseRow"
                        class="cursor-pointer"
                        :key="spec.specimen.guid + '_SpecimenRow'">
                        <!--:class="{ 'expanded-row-color': !spec.primarySpecimen}">-->
                        <td style="display:none">{{spec.groupGuid}}</td>
                        <td>
                            <span v-if="spec.primarySpecimen && getGroupSize(spec.groupGuid) > 1 && spec.collapsed"><i class="fa fa-chevron-right" aria-hidden="true"></i></span>
                            <span v-else-if="spec.primarySpecimen && getGroupSize(spec.groupGuid) > 1 && !spec.collapsed"><i class="fa fa-chevron-down" aria-hidden="true"></i></span>
                            &nbsp;
                            <input type="checkbox"
                                   :id="spec.specimen.guid + '_CheckSelect'"
                                   :checked="spec.selected"
                                   @click="specimenChanged" />
                        </td>
                        <td :class="{ 'pl-2': !spec.primarySpecimen }">
                            <div class="row m-0 p-0">
                                <div class="col-12 p-0">
                                    Specimen {{(spec.specimen.externalId === '' || spec.specimen.externalId === null ? '# ' + spec.specimen.id : spec.specimen.externalId)}}
                                </div>
                            </div>
                            <div class="row m-0 p-0">
                                <div class="col-12 p-0">
                                    {{spec.specimen.type.type}}
                                </div>
                            </div>
                            <div class="row m-0 p-0">
                                <div class="col-12 p-0">
                                    {{spec.specimen.transport.name}}
                                </div>
                            </div>
                            <div class="row m-0 p-0">
                                <div class="col-12 p-0">
                                    <div class="tag tag-info tag-pill" v-if="(spec.collapsed && spec.primarySpecimen) || getGroupSize(spec.groupGuid) === 1">
                                        {{getGroupSize(spec.groupGuid) + ' available'}}
                                    </div>
                                </div>
                            </div>                            
                        </td>
                        <!--<td>{{spec.specimen.barcodeNumber}}</td>
                        <td>{{spec.specimen.code}}</td>
                        <td>{{getWorkflowStep(spec.specimen)}}</td>-->
                        <!--<td class="text-center">-->
                        <!--<div class="cursor-pointer fa fa-info-circle fa-lg"
                             :id="spec.specimen.guid + '_SpecimenInfo'"
                             @mouseover="showSpecimenInfo"
                             @mouseout="showSpecimenInfo"
                             aria-hidden="true">
                        </div>-->
                        <!--<div class="col-10 pop-up-info"
                             style="display:none"
                             :ref="spec.specimen.guid + '_SpecimenInfo'">
                            <SpecimenInfo :organization="organization"
                                          :specimen="spec.specimen" />
                        </div>-->
                        <td>
                            <SpecimenInfo class="col-12" :organization="organization"
                                          :specimen="spec.specimen" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style>
    /*still needs work*/
    table.dataTable thead .sorting:after {
        content: "\f0dc" !important;
    }

    table.dataTable thead .sorting_asc:after {
        content: "\f0dd" !important;
    }

    table.dataTable thead .sorting_desc:after {
        content: "\f0de" !important;
    }
</style>

<script src="./SpecimenList.vue.js">

</script>