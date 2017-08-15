<template>
    <div class="card card-accent-info" :style="'width:' + width + 'px;'">
        <div class="card-header">
            {{chartName}}
        </div>
        <div class="card-block m-0 p-0">
            <div class="row m-0">
                <div class="col-12 form-inline">
                    <!--<label class="label-black">Region:</label>-->
                    <div class="dropdown" style="position: absolute; top: 0.1rem; left:0.1rem; z-index:1000;">
                        <button class="btn btn-secondary dropdown-toggle" placeholder="Select Region" type="button" id="regionDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {{currentRegion.length > 0 ? currentRegion : 'Select Region'}}
                        </button>
                        <div class="dropdown-menu" aria-labelledby="regionDropdown">
                            <div v-for="region in regions" class="dropdown-item" v-on:click="setRegion(region, false)">{{region.length > 0 ? region : 'World'}}</div>
                        </div>
                    </div>
                    <a href="#" v-on:click="browse()" style="position: absolute; top: 0.1rem; right:1rem; z-index:1000;">{{viewCount}} records - click here to browse</a>
                </div>
            </div>
            <div class="mt-1" :id="prop_id + '_regions_div'"></div>
        </div>
    </div>
</template>

<script src="./LabGeoChart.vue.js"></script>