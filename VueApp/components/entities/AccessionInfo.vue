<template>
    <div class="card card-accent-primary card-compact">
        <div class="card-header card-compact">
            <router-link v-if="$route.name!=='Specimen Catalog' && $route.name!=='Specimen View'" class="page-link bg-gray-light font-weight-bold" :to="{ name: 'Edit Accession', params: { guid: accession.guid, orgNameKey: organization.nameKey }}">
                <i class="fa fa-edit"></i> Edit <span class="accessionLabel">Accession</span> # {{accession.id}} - {{accession.createdDate | localeDate}}
            </router-link>
            <div v-else class="font-weight-bold text-center">
                Samples Received on {{accession.createdDate | localeDate}}
            </div>
        </div>
        <div class="card-block card-compact">
            <div class="row m-0">
                <!--:class="col.class"-->
                <div class="col-auto">
                    <!--:class="(layout === 'horizontal' ? 'col-2' : 'col-6') + ' m-0 p-0'">-->
                    <div class="card card-compact card-no-outer-border" style="min-width:15rem">
                        <div class="card-header">General</div>
                        <div class="card-block wrap-unset">
                            <div class="row m-0 underline-light-grey">
                                <div class="col-auto mr-1">
                                    <label :for="'accClient' + accession.id + accession.clientId" class="label-black">
                                        <strong><span class="clientLabel">Institution</span></strong>:
                                    </label>
                                </div>
                                <div class="col-auto" :id="'accClient' + accession.id + accession.clientId">
                                    <div class="w-100 text-right">
                                        {{lookup('client',accession.clientId,this.clients).name}}
                                    </div>
                                </div>
                            </div>
                            <div class="row m-0 underline-light-grey">
                                <div class="col-auto mr-1">
                                    <label v-if="$route.name!=='Specimen Catalog'" :for="'accLab' + accession.id + accession.orderingLabId" class="label-black">
                                        <strong>Received At</strong>:
                                    </label>
                                    <label v-else :for="'accLab' + accession.id + accession.orderingLabId" class="label-black">
                                        <strong>Location</strong>:
                                    </label>
                                </div>
                                <div class="col-auto" :id="'accLab' + accession.id + accession.orderingLabId">
                                    <div class="w-100 text-right">
                                        {{lookup('lab',accession.orderingLabId,this.labs).name}}
                                        <small v-if="$route.name==='Specimen Catalog'">(San Diego, CA)</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class=col-auto>
                    <!--="(layout === 'horizontal' ? 'col-2' : 'col-6') + ' m-0 p-0'" style="min-width:15rem">-->
                    <div class="card card-compact card-no-outer-border">
                        <div class="card-header">Specimens/Cases</div>
                        <div class="card-block wrap-unset">
                            <div class="row m-0 underline-light-grey">
                                <div class="col-auto mr-1">
                                    <label :for="'accSpecimenCount' + accession.id" class="label-black">
                                        <strong><span class="specimensLabel">Specimens</span></strong>:
                                    </label>
                                </div>
                                <div class="col-auto text-right" :id="'accSpecimenCount' + accession.id">
                                    {{accession.specimens.length}}
                                </div>
                            </div>
                            <div class="row m-0 underline-light-grey">
                                <div class="col-auto mr-1">
                                    <label :for="'accCaseCount' + accession.id" class="label-black">
                                        <strong><span class="casesLabel">Cases</span></strong>:
                                    </label>
                                </div>
                                <div class="col-auto text-right" :id="'accCaseCount' + accession.id">
                                    N/A
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-auto">
                    <PatientInfo :patientId="accession.patientId"
                                 :organization="organization"></PatientInfo>
                </div>

                <!--<div v-if="layout === 'horizontal'" class="col-auto">
                    <PatientInfo :patientId="accession.patientId"
                                 :organization="organization"></PatientInfo>
                </div>-->
            </div>
            <!--<div v-if="layout !== 'horizontal'" class="row m-0">
                <div class="col-auto flex">
                    <PatientInfo :patientId="accession.patientId"
                                 :organization="organization"></PatientInfo>
                </div>
            </div>-->
        </div>
    </div>
</template>

<script src="./AccessionInfo.vue.js">

</script>