<template>
    <div class="card card-compact">
        <div class="card-header">Order Info</div>
        <div class="card-block">
            <div class="row">
                <div class="col-4">Order ID:</div>
                <div class="col-8 font-weight-bold"">{{order.id}}</div>
            </div>
            <div class="row">
                <div class="col-4">
                    Created:
                </div>
                <div class="col-8 font-weight-bold"">{{order.createdDate | localeDate }}</div>
            </div>
            <div class="row">
                <div class="col-4">
                    User:
                </div>
                <div class="col-8 font-weight-bold">
                    {{order.createdFullName}}
                </div>
            </div>
            <div class="row">
                <div class="col-4">Payment Method:</div>
                <div class="col-8 font-weight-bold"">??</div>
            </div>
            <div class="row">
                <div class="col-4">Shipping Method:</div>
                <div class="col-8 font-weight-bold"">{{order.customData.shippingMethod}}</div>
            </div>
            <div class="row">
                <div class="col-4">Status:</div>
                <div class="col-8 font-weight-bold"">[bite the bullet on purchase workflow please, Ian]</div>
            </div>
        </div>
    </div>
</template>

<script src="./OrderInfo.vue.js"></script>