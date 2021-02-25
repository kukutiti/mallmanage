// module.exports={
//     publicPath:'/',
//     devServer:{
//         proxy:{
//             '/api':{
//                 target:'http://127.0.0.1:8888',
//                 changeOrign:true,
//                 pathRewrite:{
//                     '^/api':''
//                 }
//             }
//         }
//     }
// }

module.exports = {
    chainWebpack: config => {
        // 生产环境
        config.when(process.env.NODE_ENV === 'production', config => {
            // .entry() 得到默认打包入口 
            // .clear() 清空默认打包入口
            // .add()   添加自己的打包入口
            config.entry('app').clear().add('./src/main-prod.js')

            // 配置externals：解决import打包都放在一起，导致单文件过大的问题。
            config.set('externals', {
                vue: 'Vue',
                'vue-router': 'VueRouter',
                axios: 'axios',
                lodash: '_',
                echarts: 'echarts',
                nprogress: 'NProgress',
                'vue-quill-editor': 'VueQuillEditor'
            })

            // 通过isProd, public/index.html中用三元表达式动态获取标题
            config.plugin('html').tap(args => {
                args[0].isProd = true
                return args
            })
        })

        // 开发环境
        config.when(process.env.NODE_ENV === 'development', config => {
            // .entry() 得到默认打包入口 
            // .clear() 清空默认打包入口
            // .add()   添加自己的打包入口
            config.entry('app').clear().add('./src/main-dev.js')

            // 配置externals：解决import打包都放在一起，导致单文件过大的问题。
            config.set('externals', {
                vue: 'Vue',
                'vue-router': 'VueRouter',
                axios: 'axios',
                lodash: '_',
                echarts: 'echarts',
                nprogress: 'NProgress',
                'vue-quill-editor': 'VueQuillEditor'
            })

             
            config.plugin('html').tap(args => {
                args[0].isProd = false
                return args
            })
        })
    }
}