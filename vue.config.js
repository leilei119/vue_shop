module.exports = {
    lintOnSave: false,//关闭eslint
    productionSourceMap: false,//打包时，dist中不生成.map文件 它只是用来调试代码的
    chainWebpack:config=>{
        // when判断当前处于什么编译模式：production就执行回调函数  entry得到默认打包入口文件，再清空入口文件，再追加自己的打包入口文件

        // 发布上线模式
        config.when(process.env.NODE_ENV === 'production',config=>{
            config.entry('app').clear().add('./src/main-prod.js')

            // externals加载外部CDN资源：只在发布模式使用
            config.set('externals',{
                vue:'Vue',
                'vue-router':'VueRouter',
                axios:'axios',
                lodash:'_',
                echarts:'echarts',
                nprogress:'NProgress',
                // 'vue-quill-editor': 'VueQuillEditor'
            })
            // 找到html插件   新增一个参数isProd 发布模式为true
            config.plugin('html').tap(args=>{
                args[0].isProd = true
                return args
            })
        })

        // 开发模式
        config.when(process.env.NODE_ENV === 'development',config=>{
            config.entry('app').clear().add('./src/main-dev.js')

            // 找到html插件   新增一个参数isProd 开发模式为false
            config.plugin('html').tap(args=>{
                args[0].isProd = false
                return args
            })
        })

        // 压缩图片
        config.module.rule('img').test(/\.(png|jpe?g|gif)(\?.*)?$/).use('image-webpack-loader')
        .loader('image-webpack-loader').options({
             bypassOnDebug:true
         }).end() 
    }
}