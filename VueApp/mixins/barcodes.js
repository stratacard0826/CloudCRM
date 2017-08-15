import Vue from 'vue';
import axios from 'axios'

Vue.mixin({
    methods: {    
        getBarcodes: function(orgNameKey, accessionGuid, dataContainer){
            var vm = this;
            axios.post('/api/Barcode/lookup', {orgNameKey: orgNameKey, accessionGuid: accessionGuid})
            .then(response =>
                vm.$set(dataContainer, 'barcodes', response.data)
            ).catch(err => {console.log(err)});;
        }
    }
});
