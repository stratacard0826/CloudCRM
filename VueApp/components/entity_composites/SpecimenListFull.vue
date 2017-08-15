<template>
    <div class="card card-no-outer-border">
        <div class="card-block text-nowrap p-0">
            <div class="row" v-for="(group, index) in getSpecimenGroupedList(accession).sort(g => g.groupGuid === primaryGroupGuid ? 0 : 1)">
                <div class="col-12">
                    <div v-if="index === 1 && primaryGroupGuid !== ''" class="row text-center mt-1 text-info">
                        <div class="col-12 text-center mt-1">
                            <h1>Related Specimens</h1>
                            <hr />
                        </div>
                    </div>
                    <div class="row dashboard-grouping-card-header">
                        <div class="col-4">
                            Specimen {{(group.primarySpecimen.externalId === '' || group.primarySpecimen.externalId === null ? '# ' + group.primarySpecimen.id : group.primarySpecimen.externalId)}}
                        </div>
                        <div class="col-8">
                            {{group.primarySpecimen.type.type}}
                            {{group.primarySpecimen.transport.name}}
                            <div v-if="$route.name !== 'Specimen Tracking'"
                                 class="tag tag-info tag-pill float-right font-sm">
                                {{getGroupSize(group) + ' available'}}
                            </div>
                        </div>
                    </div>
                    <div v-bind:id="'accordion' + group.primarySpecimen.id" role="tablist" aria-multiselectable="true" class="p-1">
                        <div class="row">
                            <div class="col-12">
                                <div class="card-accordian m-0">
                                    <div class="card-header card-header-grey collapsed" role="tab" v-bind:id="'specimenInfoHeader' + group.primarySpecimen.id" data-toggle="collapse" v-bind:data-parent="'#accordion' + group.primarySpecimen.id"
                                         v-bind:href="'#specimenInfoCollapse' + group.primarySpecimen.id" aria-expanded="true" v-bind:aria-controls="'specimenInfoCollapse' + group.primarySpecimen.id">
                                        Specimen Info ({{getGroupSize(group)}} specimens in group)
                                    </div>
                                    <div v-bind:id="'specimenInfoCollapse' + group.primarySpecimen.id"
                                         class="collapse show" role="tabpanel" v-bind:aria-labelledby="'specimenInfoHeader' + group.primarySpecimen.id">
                                        <div class="card-block p-0">
                                            <SpecimenInfo class="mb-neg-1"
                                                          :organization="organization"
                                                          :specimen="group.primarySpecimen" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12">
                                <div v-if="$route.name !== 'Specimen Tracking'"
                                     class="card-accordian m-0">
                                    <div class="card-header card-header-grey collapsed" role="tab" v-bind:id="'acquireSpecimenHeader' + group.primarySpecimen.id" data-toggle="collapse" v-bind:data-parent="'#accordion' + group.primarySpecimen.id"
                                         v-bind:href="'#acquireSpecimenCollapse' + group.primarySpecimen.id" aria-expanded="true" v-bind:aria-controls="'acquireSpecimenCollapse' + group.primarySpecimen.id">
                                        Specimen Acquisition
                                    </div>
                                    <div v-bind:id="'acquireSpecimenCollapse' + group.primarySpecimen.id"
                                         class="collapse show" role="tabpanel" v-bind:aria-labelledby="'acquireSpecimenHeader' + group.primarySpecimen.id">
                                        <div class="card-block p-0">
                                            <AcquireSpecimen class="mb-1 mt-1"
                                                             :user="user"
                                                             :organization="organization"
                                                             :specimen_group="group"
                                                             :available_in_group="getGroupSize(group)" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="card-accordian m-0">
                                    <div class="card-header card-header-grey collapsed" role="tab" v-bind:id="'imagesHeader' + group.primarySpecimen.id" data-toggle="collapse" v-bind:data-parent="'#accordion' + group.primarySpecimen.id"
                                         v-bind:href="'#imagesCollapse' + group.primarySpecimen.id" aria-expanded="true" v-bind:aria-controls="'imagesCollapse' + group.primarySpecimen.id">
                                        Images {{$route.name === 'Specimen Tracking' ? '(Drag and drop or click to add images)' : ''}}
                                    </div>
                                    <div v-bind:id="'imagesCollapse' + group.primarySpecimen.id" 
                                         class="collapse show" role="tabpanel" v-bind:aria-labelledby="'imagesHeader' + group.primarySpecimen.id">
                                        <div class="card-block p-0">
                                            <ImageUploadView 
                                                             :read_only="$route.name !== 'Specimen Tracking'"
                                                             :hide_header="true"
                                                             relationship_type="specimen"
                                                             :relationship_guid="group.primarySpecimen.guid"
                                                             :existing_images="group.primarySpecimen.customData.generalImages"
                                                             v-on:uploaded_images_changed="specimenImagesChanged">
                                            </ImageUploadView>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12">
                                <div v-if="$route.name === 'Specimen Tracking'"
                                     class="card-accordian m-0">
                                    <div class="card-header card-header-grey collapsed" role="tab" v-bind:id="'specimenLocationHeader' + group.primarySpecimen.id"
                                         data-toggle="collapse" v-bind:data-parent="'#accordion' + group.primarySpecimen.id"
                                         v-bind:href="'#specimenLocationCollapse' + group.primarySpecimen.id" v-bind:aria-controls="'specimenLocationCollapse' + group.primarySpecimen.id">
                                        Location &amp; Workflow
                                    </div>
                                    <div v-bind:id="'specimenLocationCollapse' + group.primarySpecimen.id" class="collapse" role="tabpanel" v-bind:aria-labelledby="'specimenLocationHeader' + group.primarySpecimen.id">
                                        <div class="card-block p-0">
                                            <SpecimenLocationSnapshot class="mb-neg-1"></SpecimenLocationSnapshot>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12">
                                <div v-if="$route.name === 'Specimen Tracking'"
                                     class="card-accordian m-0">
                                    <div class="card-header card-header-grey collapsed" role="tab" v-bind:id="'specimenDetailHeader' + group.primarySpecimen.id"
                                         data-toggle="collapse" v-bind:data-parent="'#accordion' + group.primarySpecimen.id"
                                         v-bind:href="'#specimenDetailCollapse' + group.primarySpecimen.id" v-bind:aria-controls="'specimenDetailCollapse' + group.primarySpecimen.id">
                                        Specimen Detail &amp; History
                                    </div>
                                    <div v-bind:id="'specimenDetailCollapse' + group.primarySpecimen.id" class="collapse" role="tabpanel" v-bind:aria-labelledby="'specimenDetailHeader' + group.primarySpecimen.id">
                                        <div class="card-block p-0">
                                            <SpecimenDetail class="mb-neg-1"></SpecimenDetail>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script src="./SpecimenListFull.vue.js">

</script>