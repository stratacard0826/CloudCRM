<template>
    <div class="container-fluid pl-0">
        <div class="card card-accent-primary card-compact">
            <div class="card-header bg-gray-lightest font-weight-bold">
                <div v-if="$route.name === 'Specimen Inventory'">
                    <router-link class="page-link bg-gray-light font-weight-bold" :to="{ name: 'Specimen Tracking', params: { guid: specimen.guid, orgNameKey: organization.nameKey }}">
                        <i class="fa fa-edit"></i> Specimen # {{specimen.id}} - {{specimen.type.type}} {{specimen.transport === null || specimen.transport.name === null ? '' : '| ' + specimen.transport.name}}
                        [Click to View/Edit]
                    </router-link>
                </div>
                <div v-else>
                    Specimen # {{specimen.id}} - {{specimen.type.type}} {{specimen.transport == null || specimen.transport.name == null ? '' : '| ' + specimen.transport.name}}
                    <span class="text-info mr-1">{{'USD ' + getCost(specimen)}}</span>
                    <router-link v-if="specimenIndex === 0" :to="{ name: 'Specimen Tracking', params: { guid: specimen.guid, orgNameKey: organization.nameKey }}" class="float-right btn btn-sm btn-info font-sm">
                        View/Acquire Specimen(s)
                    </router-link>                    
                </div>               
            </div>

            <div class="card-block">
                <div class="row m-0" v-if="$route.name!=='Specimen Catalog'">
                    <div class="col-2 m-0 p-0">
                        <label class="label-black">Workflow Status:</label>
                    </div>
                    <div v-if="specimen.id % 2 === 0" class="col-3 m-0 p-0">
                        <div class="row">
                            <div class="col-12 text-warning">Received (0)</div>
                        </div>
                        <div class="row">
                            <div class="col-12">
                                <div class="progress">
                                    <div class="progress-bar bg-warning" style="width: 20%" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="specimen.id % 2 !== 0" class="col-3 m-0 p-0">
                        <div class="row">
                            <div class="col-12 text-success">Archived (-1)</div>
                        </div>
                        <div class="row">
                            <div class="col-12">
                                <div class="progress">
                                    <div class="progress-bar bg-success" style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-2 m-0 p-0"><div style="width:20px"></div></div>
                    <div class="col-5 m-0 p-0">
                        <div class="row">
                            <div class="col-auto">
                                <label class="label-black">Location: </label>
                            </div>
                            <div v-if="specimen.id % 2 === 0" class="col-auto">
                                Building 2 Refrigerator 5 Top Shelf
                            </div>
                            <div v-if="specimen.id % 2 !== 0" class="col-auto">
                                Logistics Irvine Station 2
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-auto">
                                <label class="label-black">Last Contact: </label>
                            </div>
                            <div v-if="specimen.id % 2 === 0" class="col-auto">
                                Mary Smith 3/14/2017 9:26
                            </div>
                            <div v-if="specimen.id % 2 !== 0" class="col-auto">
                                John Williams 3/12/2017 13:10
                            </div>
                        </div>
                    </div>
                </div>
                <SpecimenInfo :organization="organization"
                              :specimen="specimen" />
            </div>
        </div>
    </div>
</template>

<script src="./WorklistSpecimenDetail.vue.js">

</script>