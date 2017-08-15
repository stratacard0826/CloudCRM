<template>
    <div class="card card-accent-info">
        <div class="card-header">
            Customer Tools
        </div>
        <div class="card-block">
            <div class="row">
                <div class="col-12">
                    <div class="row">
                        <div class="col-12 text-center font-2xl">Actions</div>
                    </div>
                    <div class="row mt-1">
                        <div class="col-6">
                            <router-link :to="{ name: 'Specimen Catalog'}"
                                         class="btn-info pr-q w-100"
                                         tag="button">
                                Browse Catalog
                            </router-link>
                        </div>
                        <div class="col-6">
                            <router-link :to="{ name: 'Order List'}"
                                         class="btn-info pr-q w-100"
                                         tag="button">
                                My Orders
                            </router-link>
                        </div>
                    </div>
                    <div class="row mt-1">
                        <div class="col-12 input-group">
                            <button type="button" class="input-group-addon">Search Catalog</button>
                            <input type="text" class="form-control" placeholder="Enter Criteria and Press [Enter]" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="row mt-2">
                <div class="col-12" style="overflow-y:auto">
                    <div class="row">
                        <div class="col-12 text-center font-2xl">My Items</div>
                    </div>
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Description</th>
                                <th>State</th>
                                <th>Due</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Specimen</td>
                                <td>Specimen 19801 Paraffin Tissue (x3)</td>
                                <td>In Transit to Customer</td>
                                <td>7/7/2017</td>
                            </tr>
                            <tr>
                                <td>Specimen</td>
                                <td>Specimen 19807 Paraffin Tissue (x3)</td>
                                <td>In Cart</td>
                                <td>N/A</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    module.exports = {
        name: "CustomerActions",
        data: function () {
            return {

            }
        },
        props: {
            width: Number
        },
        methods: {
            editClick: function () {

            }
        }
    };
</script>