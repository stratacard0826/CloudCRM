<template>

    <div class="container-fluid p-0">
        <div class="row m-0 p-0">
            <div class="col-3">
                <ClientTools v-if="user.groups.items.findIndex(c => c.name === 'Customer') < 0"></ClientTools>
                <CustomerTools v-else></CustomerTools>
            </div>
            <div class="bricklayer col-9">
                <!--partner cards-->
                <LabWorkflowChart v-if="user.groups.items.findIndex(c => c.name === 'Customer') < 0"
                                  :width="550"
                                  :prop_id="'labgeochart0'"
                                  :organization="organization"
                                  :user="user"
                                  class="dash-height-match "></LabWorkflowChart>
                <LabGeochart v-if="user.groups.items.findIndex(c => c.name === 'Customer') < 0"
                             :width="550"
                             :prop_id="'labworkflow0'"
                             :organization="organization"
                             :user="user"
                             :chartName="'Specimens by Lab'"
                             class="dash-height-match"></LabGeochart>
                <!--customer cards-->
                <SpecimenGeochart v-if="user.groups.items.findIndex(c => c.name === 'Customer') > -1"
                                  :width="550"
                                  :prop_id="'specimen_geochart0'"
                                  :mode="'Specimens'" :region="''"
                                  :chartName="'Specimens by Region'"
                                  :user="user"
                                  class="dash-height-match"></SpecimenGeochart>
                <TopSpecimens v-if="user.groups.items.findIndex(c => c.name === 'Customer') > -1"
                              :width="550"
                              :default_attribute_name="'geneVariant'"
                              :prop_id="'top_specimens0'"
                              :mode="'Specimens'"
                              :organization="organization"
                              :user="user"
                              :max_chart_records="10"
                              class="dash-height-match"></TopSpecimens>
                <TopSpecimens v-if="user.groups.items.findIndex(c => c.name === 'Customer') > -1"
                              :width="550"
                              :default_attribute_name="'HistoryOfSmoking'"
                              :prop_id="'top_specimens1'"
                              :mode="'Specimens'"
                              :organization="organization"
                              :user="user"
                              class="dash-height-match"></TopSpecimens>
            </div>
        </div>
    </div>

</template>

<script src="./MyDashboard.vue.js">

</script>

<style type="text/css">
    .bricklayer-column {
        text-align: center;
    }
        .bricklayer-column > .card {
            margin: 0 auto;
            float: none;
        }
</style>