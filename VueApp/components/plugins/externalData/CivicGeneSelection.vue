<template>

    <multiselect :id="prop_id"
                 track-by="id" label="name"
                 placeholder="Select one or more" :options="genes" :searchable="true" :taggable="true"
                 :multiple="true" :allow-empty="true"
                 :value="currentValue"
                 v-on:input="genesChanged"
                 v-on:tag="geneAdded"
                 selectLabel="" deselectLabel="" selectedLabel="">
    </multiselect>

</template>

<script>
    import Multiselect from 'vue-multiselect';
    import axios from 'axios';
    import cloneDeep from 'lodash/cloneDeep'

    module.exports =
    {
        name: "CivicGeneSelection",
        components: {
            Multiselect
        },
        props: {
            value: Array, //this component should support v-model (also emits 'input') but prop is currently set via function in parent
            prop_id: String,
            prop_genes: Array
        },
        data: function ()
        {
            return {
                genes: [],
                currentValue: []
            };
        },
        created: function()
        {
            var vm = this;
            vm.checkGenes();
            if(typeof vm.value !== 'undefined'){
                vm.$set(vm, 'currentValue', vm.value.map(v => cloneDeep(v))); //copy from input property (unidirectional dataflow ftw)
            }
        },
        methods:
        {
            genesRetrieved: function(genes){ //allow parent to cache genes //have to consider using a plugin vuex store or similar so a plugin can access global data
                this.$emit('genesRetrieved', genes);
            },
            genesChanged: function(newValue, id)
            {
                var vm = this;
                vm.$set(vm, 'currentValue', newValue); //update local copy
                vm.$emit('input', vm.currentValue, id); //return as event per unidirectional data flow
            },
            checkGenes: function(){
                var vm = this;
                if(vm.prop_genes.length > 0)
                    vm.$set(vm, 'genes', vm.prop_genes);
                else if(vm.genes.length < 1)
                    vm.getGenes();
            },
            getGenes: function()
            {
                var vm = this;
                axios.get('https://civic.genome.wustl.edu/api/genes?count=300').then(function (response) {
                    var genes = response.data.records.map(function (g) {
                        return g.variants.map(function (v) {
                            return {id: v.id, name: g.name + ' - ' + v.name};
                        });
                    }).reduce(function (a, b) { return a.concat(b); })
                    vm.$set(vm, 'genes', genes);
                    vm.genesRetrieved(genes);
                });
            },
            geneAdded: function(newGeneName)
            {
                var vm = this;
                var newGene = {id:'-1', name:newGeneName};
                vm.genes.push(newGene);
                vm.currentValue.push(newGene);
                vm.$emit('input', vm.currentValue, vm.prop_id); //return as event per unidirectional data flow
            }
        }
    };
</script>