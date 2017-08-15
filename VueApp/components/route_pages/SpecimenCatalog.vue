﻿<template>
    <div>
        <div class="layout">
            <div>
                <header>
                    <h1>Specimen Catalog</h1>
                </header>
                <section>
                    <div>
                        <form>
                            <label for="searchBar">Find</label>
                            <div>
                                <button @click="runSearch">Search in Catalog</button>
                                <label>
                                    <i></i>
                                    <div>
                                        <input type="text" @keyup.enter="runSearch" v-model="searchState.query" placeholder="Type to search" />
                                    </div>
                                </label>
                            </div>
                        </form>
                    </div>
                    <div>
                        <form v-if="!searchState.searching && !searchState.loading">
                            <label for="sortBy">Sort by</label>
                            <select id="sortBy">
                                <option>Date Added</option>
                            </select>
                        </form>
                    </div>
                </section>
                <div v-if="searchState.searching || searchState.filtering" class="row mt-1">
                    <div class="col-12">
                        <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i> Searching catalog (this might take a minute)...
                    </div>
                </div>
                <div v-else-if="searchState.loading" class="row mt-1">
                    <div class="col-12">
                        <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i> Loading catalog (this might take a minute)...
                    </div>
                </div>
                <article v-else>
                    <div>
                        <div v-if="searchResults.length === 0">

                        </div>
                        <section v-else class="compact" v-for="result in searchResults">
                            <header>
                                <h3>
                                    Specimen {{(result.specimenGroup.primarySpecimen.externalId === '' || result.specimenGroup.primarySpecimen.externalId === null ? '# ' + result.specimenGroup.primarySpecimen.id : result.specimenGroup.primarySpecimen.externalId)}}
                                    |
                                    {{result.specimenGroup.primarySpecimen.type.type}}
                                    |
                                    {{result.specimenGroup.primarySpecimen.transport.name}}
                                </h3>
                            </header>
                            <ImageUploadView :read_only="true"
                                             width="100px"
                                             height="100px"
                                             :hide_header="true"
                                             relationship_type="specimen"
                                             :relationship_guid="result.specimenGroup.primarySpecimen.guid"
                                             :existing_images="result.specimenGroup.primarySpecimen.customData.generalImages">
                            </ImageUploadView>
                            <div>
                                <PatientInfo :patientId="result.accession.patientId"
                                             :organization="organization"></PatientInfo>
                            </div>
                            <div>
                                <SpecimenInfo :organization="organization"
                                              :specimen="result.specimenGroup.primarySpecimen" />
                                <footer>
                                    <router-link :to="{name: 'Specimen View', params: {guid: result.specimenGroup.primarySpecimen.guid}}" tag="a">See the Details</router-link>
                                </footer>
                            </div>
                        </section>
                    </div>
                    <div>
                        <section class="filters">
                            <header>
                                <h2>Filter Results <a v-on:click="clearFilters">Clear All Filters</a></h2>
                            </header>
                            <section v-for="flt in filtersData">
                                <h3>{{flt.label}}</h3>
                                <div v-for="attr in flt.attributes">
                                    <h4>{{attr.label}}</h4>
                                    <div v-if="attr.name != 'Cost'">
                                        <label class="checkbox" v-for="val in attr.values">
                                            <input type="checkbox" @click="filterSelected" :checked="isFilterChecked(flt.type, attr.name, val.name)" :attributeType="flt.type" :parentAttribute="attr.name" :attributeValue="val.name" style="margin-left: 0.4rem;">
                                            </input>
                                            <span></span>
                                            {{val.name + " ("}}<b>{{val.count}}</b>{{")"}}
                                        </label>
                                    </div>
                                    <div v-else>
                                        <span>$ </span>
                                        <input type="number" min="0" :placeholder="attr.min_value" ref="minCostFilter" @keyup="costFiltered" :attributeType="flt.type" :parentAttribute="attr.name" style="min-width:3rem;max-width:3.5rem;">
                                        <span> - </span>
                                        <input type="number" min="0" :placeholder="attr.max_value" ref="maxCostFilter" @keyup="costFiltered" :attributeType="flt.type" :parentAttribute="attr.name" style="min-width:3rem;max-width:3.5rem;">
                                    </div>
                                </div>
                            </section>
                        </section>
                    </div>
                </article>
            </div>
        </div>
    </div>
</template>

<script src="./SpecimenCatalog.vue.js">
</script>