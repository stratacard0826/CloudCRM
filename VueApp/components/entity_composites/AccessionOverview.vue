<template>
    <div class="card inner-card-no-border no-border">
        <!--<div v-if="showHeader" class="card-header">
            Overview
        </div>-->
        <div class="card-block m-0 p-0">
            <AccessionInfo :accession="accession"
                           :organization="organization"
                           :layout="'horizontal'"></AccessionInfo>
        </div>
    </div>
</template>
<script src="./AccessionOverview.vue.js"></script>
