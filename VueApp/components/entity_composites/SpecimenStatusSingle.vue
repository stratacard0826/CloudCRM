<template>
    <div class="container-fluid m-0 p-0">
        <div class="row m-0">
            <div class="card card-compact card-no-outer-border">
                <div class="card-header">Workflow and Tracking</div>
                <div class="card-block wrap-unset">
                    <div class="row m-0">
                        <div class="col-2">
                            <div class="dropdown">
                                <button id="selectWorkflowBtn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="btn btn-sm dropdown-toggle" style="background-color: white;">
                                    Workflow:&nbsp;&nbsp;transfer
                                </button> <div aria-labelledby="selectWorkflowBtn" class="dropdown-menu"><div class="dropdown-item cursor-pointer">Histology</div><div class="dropdown-item cursor-pointer">transfer</div></div>
                            </div>
                        </div>
                        <div class="col-10">
                            <div class="arrow-steps">
                                <div class="a-step danger" style="width: 32%;"><span>Return</span><br> <span>5/17/2017, 10:11:24 AM</span></div>
                                <div class="a-step danger-current" style="width: 32%;"><span>Preparation</span><br> <span></span></div>
                                <div class="a-step danger" style="width: 32%;"><span>Sent</span><br> <span></span></div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-auto mr-1">
                            <div class="row m-0 underline-light-grey">
                                <div class="col-auto"><label class="label-black">Specimen:</label></div>
                                <div class="col-auto text-right"># 117 - Paraffin Tissue</div>
                            </div>
                            <div class="row m-0 underline-light-grey">
                                <div class="col-auto"><label class="label-black">Updated:</label></div>
                                <div class="col-auto text-right">6/19/2017, 5:45:00 PM [Ian Field]</div>
                            </div><div class="row m-0">
                                <div class="col-auto"><label class="label-black">Due:</label></div>
                                <div class="col-auto text-right">
                                    5/17/2017, 11:11:23 AM
                                </div>
                            </div>
                        </div>
                        <div class="col-auto m-0 p-0">
                            <div class="row m-0 underline-light-grey">
                                <div class="col-auto"><label class="labLabel label-black">Laboratory:</label></div>
                                <div class="col-auto text-right">
                                    Default Laboratory
                                </div>
                            </div>
                            <div class="row m-0 underline-light-grey">
                                <div class="col-auto"><label class="departmentLabel label-black">Department:</label></div>
                                <div class="col-auto text-right">
                                    Accessioning
                                </div>
                            </div><div class="row m-0  underline-light-grey">
                                <div class="col-auto"><label class="locationLabel label-black">Location:</label></div>
                                <div class="col-auto text-right">
                                    Station 1
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script src="./SpecimenStatusSingle.vue.js"></script>