<template>
        <div class="card card-compact">
            <div class="card-header">{{addressLocal.type}}</div>
            <div class="card-block">
                <div class="row">
                    <div class="col-4">
                        Address Line 1
                    </div>
                    <div class="col-8">
                        <input v-if="!readOnly" type="text" v-model="addressLocal.address.addressLine1" class="form-control" />
                        <span v-else class="font-weight-bold">{{addressLocal.address.addressLine1}}</span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-4">
                        Address Line 2
                    </div>
                    <div class="col-8">
                        <input v-if="!readOnly" type="text" v-model="addressLocal.address.addressLine2" class="form-control" />
                        <span v-else class="font-weight-bold">{{addressLocal.address.addressLine2}}</span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-4">
                        City
                    </div>
                    <div class="col-8">
                        <input v-if="!readOnly" type="text" v-model="addressLocal.address.city" class="form-control" />
                        <span v-else class="font-weight-bold">{{addressLocal.address.city}}</span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-4">
                        State/Province
                    </div>
                    <div class="col-8">
                        <input v-if="!readOnly" type="text" v-model="addressLocal.address.state" class="form-control" />
                        <span v-else class="font-weight-bold">{{addressLocal.address.state}}</span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-4">
                        Postal Code
                    </div>
                    <div class="col-8">
                        <input v-if="!readOnly" type="text" v-model="addressLocal.address.postalCode" class="form-control" />
                        <span v-else class="font-weight-bold">{{addressLocal.address.postalCode}}</span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-4">
                        Country
                    </div>
                    <div class="col-8">
                        <input v-if="!readOnly" type="text" v-model="addressLocal.address.country" class="form-control" />
                        <span v-else class="font-weight-bold">{{addressLocal.address.country}}</span>
                    </div>
                </div>
            </div>
        </div>    
</template>

<script src="./Address.vue.js"></script>