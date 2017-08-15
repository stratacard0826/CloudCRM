import Vue from 'vue';

Vue.mixin({
    methods: {           
        setHistoryItems: function(entity, route, subject, content, headline, showWarning, warning, updated){
            var vm = this;

            vm.$emit('addHistoryItem', updated, {
                type: 'accession',
                route: route,
                itemGuid: entity.guid, 
                itemId: entity.id,
                headline: headline,
                showWarning: showWarning,
                warning: warning,
                subject: subject, 
                content: content, //specimens.join(', '), 
                timeStamp: entity.createdDate,
                updated: updated
            });
        },
    }
});