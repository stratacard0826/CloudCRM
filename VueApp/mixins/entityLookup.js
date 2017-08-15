//nevermind this
import Vue from 'vue';

Vue.mixin({
    methods: {
        lookup: function(type, value, data){
            switch(type){
                case "lab":
                case "client":
                case "patient":
                default:
                    var retVal = data.find(function(c) {return c.id === value;});
                    if(typeof(retVal)!=='undefined'){
                        return retVal;
                    }
                    else
                    {
                        console.log('Lookup error - ' + type + ' not found for Id ' + value);
                        return {
                            id: 0,
                            name: 'Unknown'
                        };
                    }
            }
        },

    }
});