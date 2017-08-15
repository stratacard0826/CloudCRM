<template>
    <div class="modal-full modal-info" id="searchModal" tabindex="-1" role="dialog" aria-labelledby="searchLabel">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title text-white" id="searchLabel">Catalog Search</h4>
                </div>
                <div class="modal-body">
                    <AttributeSearch v-if="this.organization.customData != null"
                                     :organization="this.organization"
                                     :entityType="'patient'"
                                     v-on:valuesChanged="searchValuesChanged"
                                     v-on:attributesLoaded="attributesLoaded"></AttributeSearch>
                    <AttributeSearch v-if="this.organization.customData != null"
                                     :organization="this.organization"
                                     :entityType="'specimen'"
                                     v-on:valuesChanged="searchValuesChanged"
                                     v-on:attributesLoaded="attributesLoaded"></AttributeSearch>
                    <!--<div v-if="accessionList.length > 0" class="card card-compact card-accent-warning">
                        <div class="card-header">Results</div>
                        <div class="overflow-auto-full card-block p-0">
                            <table class="table table-striped table-hover">
                                <thead class="text-nowrap">
                                    <tr>
                                        <th class="font-xs">Id</th>
                                        <th v-for="attribute in allAttributes" class="font-xs">
                                            { {attribute.label}}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="cursor-pointer" 
                                        v-for="accession in accessionList" 
                                        data-dismiss="modal" 
                                        v-on:click="selectAccession(accession)">
                                        <td class="font-xs">{ {accession.id}}</td>
                                        <td class="font-xs" v-for="attribute in allAttributes">
                                            { {getAccessionValue(accession, attribute)}}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>-->
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn" data-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" v-on:click="search">Search</button><br />
                    <button type="button" class="btn">Save to Wishlist</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script src="./SearchModal.vue.js"></script>