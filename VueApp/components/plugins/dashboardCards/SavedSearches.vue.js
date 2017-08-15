module.exports = {
    name: 'SavedSearches',
    props: {
        user: Object
    },
    computed: {
        savedSearches: {
            get: function()
            {
                var vm = this;
                var searches = [];
                if (typeof vm.user.customData.savedSearches !== 'undefined') {
                    searches = vm.user.customData.savedSearches;
                }
                return searches;
            }
        }
    }
}