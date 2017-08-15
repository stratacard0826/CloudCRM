<template>
    <div class="card card-accent-info">
        <div class="card-header">
            Partner Tools
        </div>
        <div class="card-block">
            <div class="row">
                <div class="col-12">
                    <div class="row">
                        <div class="col-12 text-center font-2xl">Actions</div>
                    </div>
                    <div class="row mt-1">
                        <div class="col-6">
                            <router-link :to="{ name: 'New Accession'}"
                                         class="btn-info pr-q w-100"
                                         tag="button">
                                New Accession
                            </router-link>
                        </div>
                        <div class="col-6">
                            <router-link :to="{ name: 'Specimen Inventory'}"
                                         class="btn-info pr-q w-100"
                                         tag="button">
                                Specimen Inventory
                            </router-link>
                        </div>                        
                    </div>
                    <div class="row mt-1">
                        <div class="col-12 input-group">                            
                            <button type="button" class="input-group-addon">Edit Accession</button>
                            <input type="number" class="form-control" disabled="disabled" placeholder="Type ID and Press [Enter]" />                            
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
                                <td>Case</td>
                                <td>Subject 124321, 3 Blocks</td>
                                <td>Workflow IHC: Analysis</td>
                                <td>7/19/2017</td>
                            </tr>
                            <tr>
                                <td>Specimen</td>
                                <td>Specimen 19801 Paraffin Tissue (x3)</td>
                                <td>Workflow Histology: Grossing</td>
                                <td>6/22/2017</td>
                            </tr>
                            <tr>
                                <td>Specimen</td>
                                <td>Specimen 19807 Paraffin Tissue (x3)</td>
                                <td>Workflow Histology: Grossing</td>
                                <td>6/22/2017</td>
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
        name: "ClientActions",
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