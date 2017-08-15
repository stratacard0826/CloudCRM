<template>
    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-header card-header-primary">
                    <span class="specimensLabel">Specimens</span>
                    <div class="dropdown float-right">
                        <button class="btn btn-info btn-sm dropdown-toggle"
                                id="addSpecBtn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i class="fa fa-plus-circle"></i> Add Specimen
                        </button>
                        <div class="dropdown-menu" aria-labelledby="addSpecBtn">
                            <div class="dropdown-item" v-for="spec of organizationSpecimenTypes" v-on:click="addSpecimen(spec, '')">{{spec.type}}</div>
                        </div>
                    </div>
                </div>
                <div v-if="specimensState.specimens.length > 0" class="card-block">
                    <div class="no-more-tables">
                        <table id="specimenList" role="grid" class="table table-striped table-condensed table-gray">
                            <thead>
                                <tr>
                                    <th>Edit</th>
                                    <th>#</th>
                                    <th>ID</th>
                                    <th>Barcode</th>
                                    <th>Type</th>
                                    <th style="min-width:10rem">Transport</th>
                                    <th>Collection Date</th>
                                    <th>Quantity</th>
                                    <!--<th>Received Date</th>-->
                                </tr>
                            </thead>
                            <tbody v-for="specimen of specimensState.specimens" v-if="showSpecimen(specimen)">
                                <!--hopefully multiple tbodies won't be an issue - allowed in the html spec-->
                                <tr>
                                    <td>
                                        <button class="btn btn-info btn-sm"
                                                v-on:click="specimenClicked(specimen)">
                                            {{specimen === currentSpecimen ? 'Done' : 'Click to View/Edit'}}
                                        </button>
                                    </td>
                                    <td data-title="Specimen #">{{specimen.id}}</td>

                                    <td data-title="ID" v-if="specimen === currentSpecimen">
                                        <input type="text" v-model="specimen.externalId" />
                                    </td>
                                    <td data-title="ID" v-else>{{specimen.externalId}}</td>

                                    <td data-title="Barcode" v-if="specimen === currentSpecimen">
                                        <input type="text" placeholder="[Auto-generated if empty]" v-model="specimen.barcodeNumber" />
                                    </td>
                                    <td data-title="Barcode" v-else>{{specimen.barcodeNumber}}</td>

                                    <td data-title="Type" v-if="specimen === currentSpecimen">
                                        <multiselect placeholder="Select Type"
                                                     track-by="code"
                                                     label="type"
                                                     :options="organizationSpecimenTypes"
                                                     :searchable="false"
                                                     :multiple="false"
                                                     :allow-empty="false"
                                                     :selectLabel="''"
                                                     :selectedLabel="''"
                                                     :deselectLabel="''"
                                                     v-on:input="currentSpecimenTypeTransportChanged()"
                                                     v-model="specimen.type">
                                        </multiselect>
										
										<span v-show="!specimen.type || !specimen.type.code">Type is required</span>
                                    </td>
                                    <td data-title="Type" v-else>{{specimen.type.type}}</td>

                                    <td data-title="Transport" v-if="specimen === currentSpecimen">
                                        <multiselect placeholder="Select Transport"
                                                     track-by="code"
                                                     label="name"
                                                     :options="getSpecimenTransports(specimen.type.code)"
                                                     :searchable="false"
                                                     :multiple="false"
                                                     :allow-empty="false"
                                                     :selectLabel="''"
                                                     :selectedLabel="''"
                                                     :deselectLabel="''"
                                                     v-on:input="currentSpecimenTypeTransportChanged()"
                                                     v-model="specimen.transport">
                                        </multiselect>
										<span v-show="!specimen.transport || !specimen.transport.code">Transport is required</span>
                                    </td>
                                    <td data-title="Transport" v-else>{{specimen.transport.name}}</td>

                                    <td data-title="Collected" v-if="specimen === currentSpecimen">
                                        <!--NOTE v-model is computed property here, in case anything weird...-->
                                        <input type="text" v-model.lazy="currentSpecimenCollectionDate" class="dateTimePicker" />
                                    </td>
                                    <td data-title="Collected" v-else>{{specimen.collectionDate | localeDate}}</td>

                                    <td data-title="Qty" v-if="specimen === currentSpecimen">
                                        <input type="number" min="1" v-model="currentGroupQuantity" />
										<span v-show="!currentGroupQuantity || currentGroupQuantity<=0">Quantity is required</span>
                                    </td>
                                    <td data-title="Qty" v-else-if="groupQuantity(specimen) > 1"><button class="btn btn-info btn-sm">{{groupQuantity(specimen)}} like this - show all</button></td>
                                    <td data-title="Qty" v-else>1</td>
                                </tr>
                                <tr class="ignore-no-more-tables" v-show="specimen === currentSpecimen">
                                    <td colspan="9" class="bg-faded">
                                        <div class="ml-1 mb-1 text-center">
                                            <span class="specimenLabel">Specimen</span>:
                                            {{specimen.id === -1 ? '(NEW)' : '# ' + specimen.id}}
                                            | {{(specimen.externalId === "" || specimen.externalId === null) ? '(No ID Set)' : specimen.externalId}}
                                            | Code: {{specimen.code}}
                                        </div>
                                        <div :id="'collapse'+specimen.guid" class="row collapse m-0 p-0" role="tabpanel" :aria-labelledby="'heading'+specimen.guid" :aria-expanded="false">
                                            <div v-show="specimen.attributesAreSet" class="col-12">
                                                <div v-for="row in organization.customData.specimenAccessionSections.rows" class="row">
                                                    <div v-for="col in row.cols" :class="col.class">
                                                        <div class="card">
                                                            <div class="card-header card-header-primary">
                                                                {{col.sectionName}}
                                                            </div>
                                                            <div class="card-block">
                                                                <div v-for="att in getSpecimenAttributesBySectionAndType(col.sectionName, specimen.type.code)" class="form-group">
                                                                    <!--could use a computed getter/setter property, and v-model, but, complicated by array and 'section'-->
                                                                    <label :for="specimen.guid+'_'+att.name+'_'+att.type" class="label-above">{{att.label}}</label>
                                                                    <div class="input-group">

                                                                        <input v-if="att.type==='smallText'" type="text" v-bind:id="specimen.guid+'_'+att.name+'_'+att.type" v-bind:value="currentSpecimenAttributeValue(specimen, att.name, true, true)" v-on:change="updateSpecimenAttributeFromText" />

                                                                        <input v-if="att.type==='integer'" type="number" v-bind:id="specimen.guid+'_'+att.name+'_'+att.type" v-bind:value="currentSpecimenAttributeValue(specimen, att.name, true, true)" v-on:change="updateSpecimenAttributeFromText" />

                                                                        <multiselect v-if="att.type.startsWith('single')"
                                                                                     :id="specimen.guid+'_'+att.name+'_'+att.type"
                                                                                     deselect-label="Can't remove this value"
                                                                                     track-by="id" label="name"
                                                                                     placeholder="Select one" 
                                                                                     :options="att.options" :searchable="false" :allow-empty="true"
                                                                                     :close-on-select="true"
                                                                                     v-bind:value="currentSpecimenAttributeValue(specimen, att.name, true)"
                                                                                     v-on:input="updateSpecimenAttributeFromMultiSelect">
                                                                        </multiselect><!--"-->

                                                                        <multiselect v-if="att.type.startsWith('multiple')"
                                                                                     :id="specimen.guid+'_'+att.name+'_'+att.type"
                                                                                     track-by="id" label="name"
                                                                                     placeholder="Select one or more" :options="att.options" :searchable="true"
                                                                                     :multiple="true" :allow-empty="true"
                                                                                     :value="currentSpecimenAttributeValue(specimen, att.name)"
                                                                                     v-on:input="updateSpecimenAttributeFromMultiSelect">
                                                                        </multiselect>

                                                                        <CivicGeneSelectionPlugin v-if="att.type==='civic-gene-api'"
                                                                                                  :prop_id="specimen.guid+'_'+att.name+'_multiple-large'"
                                                                                                  :value="currentSpecimenAttributeValue(specimen, att.name)"
                                                                                                  :prop_genes="civicGenesCache"
                                                                                                  v-on:input="updateSpecimenAttributeFromMultiSelect"
                                                                                                  v-on:genesRetrieved="cacheCivicGenes"></CivicGeneSelectionPlugin>

                                                                        <span v-if="att.informationTooltip != null" class="input-group-addon-clean-small-icon"
                                                                              data-toggle="tooltip" data-placement="top" :title="att.informationTooltip">
                                                                            <!-- Just a typo. Should be working now ;) -->
                                                                            <a v-if="att.informationSource != null" :href="att.informationSource" target="_new">
                                                                                <i class="fa fa-info"></i>
                                                                            </a>
                                                                            <i v-else class="fa fa-info"></i>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div v-show="specimen.attributesAreSet" class="col-12">
                                               <ImageUploadView
                                                                relationship_type="specimen"
                                                                :relationship_guid="specimen.guid"
                                                                :existing_images="specimen.customData.generalImages"
                                                                v-on:uploaded_images_changed="specimenImagesChanged">
                                               </ImageUploadView>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script src="./Specimens.vue.js">

</script>