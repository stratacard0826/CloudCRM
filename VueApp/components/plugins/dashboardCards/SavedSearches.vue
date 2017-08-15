<template>
    <div class="card card-accent-info dashboard-card-25">
        <div class="card-header">
            <div class="row">
                <div class="col-12">
                    Recent Searches
                </div>
            </div>
        </div>
        <div class="card-block text-nowrap">
            <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Search Criteria</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="search in this.$options.filters.reverse(savedSearches)" track-by="date">
                        <td>{{search.date | localeDate}}</td>
                        <td>
                            <div class="row m-0" v-for="searchValue in search.searchValues">
                                <div class="col-12 p-0" style="line-height:1.2rem;display:inline-block;vertical-align:middle;">
                                    <span class="label-black float-left">{{searchValue.attributeLabel}}</span>
                                    <div class="tag-pill tag-info text-white font-xs font-weight-bold float-left ml-1" v-for="criterion in searchValue.criteria">
                                        {{criterion}}
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script src="./SavedSearches.vue.js"></script>