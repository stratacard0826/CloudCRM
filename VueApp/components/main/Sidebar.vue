<template>
    <div class="sidebar">
        <nav class="sidebar-nav open">
            <form>
                <h5>Main Menu</h5>
                <div class="form-group p-h mb-0 ml-h mr-h">
                    <input type="text" name="search" id="search" class="search form-control" data-toggle="hideseek" placeholder="Search Menu" data-list=".search-nav">
                </div>
            </form>
            <div v-for="route in this.$router.options.routes.filter(r => r.children && r.children.findIndex(c => showRoute(c)) > -1)" class="p-0 m-0">
                <ul class="nav search-nav">
                    <li class="nav-title">
                        <a>{{ route.name }}</a>
                    </li>
                    <li v-for="childRoute in route.children"
                        v-if="showRoute(childRoute)"
                        class="nav-item">
                        <router-link tag="a" :to="{name: childRoute.name}" class="nav-link">
                            <i :class="childRoute.meta == null || childRoute.meta.iconClass == null ? defaultRouteIconClasses : childRoute.meta.iconClass"></i>
                            {{childRoute.name }}
                        </router-link>
                    </li>
                </ul>
            </div>
        </nav>
    </div>
</template>
<script>
    module.exports = {
        name: 'Sidebar',
        props: {
            user: Object
        },
        methods: {
            showRoute: function (childRoute) {
                var vm = this;
                var show = false;
                var allowedRoutes = [];

                for (var i = 0; i < vm.user.groups.items.length; i++) {
                    var groupRoutes = vm.user.groups.items[i].customData.find(c => c.key === 'allowedRoutes');
                    if (typeof groupRoutes !== 'undefined')
                        allowedRoutes = allowedRoutes.concat(groupRoutes.value).filter(function (elem, index, self) {
                            return index == self.indexOf(elem);
                        }); //unique
                }

                //pathetic security temp
                if (allowedRoutes.length === 0 || allowedRoutes.findIndex(r => r === childRoute.name) > -1) {
                    if (typeof childRoute.meta === 'undefined' || typeof childRoute.meta.showInNavMenu === 'undefined' || childRoute.meta.showInNavMenu == true)
                        show = true;
                }

                return show;
            }
        },
        computed: {
            changeloading: function () {
                this.store.dispatch('TOGGLE_SEARCHING');
            },
            toggleMenu: function (event) {
                // remove active from li
                window.$('li.pageLink').removeClass('active');
                // Add it to the item that was clicked
                event.toElement.parentElement.className = 'nav-item active';
            },
            defaultRouteIconClasses: function () { return "fa fa-list"; }
        }
    };
</script>
