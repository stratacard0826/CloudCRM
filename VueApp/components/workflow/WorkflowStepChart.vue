<template>

    <div class="card-block">
        <div class="row">
            <div class="col-12"></div>
        </div>
        <div class="row">
            <div class="arrow-steps">
                <div class="a-step"
                     v-for="step in currentWorkflow.steps"
                     :class="getStepStatus(step.name, currentSpec)"
                     :style="'width:' + getWorkflowStepWidth(currentSpec.workflowStepsCount) + '%'"
                     v-on:click="changeStep(step.name, currentSpec)">
                    <span>{{ step.name }}</span><br />
                    <span>{{ getCompleted(step.name, currentSpec.currentWorkflowHistory) }}</span>
                </div>
            </div>
        </div>
    </div>

</template>
<script src="./WorkflowStepChart.vue.js"></script>