const DefinePlugin = require('webpack').DefinePlugin;

module.exports = {
   lintOnSave: false,
   configureWebpack: {
       plugins: [
           new DefinePlugin({
               PRODUCTION: JSON.stringify(process.env.NODE_ENV === 'production')
           })
       ]
   }
}
