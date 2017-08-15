<template>
    <div class="row">
        <div v-for="(specimen, index) in specimens" class="col-12">
            <WorklistSpecimenDetail :organization="organization" :specimen="specimen" :specimenIndex="index"></WorklistSpecimenDetail>                        
        </div>
    </div>
</template>

<script src="./WorklistSpecimens.vue.js">
</script>