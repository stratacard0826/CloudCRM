<template>
    <!--<div class="container-fluid m-0 p-0 float-right">
        <!--<div class="row m-0">
            <div class="col-auto">
                <label class="label-black">Specimen:</label>
            </div>
            <div class="col-auto text-right">
                { {(group.primarySpecimen.externalId === '' || group.primarySpecimen.externalId === null ? '# ' + group.primarySpecimen.id : group.primarySpecimen.externalId) + ' - ' + group.primarySpecimen.type.type}}
            </div>
        </div>-->
        <!--<div class="row m-0">
            <div class="col-auto">
                <label class="label-black mr-1">Quantity ({{group.maxQuantity}} available):</label>

                <input v-if="group.maxQuantity > 0" type="number" min="0" :max="group.maxQuantity" class="number-small mr-1" v-model="group.selectedQuantity" />
                <input v-else type="number" min="0" max="0" class="number-small mr-1" disabled="disabled" />

                <button v-if="group.maxQuantity > 0" v-on:click="addToCart(group)" class="btn btn-info btn-sm" style="width:10rem">
                    Acquire Specimen(s)
                </button>
                <button v-else disabled="disabled" class="btn btn-info btn-sm" style="width:10rem;">
                    Acquire Specimen(s)
                </button>
            </div>
        </div>-->
        <!--<div class="row m-0">
            <div class="col-auto p-0">
                <SpecimenInfo :organization="organization"
                              :specimen="group.primarySpecimen" />
            </div>
        </div>
    </div>-->
    <form class="acquireSpecimen">
        <legend><h2>Add to Cart</h2></legend>
        <mark>$12</mark>
        <fieldset>
            <div>
                <label v-if="group.maxQuantity > 0">
                    Quantity
                    <select v-if="group.maxQuantity > 0" v-model="group.selectedQuantity" class="form-control input-sm">
                        <option>0</option>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                    </select>
                </label>
                <div v-else>
                    <mark class="error">Out of stock</mark>
                </div>
            </div>
        </fieldset>
        <footer>
            <button v-if="group.maxQuantity > 0" v-on:click="addToCart(group)">ADD TO CART</button>
        </footer>
    </form>
</template>
<script src="./AcquireSpecimen.vue.js"></script>