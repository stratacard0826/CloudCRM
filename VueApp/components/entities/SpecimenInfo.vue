<template>
    <div>
        <header>
            <h2>
                SPECIMEN INFO
            </h2>
        </header>
        <div v-for="row in organization.customData.specimenAccessionSections.rows">
            <div v-for="col in row.cols">
                <dl v-for="att in getSpecimenAttributesBySectionAndType(col.sectionName, specimen.type.code)">
                    <dt>{{att.label}}</dt>
                    <dd v-if="Array.isArray(currentSpecimenAttributeValue(specimen, att.name))">
                        <span v-if="currentSpecimenAttributeValue(specimen, att.name).length === 0">
                            {{'' | noData}}
                        </span>
                        <span v-else v-for="value in currentSpecimenAttributeValue(specimen, att.name)">
                            {{value.name}}
                        </span>
                    </dd>
                    <dd v-else>
                        {{currentSpecimenAttributeValue(specimen, att.name).name | noData}}
                    </dd>
                </dl>
            </div>
        </div>
    </div>
    <!--<div class="container-fluid m-0 p-0">
        <div v-for="row in organization.customData.specimenAccessionSections.rows" class="row m-0">
            <!--:class="col.class"
            <div v-for="col in row.cols" class="col-auto m-0 p-0 mr-lg-1">  <!--:class="col.class + ' m-0 p-0'">
                <div class="card card-compact card-no-outer-border">
                    <div class="card-header">{{col.sectionName}}</div>
                    <div class="card-block wrap-unset">
                        <div class="row m-0 underline-light-grey" v-for="att in getSpecimenAttributesBySectionAndType(col.sectionName, specimen.type.code)">
                            <div class="col-auto mr-1">
                                <label :for="'attValue' + specimen.id + att.name" class="label-black"><strong>{{att.label}}</strong>:</label>
                            </div>
                            <div class="col-auto" :id="'attValue' + specimen.id + att.name">
                                <div v-if="Array.isArray(currentSpecimenAttributeValue(specimen, att.name))" class="row m-0 p-0">
                                    <div v-if="currentSpecimenAttributeValue(specimen, att.name).length === 0" class="col-12 m-0 p-0 w-100 text-right">
                                        {{'' | noData}}
                                    </div>
                                    <div v-else v-for="value in currentSpecimenAttributeValue(specimen, att.name)" class="col-12 m-0 p-0 w-100 text-right">
                                        {{value.name}}
                                    </div>
                                </div>
                                <div v-else class="m-0 p-0 w-100 text-right">
                                    {{currentSpecimenAttributeValue(specimen, att.name).name | noData}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>-->
</template>
<script src="./SpecimenInfo.vue.js">

</script>