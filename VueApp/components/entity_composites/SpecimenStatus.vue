<template>
    <div class="card card-accent-info dashboard-card-36">
        <div class="card-header">
            <div class="row">
                <div class="col-4">
                    <span class="specimenLabel">Specimen</span> Status
                </div>
                <!--<div class="col-8"><div class="tag tag-info float-right" v-if="currentWorkflow.available && specimenSelected">Available</div></div>-->
                <div class="col-8"><button class="btn btn-info btn-sm float-right" v-if="changesMade" @click="saveWorkflowChanges">Save</button></div>
            </div>
        </div>
        <div class="card-block p-0 text-nowrap" style="max-height:35rem;overflow-y:auto;">
            <div v-if="specimenSelected">
                <div v-for="group in specimenGroups" class="container-fluid">
                    <div v-for="currentSpec in currentSpecimensByGroup(group.groupGuid)" v-if="currentSpec.isPrimary || currentSpec.isExpanded">
                        <div class="row mt-1 mb-1">
                            <div class="arrow-steps">
                                <div class="a-step"
                                     v-for="step in currentWorkflowSteps(currentSpec.workflow.name)"
                                     :class="getStepStatus(step.name, currentSpec)"
                                     :style="'width:' + getWorkflowStepWidth(currentSpec.workflowStepsCount) + '%'"
                                     v-on:click="changeStep(step.name, currentSpec)">
                                    <span>{{ step.name }}</span><br />
                                    <span>{{ getCompleted(step.name, currentSpec.currentWorkflowHistory) }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 col-12">
                            </div>
                            <div class="col-md-6 col-12">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 col-12">
                                <div class="row">
                                    <div class="col-md-4 col-12">
                                        <label class="label-black">Specimen:</label>
                                    </div>
                                    <div class="col-md-8 col-12">
                                        {{(currentSpec.specimen.externalId === '' || currentSpec.specimen.externalId === null ? '# ' + currentSpec.specimen.id : currentSpec.specimen.externalId) + ' - ' + currentSpec.specimen.type.type}}
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-auto col-12">
                                        <label class="labLabel label-black">Laboratory:</label>
                                    </div>
                                    <div class="col-md-auto col-12">
                                        {{currentWorkflow.laboratory}}
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-auto col-12">
                                        <label class="departmentLabel label-black">Department:</label>
                                    </div>
                                    <div class="col-md-auto col-12">
                                        {{currentWorkflow.department}}
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-auto col-12">
                                        <label class="locationLabel label-black">Location:</label>
                                    </div>
                                    <div class="col-md-auto col-12">
                                        {{currentWorkflow.location}}
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6 col-12">
                                <div class="row">
                                    <div class="col-md-auto col-12">
                                        <label class="label-black">Workflow:</label>
                                    </div>
                                    <div class="col-md-auto col-12">
                                        <div class="dropdown">
                                            <button class="btn btn-sm dropdown-toggle"
                                                    id="selectWorkflowBtn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                {{currentSpec.workflow.name}}
                                            </button>
                                            <div class="dropdown-menu" aria-labelledby="selectWorkflowBtn">
                                                <div class="dropdown-item cursor-pointer"
                                                     v-for="wf in organizationSpecimenWorkflows"
                                                     v-on:click="changeWorkflow(wf.name, currentSpec)">{{wf.name}}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-auto col-12">
                                        <label class="label-black">Due:</label>
                                    </div>
                                    <div class="col-md-auto col-12">
                                        {{getDueDate(currentSpec) | localeDate}}
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-auto col-12">
                                        <label class="label-black">Updated:</label>
                                    </div>
                                    <div class="col-md-auto col-12">
                                        {{currentSpec.workflow.lastUpdated | localeDate}}
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-auto col-12">
                                        <label class="label-black">User:</label>
                                    </div>
                                    <div class="col-md-auto col-12">
                                        {{currentSpec.workflow.userFullName}}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row mt-1 mb-1"
                         v-if="group.count > 1">
                        <div class="col-12 mb-q">
                            <input type="checkbox"
                                   :checked="group.applyAll"
                                   :id="group.groupGuid + '_ApplyAll'"
                                   @click="applyAllChanged(group.groupGuid)">
                            <span>{{ 'Apply changes to enitre group (There are ' + group.count + ' selected specimens for this group)' }}</span>
                            </input>
                        </div>
                        <div class="col-12">
                            <button class="btn btn-sm btn-block"
                                    v-if="currentSpecimensByGroup(group.groupGuid).length > 0"
                                    @click="expandGroup(group.groupGuid)">
                                <i v-if="group.isExpanded" class="fa fa-chevron-up float-left" aria-hidden="true"></i>
                                <i v-else class="fa fa-chevron-down float-left" aria-hidden="true"></i>

                                {{ group.isExpanded ? 'Collapse' : 'Expand' }}

                                <i v-if="group.isExpanded" class="fa fa-chevron-up float-right" aria-hidden="true"></i>
                                <i v-else class="fa fa-chevron-down float-right" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>
                    <div v-else>
                        <hr />
                    </div>
                </div>
            </div>
            <div v-else>
                No Specimen Selected
            </div>
        </div>
    </div>
</template>
<script src="./SpecimenStatus.vue.js"></script>