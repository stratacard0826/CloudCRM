<template>
    <div class="container-fluid align-content-center p-0">
        <div class="row mb-1">
            <div class="col-4 text-center">
                <button v-show="false" type="button" class="btn btn-primary" data-toggle="modal" data-target="#searchModal"><i class="fa fa-search"></i> Search Specimen Inventory</button>
            </div>
            <div class="col-4">
                <ScanLookup v-on:scanLookup="scanLookup" :lookupMessage="dashboardState.scanLookupMessage" :lookupCssClass="dashboardState.lookupStateCssClass"></ScanLookup>
            </div>
            <div class="col-4"></div>
            <!--<div class="col-auto text-center">
                <button class="btn btn-info">Configure Dashboard</button>
            </div>-->
        </div>
        <div class="row m-0 p-0" id="dashboardContent">
            <!--<div class="card-columns mt-1">-->
            <div class="col-4" id="leftColumn" style="min-height:100%">
                <AccessionOverview v-if="dashboardPlugins.indexOf('PatientDetail') >= 0 && dashboardState.accession !== null"
                                   :organization="organization"
                                   :accession="dashboardState.accession"
                                   class="inner-card-no-border"
                                   :showHeader="false"></AccessionOverview>
                <!--<AcquireSpecimens v-if="(dashboardPlugins.indexOf('AcquireSpecimens') >= 0 || dashboardPlugins.indexOf('SpecimenPurchase') >= 0) && dashboardState.currentSpecimen !== null"
                                 :organization="organization"
                                 :specimen="dashboardState.currentSpecimen"
                                 :specimens="dashboardState.accession.specimens"
                                 :user="user"
                                 :selectedSpecimens="dashboardState.selectedSpecimens">
                </AcquireSpecimens>-->
            </div>
            <div class="col-8" id="rightColumn">
                <SpecimenListFull v-if="dashboardPlugins.indexOf('SpecimenList') >= 0 && dashboardState.currentSpecimen !== null"
                                  :accession="dashboardState.accession"
                                  :updateNeeded="dashboardState.updateNeeded"
                                  :organization="organization"
                                  :primaryGroupGuid="dashboardState.currentSpecimen.customData.groupGuid"
                                  @changed="specimenChanged"
                                  @updateOthers="updateOthers"
                                  style="height:100%">
                </SpecimenListFull>

                <!--<SpecimenStatus v-if="dashboardPlugins.indexOf('SpecimenStatus') >= 0 && dashboardState.currentSpecimen !== null"
                                :accessionGuid="dashboardState.accession.guid"
                                :specimens="dashboardState.accession.specimens"
                                :selectedSpecimens="dashboardState.selectedSpecimens"
                                :organization="organization"
                                :user="user"
                                @updateOthers="updateOthers">
                </SpecimenStatus>-->
            </div>







            <!--<SavedSearches v-if="dashboardPlugins.indexOf('SavedSearches') >= 0 && dashboardState.currentSpecimen !== null"
                           :user="user">
            </SavedSearches>-->
            <!--</div>-->
        </div>
    </div>
</template>

<script src="./SpecimenTracking.vue.js">

</script>