<template>
    <section class="content">
        <div class="center-block">
            <div class="col-auto">
                <div class="card" v-if="user.hasMessages">
                    <div class="card-header">
                        Mailbox {{user.fullName}}
                    </div>
                    <div class="card-block">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>From</th>
                                    <th>Subject</th>
                                    <th>Message</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="message in user.customData.messages">
                                    <td>{{message.timeStamp | prettyDate}}</td>
                                    <td>{{message.from}}</td>
                                    <td>{{message.subject}}</td>
                                    <td>{{message.text}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
                <div v-else class="card card-inverse card-info text-center">
                    <div class="card-block">
                        No messages.
                        <footer>TODO:  Figure out why this only shows messages when opened by router link from main.  Hint: use vue tools in chrome, vuex shows an uncommitted getUser....</footer>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
    import { mapGetters, mapActions } from 'vuex';
    //import store from '../store/index.js';
    module.exports = {
        name: 'Mailbox',
        //store: function () {
        //    return this.$parent.$parent.$store;
        //},
        //state: function () {
        //    return this.store.state;
        //},
        computed: {
            ...mapGetters('user', ['user'])
    },
    //created: function() {
    //    store.dispatch('user/getUser')
    //},
    };
</script>

<style>
</style>
