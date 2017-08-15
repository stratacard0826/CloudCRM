const path = require('path');
var webpack = require('webpack');

module.exports = {
    target: 'node',
    entry: {
        'bundle.server': [
        //'tether',
        //'bootstrap-loader',
        path.join(__dirname, 'VueApp/server.js')]
    },
    output: {
        libraryTarget: 'commonjs2',
        path: path.join(__dirname, 'wwwroot/dist'),
        filename: '[name].js',
    },
    module: {
        loaders: [
          {
              test: /\.vue$/,
              loader: 'vue-loader',
          },
          {
              test: /\.js$/,
              loader: 'babel-loader',
              include: __dirname,
              exclude: /node_modules/
          },
          {
              test: /\.json?$/,
              loader: 'json-loader'
          },
            {
                test: /\.async\.(html|css)$/,
                loaders: ['file-loader?name=[name].[hash].[ext]', 'extract-loader']
            },
            { test: /\.css$/, loader: 'to-string-loader!css-loader' },
            { test: /\.(png|jpg|jpeg|gif|svg)$/, loader: 'url-loader', query: { limit: 25000 } },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=10000&mimetype=application/font-woff"
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file-loader"
            },
        ]
    },
    //plugins: [
    //    new webpack.ProvidePlugin({
    //        $: "jquery",
    //        jQuery: "jquery",
    //        "window.jQuery": "jquery",
    //        Tether: "tether",
    //        "window.Tether": "tether",
    //        Tooltip: "exports-loader?Tooltip!bootstrap/js/dist/tooltip",
    //        Alert: "exports-loader?Alert!bootstrap/js/dist/alert",
    //        Button: "exports-loader?Button!bootstrap/js/dist/button",
    //        Carousel: "exports-loader?Carousel!bootstrap/js/dist/carousel",
    //        Collapse: "exports-loader?Collapse!bootstrap/js/dist/collapse",
    //        Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown",
    //        Modal: "exports-loader?Modal!bootstrap/js/dist/modal",
    //        Popover: "exports-loader?Popover!bootstrap/js/dist/popover",
    //        Scrollspy: "exports-loader?Scrollspy!bootstrap/js/dist/scrollspy",
    //        Tab: "exports-loader?Tab!bootstrap/js/dist/tab",
    //        Tooltip: "exports-loader?Tooltip!bootstrap/js/dist/tooltip",
    //        Util: "exports-loader?Util!bootstrap/js/dist/util",
    //    })
    //]
};
