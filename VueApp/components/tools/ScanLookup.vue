<template>
    <div>
        <div class="input-group">
            <i class="fa fa-search input-group-addon"></i>
            <input type="text" class="form-control focusDefault" v-on:change="scanLookup" v-model="value" :placeholder="currentAction.label" />
            <div class="input-group-btn">                
                <button type="button" class="btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {{currentAction.label}}
                </button>
                <div class="dropdown-menu">
                    <div v-for="action in this.actions"
                         v-on:click="setAction(action)"
                         :class="'dropdown-item ' + (currentAction === action ? 'active' : '')">{{action.label}}</div>
                </div>
            </div>            
        </div>
        <div :class="lookupCssClass + ' ml-3 font-xsl'">{{lookupMessage}}</div>
    </div>
</template>

<script src="./ScanLookup.vue.js">
    
</script>