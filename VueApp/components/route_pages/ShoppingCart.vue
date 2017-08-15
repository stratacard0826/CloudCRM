<template>
    <div class="container-fluid">
      <h1>Specimen Acquisition</h1>
      <div v-if="currentOrder && currentOrder.id > 0">
        
        <div class="row mt-1">
            <div class="col-12">
                <div class="card w-100">
                    <div class="card-header">Specimens</div>
                    <div class="card-block">
                        <table class="table-striped w-100">
                            <thead>
                                <tr>
                                    <th>Specimen ID</th>
                                    <th>Type/Transport</th>
                                    <th>Details</th>
                                    <th>Qty Avail.</th>
                                    <th>Qty</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="specimen in currentOrder.specimens">
                                    <td>{{specimen.id}}</td>
                                    <td>{{specimen.type.type + '/' + specimen.transport.name}}</td>
                                    <td>
                                    </td>
                                    <td>
                                    </td>
                                    <td class="text-right">
                                      {{ specimen.orderSpecimenCustomData.quantity }}
                                    </td>
                                    <td class="text-right">
                                      ${{ (specimen.orderSpecimenCustomData.cost > 0) ? (specimen.orderSpecimenCustomData.cost * specimen.orderSpecimenCustomData.quantity) : 0 }}
                                    </td>
                                </tr>
                            </tbody>
                          <tfoot>
                            <tr>
                              <td>
                                <strong>Total</strong>
                              </td>
                              <td>&nbsp;</td>
                              <td>&nbsp;</td>
                              <td>&nbsp;</td>
                              <td class="text-right">{{totalQuantity}}</td>
                              <td class="text-right">${{totalPrice}}</td>
                            </tr>
                          </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-6">
                <div class="card">
                    <div class="card-header">Shipping Address</div>
                    <div class="card-block">
                      <div class="row mb-1">
                        <label class="col-4">Address Line 1</label>
                        <div class="col-8">
                          <input type="text" class="form-control" v-model="shippingAddress.addressLine1" />
                        </div>
                      </div>
                      <div class="row mb-1">
                        <label class="col-4">Address Line 2</label>
                        <div class="col-8">
                          <input type="text" class="form-control" v-model="shippingAddress.addressLine2" />
                        </div>
                      </div>
                      <div class="row mb-1">
                        <label class="col-4">City</label>
                        <div class="col-8">
                          <input type="text" class="form-control" v-model="shippingAddress.city" />
                        </div>
                      </div>
                      <div class="row mb-1">
                        <label class="col-4">State</label>
                        <div class="col-8">
                          <input type="text" class="form-control" v-model="shippingAddress.state" />
                        </div>
                      </div>
                      <div class="row mb-1">
                        <label class="col-4">Postal Code</label>
                        <div class="col-8">
                          <input type="text" class="form-control" v-model="shippingAddress.postalcode" />
                        </div>
                      </div>
                      <div class="row mb-1">
                        <label class="col-4">Country</label>
                        <div class="col-8">
                          <select class="form-control" v-model="shippingAddress.country">
                            <option value="USA">USA</option>
                          </select>
                        </div>
                      </div>
                    </div>
                </div>
            </div>
            <div class="col-6">
                <div class="card">
                    <div class="card-header">Billing Address 
                      <span class="pull-right">
                        <label class="mb-0">Use shipping address</label>
                        <input type="checkbox" v-model="copyShippingAddress"/>
                      </span>
                    </div>
                    <div class="card-block">
                      <div class="row mb-1">
                        <label class="col-4">Address Line 1</label>
                        <div class="col-8">
                          <input type="text"  class="form-control" v-model="billingAddress.addressLine1" />
                        </div>
                      </div>
                      <div class="row mb-1">
                        <label class="col-4">Address Line 2</label>
                        <div class="col-8">
                          <input type="text" class="form-control" v-model="billingAddress.addressLine2" />
                        </div>
                      </div>
                      <div class="row mb-1">
                        <label class="col-4">City</label>
                        <div class="col-8">
                          <input type="text" class="form-control" v-model="billingAddress.city" />
                        </div>
                      </div>
                      <div class="row mb-1">
                        <label class="col-4">State</label>
                        <div class="col-8">
                          <input type="text" class="form-control" v-model="billingAddress.state" />
                        </div>
                      </div>
                      <div class="row mb-1">
                        <label class="col-4">Postal Code</label>
                        <div class="col-8">
                          <input type="text" class="form-control" v-model="billingAddress.postalcode" />
                        </div>
                      </div>
                      <div class="row mb-1">
                        <label class="col-4">Country</label>
                        <div class="col-8">
                          <select class="form-control" v-model="billingAddress.country">
                            <option value="USA">USA</option>
                          </select>
                        </div>
                      </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-6">
                <div class="card">
                    <div class="card-header">Shipping Method</div>
                    <div class="card-block">
                      <div class="row mb-1">
                        <label class="col-4">FedEx Overnight</label>
                        <div class="col-8">
                          <input type="radio" v-model="shippingMethod" value="FedEx Overnight" name="shippingMethod" />
                        </div>
                      </div>
                      <div class="row mb-1">
                        <label class="col-4">FedEx 2-day</label>
                        <div class="col-8">
                          <input type="radio" v-model="shippingMethod" value="FedEx 2-day" name="shippingMethod" />
                        </div>
                      </div>
                    
                    </div>
                </div>
            </div>
            <div class="col-6">
                <div class="card">
                    <div class="card-header">Payment Information</div>
                    <div class="card-block">
                        <div class="row mb-1">
                            <div class="col-md-12 col-sm-12 col-12">
                                <h5 class="text-muted"> Credit Card Number</h5>
                            </div>
                            <div class="col-md-12 col-sm-12 col-12">
                                <input class="form-control" v-model="paymentInfo.cardNumber" placeholder="0000" type="text">
                            </div>
                        </div>
                        <div class="row mb-1">
                            <div class="col-md-3 col-sm-3 col-3">
                                <span class="help-block text-muted small-font"> Expiry Month</span>
                                <input class="form-control" v-model="paymentInfo.expMonth" placeholder="MM" type="text">
                            </div>
                            <div class="col-md-3 col-sm-3 col-3">
                                <span class="help-block text-muted small-font">  Expiry Year</span>
                                <input class="form-control" v-model="paymentInfo.expYear" placeholder="YY" type="text">
                            </div>
                            <div class="col-md-3 col-sm-3 col-3">
                                <span class="help-block text-muted small-font">  CCV</span>
                                <input class="form-control" v-model="paymentInfo.ccv" placeholder="CCV" type="text">
                            </div>
                        </div>
                        <div class="row mb-1">
                            <div class="col-md-12 pad-adjust">
                                <input class="form-control" v-model="paymentInfo.cardName" placeholder="Name On The Card" type="text" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12 text-right mb-2">
                <button v-on:click="saveOrder()" class="btn btn-info ">
                    <i class="fa fa-save "></i>&nbsp;
                    Save
                </button>
            </div>
        </div>
      </div>
      <div v-else class="mt-2">
        <strong>No items in cart</strong>
      </div>

    </div>
</template>
<script src="./ShoppingCart.vue.js"></script>