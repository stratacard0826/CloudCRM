<template>
    <div class="card card-accent-info" :style="'width:' + width + 'px;'">
        <div class="card-header">
            Lab Workflow Chart
        </div>
        <div class="card-block m-0 p-0">
            <div class="row m-0">
                <div class="col-12">
                    <div class="form-inline w-100">
                        <div class="dropdown">
                            <button class="btn btn-secondary dropdown-toggle" placeholder="Select Type" type="button" id="typeDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {{currentType}}
                            </button>
                            <div class="dropdown-menu" aria-labelledby="typeDropDown">
                                <div v-for="type in types" class="dropdown-item" v-on:click="setType(type)">{{type}}</div>
                            </div>
                        </div>
                        <div class="dropdown">
                            <button class="btn btn-secondary dropdown-toggle" placeholder="Select workflow" workflow="button" id="workflowDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {{currentWorkflow}}
                            </button>
                            <div class="dropdown-menu" aria-labelledby="workflowDropDown">
                                <div v-for="workflow in workFlows" class="dropdown-item" v-on:click="setworkflow(workflow)">{{workflow}}</div>
                            </div>
                        </div>
                        <span style="position: absolute; top: 0.1rem; right:1rem; z-index:1000;">Click chart item to browse</span>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12 h-100 align-middle">
                    <div v-if="dataLoaded" :id="prop_id + '_lab_workflow_div'"></div>
                    <div v-else class="mt-1 text-center" :id="prop_id + '_no_data'" style="width:550px;height:350px;vertical-align:middle;display:inline-block;"><span>No records found</span></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script src="./LabWorkflowChart.vue.js"></script>