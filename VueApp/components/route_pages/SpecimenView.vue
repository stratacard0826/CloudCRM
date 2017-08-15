<template>
    <div>
        <div v-if="!accession" class="col-12">
            <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i> Loading Specimen...
        </div>
        <div class="layout" v-if="accession">
            <div>
                <header>
                    <nav>
                        <a href="/catalog"><i></i>Back to the Catalog</a>
                    </nav>
                </header>
                <article>
                    <div>
                        <section>
                            <SpecimenSnapshot :accession="accession"
                                              :specimenGuid="$route.params.guid">
                            </SpecimenSnapshot>
                            <ImageUploadView width="120px"
                                             height="120px"
                                             :read_only="true"
                                             :hide_header="true"
                                             relationship_type="specimen"
                                             :relationship_guid="specimen.guid"
                                             :existing_images="specimen.customData.generalImages">
                            </ImageUploadView>
                        </section>
                        <section>
                            <SpecimenInfo :organization="organization"
                                          :specimen="specimen" />
                        </section>
                        <section>
                            <PatientInfo :organization="organization"
                                         :patientId="accession.patientId" />
                        </section>
                    </div>
                    <div>
                        <section>
                            <AcquireSpecimen :user="user"
                                             :organization="organization"
                                             :specimen_group="specimenGroup"
                                             :available_in_group="getGroupSize(specimenGroup)" />
                        </section>
                    </div>
                </article>
            </div>
        </div>
        <div class="layout" v-if="accession">
            <div>
                <aside>
                    <div>
                        <section>
                            <header>
                                <h2>RELATED SPECIMENS</h2>
                            </header>
                            <article>
                                <small>#347</small>
                                <h3>
                                    Parafin Tissue | Stained Slide
                                    <a href="#">See Details</a>
                                </h3>
                            </article>
                            <article>
                                <small>#347</small>
                                <h3>
                                    Parafin Tissue | Stained Slide
                                    <a href="#">See Details</a>
                                </h3>
                            </article>
                            <article>
                                <small>#347</small>
                                <h3>
                                    Parafin Tissue | Stained Slide
                                    <a href="#">See Details</a>
                                </h3>
                            </article>
                        </section>
                    </div>
                </aside>
            </div>
        </div>
    </div>
    <!--<div class="container-fluid">
        <div class="row">
            <div v-if="!accession" class="col-12">
                <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i> Loading Specimen...
            </div>
            <div v-if="accession" :class="hasRelatedSpecimens ? 'col-8' : 'col-12'">
                <div class="row">
                    <div class="col-auto p-0">
                        <SpecimenSnapshot :accession="accession"
                                          :specimenGuid="$route.params.guid">
                        </SpecimenSnapshot>
                    </div>
                    <div class="col-auto">
                        <AcquireSpecimen :user="user"
                                         :organization="organization"
                                         :specimen_group="specimenGroup"
                                         :available_in_group="getGroupSize(specimenGroup)" />
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 specimenview-image-viewer inner-card-no-border inner-card-p-0 pl-1 pt-1">
                        <ImageUploadView width="120px"
                                         height="120px"
                                         :read_only="true"
                                         :hide_header="true"
                                         relationship_type="specimen"
                                         :relationship_guid="specimen.guid"
                                         :existing_images="specimen.customData.generalImages">
                        </ImageUploadView>
                    </div>
                </div>
                <div class="row ml-0">
                    <div class="col-12 pl-1">
                        <SpecimenInfo :organization="organization"
                                      :specimen="specimen" />
                    </div>
                </div>
                <div class="row ml-0">
                    <div class="col-12 pl-1">
                        <PatientInfo :organization="organization"
                                      :patientId="accession.patientId" />
                    </div>
                </div>
            </div>
            <div v-if="accession && hasRelatedSpecimens" class="col-4"></div>
        </div>
    </div>-->
</template>

<script src="./SpecimenView.vue.js"></script>