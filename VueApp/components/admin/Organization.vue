<template>
    <div class="card">
        <div class="card-header">
            {{user.fullName}} - {{organization.name}}
            <div class="card-actions">
                <a href="https://github.com/digitalBush/jquery.maskedinput">
                    <small class="text-muted">docs</small>
                </a>
            </div>
        </div>
        <div class="card-block">
            <fieldset class="form-group">
                <label>Multiple Select / Tags</label>
                <select id="select2" class="form-control select2-multiple" multiple="">
                    <option>Option 1</option>
                    <option selected="">Option 2</option>
                    <option>Option 3</option>
                    <option>Option 4</option>
                    <option>Option 5</option>
                </select>
                <input id="demo" name="demo" class="demo" />
            </fieldset>
        </div>
    </div>
</template>
<script>

//continue using vuex for organization as it does have a global presence.  remember not to use v-model for two-way bindable fields.
import { mapGetters, mapActions} from 'vuex';
    
    module.exports = {
        name: 'Organization',
        computed: {
            set: function(org){
                this.$parent.$store.dispatch('organization/setOrganization', org);
            },
            ...mapGetters('organization', ['organization']),
            ...mapGetters('user', ['user']),
        },
    mounted: function() {
        setupFormOverlays();
    }
    };

    var setupFormOverlays = function (){

        $('#select2').select2();

        $('input[name="demo"]').daterangepicker({
            "singleDatePicker": true,
            "timePicker": true,
            "startDate": "07/01/2015",
            "endDate": "07/15/2015",
            locale: {
                format: 'MM/DD/YYYY h:mm A'
            }
        });
    }
</script>