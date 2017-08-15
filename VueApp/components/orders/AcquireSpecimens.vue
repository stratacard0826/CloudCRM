<template>
    <div class="card card-accent-info">
        <div class="card-header">
            <span class="specimenLabel">Specimen</span> Acquisition
        </div>
        <div class="card-block p-0 text-nowrap">
            <div v-for="specGroup in groups" class="container-fluid mt-h">
                <AcquireSpecimen
                                 :specimen_group="specGroup"
                                 :organization="organization"></AcquireSpecimen>
                <hr />
            </div>
        </div>
    </div>
</template>
<script src="./AcquireSpecimens.vue.js"></script>
