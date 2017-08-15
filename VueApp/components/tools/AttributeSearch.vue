<template>

    <div class="card card-accent-info card-compact">
        <div class="card-header">{{entityType === 'patient' ? 'Patient/Subject' : 'Specimen'}}</div>
        <div class="card-block pb-0 pt-0">
            <div v-for="col in columnAttributes" class="row">
                <div v-for="att in col.attributes" v-if="att.name !== 'cost' && att.name !== 'Cost'" :class="col.class + ' p-1'">
                    <!--could use a computed getter/setter property, and v-model, but, complicated by array and 'section'-->
                    <label :for="att.name+'_'+att.type" class="label-above">{{att.label}}</label>
                    <div class="input-group">

                        <input v-if="att.type==='smallText'" type="text" :id="att.name+'_'+att.type" v-on:change="textValueChanged" />

                        <input v-else-if="att.type==='integer'" type="number" :id="att.name+'_'+att.type" v-on:change="textValueChanged" />

                        <CivicGeneSelectionPlugin v-else-if="att.type==='civic-gene-api'"
                                                  :prop_id="att.name+'_multiple-large'"
                                                  :prop_genes="civicGenesCache"
                                                  v-on:genesRetrieved="cacheCivicGenes"
                                                  v-on:input="multiSelectValueChanged"></CivicGeneSelectionPlugin>

                        <multiselect v-else
                                     :id="att.name+'_'+att.type"
                                     track-by="id" label="name"
                                     placeholder="Select one or more" :options="att.options" :searchable="true"
                                     :multiple="true" :allow-empty="true"
                                     selectLabel="" deselectLabel="" selectedLabel=""
                                     v-on:input="multiSelectValueChanged">
                        </multiselect>

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


</template>
<script src="./AttributeSearch.vue.js"></script>