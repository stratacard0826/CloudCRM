<template>
    <footer class="app-footer">
        <div class="copyright">Copyright &copy; {{year}} <strong><a href="javascript:;">{{organization.name}}</a></strong>.  All rights reserved.</div>
        <div class="powered-by">Powered By Clinica Cloud Platform</div>
    </footer>
</template>

<script>
    import moment from 'moment';

    module.exports = {
        name: 'AppFooter',
        props: {
            organization: Object
        },
        computed:
            {
                year: function()
                {
                    return moment().format('YYYY');
                },
            }
    };
</script>