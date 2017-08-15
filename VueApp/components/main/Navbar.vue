<template>
    <header class="app-header navbar">
        <button class="navbar-toggler mobile-sidebar-toggler hidden-lg-up" type="button">☰</button>
        <a class="navbar-brand" href="#"></a>
        <ul class="nav navbar-nav hidden-md-down">
            <li class="nav-item">
                <a class="nav-link navbar-toggler sidebar-toggler" href="#">☰</a>
            </li>
        </ul>
        <ul class="nav navbar-nav ml-auto">
            <li class="nav-item">
                <router-link exact :to="{name: 'Pending Acquisitions'}"><i class="fa fa-shopping-cart text-white font-lg"></i></router-link>
            </li>
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle nav-link" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
                    <span>{{user.fullName}}</span>
                    <!--without the below span and v-if, vue doesn't render user.fullName above on first load.  hiding it for now.-->
                    <span style="display:none;" class="hidden-md-down small" v-for="(item, index) in user.groups.items">
                        {{item.name}}<span v-if="index != (user.groups.items.length - 1)">,</span>
                    </span>
                </a>
                <div class="dropdown-menu" style="right:0!important">

                    <div class="dropdown-header">
                        <strong>Account</strong>
                    </div>

                    <router-link tag="a" exact :to="{name: 'Mailbox', params: {type: 'messages'}}" class="dropdown-item">
                        <i class="icon-envelope-letter"></i> Messages
                        <span class="tag" :class="{'tag-success': user.hasMessages, 'tag-default': !user.hasMessages}">
                            {{ user.messageCount }}
                        </span>
                    </router-link>

                    <router-link tag="a" exact :to="{name: 'Mailbox', params: {type: 'notifications'}}" class="dropdown-item">
                        <i class="icon-bell"></i> Notifications
                        <span class="tag" :class="{'tag-success': user.hasNotifications, 'tag-default': !user.hasNotifications}">
                            {{ user.notificationCount }}
                        </span>
                    </router-link>

                    <router-link tag="a" exact :to="{name: 'Pending Acquisitions'}" class="dropdown-item">
                        <i class="fa fa-shopping-cart"></i> Pending Acquisitions
                        <span class="tag" :class="{'tag-success': user.hasNotifications, 'tag-default': !user.hasNotifications}">
                            {{ user.notificationCount }}
                        </span>
                    </router-link>

                    <a class="dropdown-item" href="/login">
                        <i class="fa fa-lock" /> Logout
                    </a>

                    <!--<div class="dropdown-header text-center">
                        <strong>Setting</strong>
                    </div>-->
                    <!--<a class="dropdown-item" href="#"><i class="icon-envelope-letter"></i> Messages<span class="tag tag-default">{ { user.messageCount }}</span></a>
                    <a class="dropdown-item" href="#"><i class="icon-envelope-letter"></i> Messages<span class="tag tag-default">{ { user.messageCount }}</span></a>
                    <a class="dropdown-item" href="#"><i class="icon-envelope-letter"></i> Messages<span class="tag tag-default">{ { user.messageCount }}</span></a>-->

                </div>
            </li>
            <li class="nav-item hidden-md-down">
                <a class="nav-link navbar-toggler aside-menu-toggler" href="#">☰</a>
            </li>
        </ul>
    </header>
</template>

<script>

    module.exports = {
        name: 'Navbar',
        props: {
            user: Object,
            organization: Object
        }
    };
</script>