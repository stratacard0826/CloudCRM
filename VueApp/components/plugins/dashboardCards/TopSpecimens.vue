<template>
    <div class="card card-accent-info"  :style="'width:' + width + 'px;'">
        <div class="card-header">
            {{chartName}}
        </div>
        <div class="card-block m-0 p-0">
            <div class="row m-0">
                <div class="col-12 form-inline">
                    <!--<label class="label-black">Attribute:</label>-->
                    <div class="dropdown" style="position: absolute; top: 0.1rem; left:0.1rem; z-index:1000;">
                        <button class="btn btn-secondary dropdown-toggle" placeholder="Select Attribute" type="button" id="attributeDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {{currentAttribute.label}}
                        </button>
                        <div class="dropdown-menu" aria-labelledby="attributeDropdown">
                            <div v-for="attribute in attributes" class="dropdown-item" v-on:click="setAttribute(attribute)">{{attribute.label}}</div>
                        </div>
                    </div>                    
                    <a href="#" style="position: absolute; top: 0.1rem; right:1rem; z-index:1000;">Click chart item to browse</a>
                </div>                
            </div>           
            <div v-if="dataLoaded" class="mt-1" :id="prop_id + '_attributes_div'"></div>
            <div v-else class="mt-1 text-center" :id="prop_id + '_no_data'" style="width:550px;height:350px;vertical-align:middle;display:inline-block;"><span>No records found</span></div>
        </div>
    </div>
</template>
<script src="./TopSpecimens.vue.js"></script>