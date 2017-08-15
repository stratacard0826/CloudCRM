<template>
    <div class="container-fluid pt-2">
        WIP (isn't it all?)
        <ul class="nav nav-tabs" role="tablist">
            <li class="nav-item">
                <a class="nav-link active" data-toggle="tab" href="#organization" role="tab" aria-controls="organization">Organization</a>
            </li>
            <li class="nav-item">
                <a class="nav-link active" data-toggle="tab" href="#users" role="tab" aria-controls="users">Users</a>
            </li>
        </ul>
        <div class="tab-content">
            <div class="tab-pane p-1 active" id="organization" role="tabpanel"><Organization></Organization></div>
            <div class="tab-pane p-1" id="users" role="tabpanel">...</div>
        </div>
    </div>
</template>
<script>
    import Organization from './Organization.vue'
    import { mapGetters, mapActions} from 'vuex';
    module.exports = {
        name: 'ClientAdmin',
        components: {'Organization': Organization},
        computed: {
        },
        created: function() {
        },
        mounted: function() {
        }
    };


</script>
<style>
</style>
