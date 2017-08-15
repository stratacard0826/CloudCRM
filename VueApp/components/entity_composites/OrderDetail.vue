<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-12 p-0">
                <OrderInfo :order="order"></OrderInfo>
            </div>
            <div v-for="(address, index) in addresses" class="col-auto">
                <AddressVue v-model="addresses[index]" :readOnly="true"></AddressVue>
            </div>
        </div>
    </div>
</template>

<script src="./OrderDetail.vue.js"></script>