<template>

    <div class="app-root">
        <Navbar name="topNavBar" :user="this.user" :organization="this.organization"></Navbar>

        <div class="app-body">

            <Sidebar name="leftSidebar" v-if="this.userLoaded" :user="this.user"></Sidebar>

            <main class="main temp">
                <section class="content-header">
                    <h1>
                        {{$route.name.toUpperCase() }}
                        <small>{{ $route.description }}</small>
                    </h1>
                    <nav class="breadcrumb">
                        <router-link exact to="/" class="breadcrumb-item"><i class="fa fa-home"></i>Home</router-link>
                        <span class="active breadcrumb-item">{{$route.name.toUpperCase() }}</span>
                    </nav>
                </section>
                <div class="container-fluid pt-lg-1 pt-md-1 pt-sm-0">
                    <div v-if="this.organization != null" class="animated fadeIn">
                        <router-view 
                                     v-if="this.organization.customData != null" 
                                     :user="this.user" 
                                     :organization="this.organization" 
                                     :key="this.$route"
                                     v-on:addHistoryItem="addHistoryItemHandler"></router-view>
                    </div>
                </div>
            </main>

            <SecondarySidebar name="rightSidebar" :user="this.user" :organization="this.organization" :historyItems="this.historyItems"></SecondarySidebar>
        </div>

        <AppFooter name="footer" :organization="this.organization"></AppFooter>

        <SearchModal v-if="this.organization.customData != null" :organization="this.organization" :user="this.user"></SearchModal>
        <div class="alert alert-dismissible alert-warning alert-small" id="smallWarningAlert">
            <span id="smallWarningAlertText"></span>
        </div>
        <div class="alert alert-dismissible danger-warning alert-small" id="smallDangerAlert">
            <span id="smallDangerAlertText"></span>
        </div>
    </div>
    
</template>

<script src="./Main.vue.js">
    

</script>

<style>
    .user-panel {
        height: 4em;
    }

    hr.visible-xs-block {
        width: 100%;
        background-color: rgba(0, 0, 0, 0.17);
        height: 1px;
        border-color: transparent;
    }
</style>
