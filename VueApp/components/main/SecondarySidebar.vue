<template>
    <div class="aside-menu">
        <span style="display:none">{{user.userName}}</span>
        <div class="card-accordian m-0">
            <div class="card-header accordian-card-header-aside card-header-grey">
                <span class="font-xs">
                    <i class="fa fa-chevron-right float-left p-q"></i>Specimen Tracking Station (Click)
                </span>
            </div>
            <div class="card-block" style="display:none;"></div>
        </div>
        <div class="card-accordian m-0">
            <div class="card-header accordian-card-header-aside">
                <span class="font-xs">
                    <i class="fa fa-chevron-down float-left p-q"></i>History &amp; Messages
                </span>
            </div>
            <div class="card-block">
                <ul class="nav nav-tabs text-nowrap" role="tablist">
                    <li class="nav-item" v-if="typeof historyItems !== 'undefined' && historyItems.length > 0">
                        <a class="nav-link active" data-toggle="tab" href="#recent" role="tab">
                            <i class="fa fa-history"></i>
                            {{ typeof historyItems === 'undefined' ? 0 : historyItems.length }}
                        </a>
                    </li>
                    <!--<li class="nav-item">
                        <a :class="((typeof historyItems !== 'undefined' && historyItems.length > 0) ? '' : 'active ') + 'nav-link'"
                           data-toggle="tab" href="#messages" role="tab">
                            <i class="icon-envelope-letter"></i>
                            <span class="label label-success item-count">{ {user.messageCount}}</span>
                        </a>
                    </li>-->
                    <li class="nav-item">
                        <a :class="((typeof historyItems !== 'undefined' && historyItems.length > 0) ? '' : 'active ') + 'nav-link'"
                           data-toggle="tab" href="#favorites" role="tab">
                            <i class="fa fa-star favorite"></i>
                            {{ favoritesCount }}
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-toggle="tab" href="#notifications" role="tab">
                            <i class="icon-bell"></i>
                            {{ notificationCount }}
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-toggle="tab" href="#shoppingCart" role="tab">
                            <i class="fa fa-shopping-cart"></i>
                            {{ cartCount }}
                        </a>
                    </li>
                </ul>
                <div class="tab-content">
                    <div v-if="typeof historyItems !== 'undefined' && historyItems.length > 0"
                         class="tab-pane p-1 active" id="recent" role="tabpanel" style="overflow-y:auto">
                        <div class="row" v-for="type in historyItemTypes()">
                            <div class="col-12">
                                <div class="header">
                                    <strong>Recent {{type.title}}</strong>
                                </div>
                                <div>
                                    <div v-for="item in orderBy(getHistoryItemsByType(type.type), 'timeStamp', -1)">
                                        <div class="message">
                                            <router-link class="dropdown-item" :to="item.route">
                                                <div>
                                                    <small class="text-muted">{{item.subject}}</small>
                                                    <small class="text-muted float-right mt-q">
                                                        {{item.timeStamp | localeDateOrTimeToday}}
                                                    </small>
                                                </div>
                                                <div :class="(item.showWarning ? 'text-warning ' : '') + 'text-truncate font-weight-bold'">
                                                    {{item.headline}}
                                                </div>
                                                <div class="text-muted">{{item.content | truncate}}</div>
                                            </router-link>
                                        </div>
                                        <hr />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--<div :class="((typeof historyItems === 'undefined' || historyItems.length < 1) ? 'active ' : '') + 'tab-pane p-1'" id="messages" role="tabpanel">
                        <div class="header">
                            <strong>You have { { user.messageCount }} message(s)</strong>
                        </div>
                        <div v-if="user.hasMessages">
                            <div v-for="message in user.customData.messages">
                                <div class="message">
                                    <router-link exact class="dropdown-item" :to="{name: 'Mailbox', params: {type: 'messages'}}">
                                        <div>
                                            <small class="text-muted">{ {message.from}}</small>
                                            <small class="text-muted float-right mt-q">
                                                { {message.timeStamp | localeDateOrTimeToday}}
                                            </small>
                                        </div>
                                        <div class="text-truncate font-weight-bold">{ {message.subject}}</div>
                                        <div class="text-muted">{ {message.text | truncate}}</div>
                                    </router-link>
                                </div>
                                <hr />
                            </div>
                            <a href="#" class="dropdown-item text-center">
                                <strong><router-link exact :to="{name: 'Mailbox', params: {type: 'messages'}}">View all messages</router-link></strong>
                            </a>
                        </div>
                    </div>-->
                    <div :class="((typeof historyItems === 'undefined' || historyItems.length < 1) ? 'active ' : '') + 'tab-pane p-1'"
                         id="favorites" role="tabpanel">
                        <div class="header">
                            <strong>You have {{ favoritesCount }} favorite item(s)</strong>
                        </div>
                        <div v-if="user.hasMessages">
                            <div v-for="message in user.customData.messages">
                                <div class="message">
                                    <router-link exact class="dropdown-item" :to="{name: 'Mailbox', params: {type: 'messages'}}">
                                        <div>
                                            <small class="text-muted">TODO: Favorite Title</small>
                                            <small class="text-muted float-right mt-q">
                                                TODO: Favorite headline
                                            </small>
                                        </div>
                                        <div class="text-truncate font-weight-bold">TODO: Favorite more information</div>
                                        <div class="text-muted">{{'TODO: Favorite more information' | truncate}}</div>
                                    </router-link>
                                </div>
                                <hr />
                            </div>
                            <a href="#" class="dropdown-item text-center">
                                <strong><router-link exact :to="{name: 'Mailbox', params: {type: 'messages'}}">View all messages</router-link></strong>
                            </a>
                        </div>
                    </div>
                    <div class="tab-pane p-1" id="notifications" role="tabpanel">
                        <div class="header"><strong>You have {{ notificationCount }} notification(s)</strong></div>
                        <div v-if="user.hasNotifications">
                            <div v-for="notification in user.customData.notifications">
                                <div class="message">
                                    <router-link exact class="dropdown-item" :to="{name: 'Mailbox', params: {type: 'notifications'}}">
                                        <div>
                                            <small class="text-muted">{{notification.from}}</small>
                                            <small class="text-muted float-right mt-q">
                                                {{notification.timeStamp | localeDateOrTimeToday}}
                                            </small>
                                        </div>
                                        <div class="text-truncate font-weight-bold">{{notification.subject}}</div>
                                        <div class="text-muted">{{notification.text | truncate}}</div>
                                    </router-link>
                                </div>
                                <hr />

                                <a href="#" class="dropdown-item text-center">
                                    <strong>
                                        <router-link exact :to="{name: 'Mailbox', params: {type: 'notifications'}}">
                                            View all notifications
                                        </router-link>
                                    </strong>
                                </a>

                            </div>
                        </div>
                    </div>
                    <div class="tab-pane p-1" id="shoppingCart" role="tabpanel">
                        <div class="header"><strong>You have {{ cartCount }} specimen(s) in your cart</strong></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script src="./SecondarySidebar.vue.js">

</script>