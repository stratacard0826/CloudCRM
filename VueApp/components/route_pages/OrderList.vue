<template>
    <div class="container-fluid">
        <div v-if="!Array.isArray(orders)">
            <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i> Loading...
        </div>
        <div v-else="" id="orderListTableWrapper" class="table-responsive">
            <table id="orderListTable" class="nowrap table table-bordered table-condensed table-hover table-primary">
                <thead>
                    <tr>
                        <th>Order</th>
                        <th>Patient</th>
                        <th>Specimens</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="order in orders">
                        <td>
                            <OrderDetail :order="order"></OrderDetail>
                        </td>
                        <td>
                            <PatientInfo v-if="order.accession" :organization="organization" :patientId="order.accession.patient.id"></PatientInfo>
                        </td>
                        <td>
                            <div class="row" v-for="specimen in order.specimens">
                                <div class="col-12 font-weight-bold">
                                        Specimen {{getSpecimenId(specimen)}} - {{specimen.type.type}} - {{specimen.transport.name}}
                                </div>
                                <div class="col-12">
                                    <SpecimenInfo :organization="organization" :specimen="specimen"></SpecimenInfo>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script src="./OrderList.vue.js">
</script>

<style type="text/css">
    table.nowrap th {
    white-space: nowrap !important;
    }

    table.nowrap td {
    white-space: nowrap !important;
    }

    table td {
    vertical-align: top;
    }

    .dataTables_wrapper .row {
    margin-top: 0px !important;
    }
</style>