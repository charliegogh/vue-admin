const path = require('path')
const webpack = require('webpack')
const isPro = process.env.NODE_ENV === 'production' // 生产环境
const CompressionWebpackPlugin = require('compression-webpack-plugin') // 打包压缩
// 访问本地文件目录
const resolve = dir => {
  return path.join(__dirname, dir)
}
/* cdn */
const cdn = {
  // css: ['https://unpkg.com/element-ui/lib/theme-chalk/index.css'],
  css: [''],
  js: [
    './js/vue.min.js',
    './js/vue-router.min.js',
    './js/vuex.min.js',
    './js/axios.min.js',
    './js/lodash.min.js'
  ]
}
module.exports = {
  /* 代理 端口 https等相关设置 */
  devServer: {
    open: true, // 自动打开客户端
    port: 3106, // 指定启动端口
    https: false, //
    hotOnly: false,
    disableHostCheck: true,
    proxy: {
      '/api': {
        open: false, // 自动打开浏览器
        ws: false,
        target: 'http://47.93.4.29:88',
        changeOrigin: true, //
        pathRewrite: { '^/api': '/' } // 代理重写
      },
      '/cnki': {
        open: false, // 自动打开浏览器
        ws: false,
        target: 'https://xfat.cnki.net',
        changeOrigin: true, //
        pathRewrite: { '^/cnki': '/' } // 代理重写
      }
    }
  },
  // 添加二级目录
  publicPath: './',
  outputDir: process.env.outputDir, // 打包输出的文件夹 默认是dist
  runtimeCompiler: false, // 是否使用包含运行时编译器的Vue核心的构建
  // 默认情况下 babel-loader 忽略其中的所有文件 node_modules
  transpileDependencies: [],
  // 生产环境 sourceMap
  productionSourceMap: !isPro,
  // eslint语法检查
  lintOnSave: false,
  // 构建时开启多进程处理 babel 编译
  parallel: require('os').cpus().length > 1,
  css: {
    // 是否开启支持 foo.module.css 样式
    modules: false,
    // 是否使用 css 分离插件 ExtractTextPlugin，采用独立样式文件载入，不采用 <style> 方式内联至 html 文件中
    // extract: true,
    // 是否构建样式地图，false 将提高构建速度
    sourceMap: false, // 关闭 否则热更新失效
    loaderOptions: {
      less: {
        javascriptEnabled: true
      },
      postcss: {
        plugins: [
          /* 浏览器兼容前缀 */
          require('autoprefixer')({
            overrideBrowserslist: [
              'Android 4.1',
              'iOS 7.1',
              'Chrome > 31',
              'ff > 31',
              'ie >= 8'
            ]
          })
        ]
      }
    }
  },
  pluginOptions: {
    // less全局混合吧
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, './src/styles/mixin.less')]
    }
  },
  /* webpack相关配置项 */
  chainWebpack: config => {
    /* 保留moment国内包 */
    config
      .plugin('ignore')
      .use(
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn$/)
      )

    /* 简化文件引入 */
    config.resolve.alias
      .set('@', resolve('src'))
      .set('_public', resolve('public'))
      .set('_utils', resolve('src/utils'))
      .set('_com', resolve('src/components'))
      .set('_assets', resolve('src/assets'))
    // .set('@ant-design/icons/lib/dist$', resolve('src/core/icons.js'))  // 拆掉antd的icon包

    /* 文件拆分 */
    if (isPro) {
      config.plugin('html').tap(args => {
        args[0].cdn = cdn
        return args
      })
    }
    // 开启预加载 提高第一屏的速度
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])
    config.plugins.delete('prefetch')
    // set preserveWhitespace
    // config.module
    //   .rule('vue')
    //   .use('vue-loader')
    //   .loader('vue-loader')
    //   .tap(options => {
    //     options.compilerOptions.preserveWhitespace = true
    //     return options
    //   })
    //   .end()
    //
    config.when(process.env.NODE_ENV !== 'development', config => {
      // 让 js 加载方式支持 Async 或 defer
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/
          }
        ])
        .end()
      // 分割源码包
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial' // only package third parties that are initially dependent
            // chunks: function(chunk) {
            //   // 这里的name 可以参考在使用`webpack-ant-icon-loader`时指定的`chunkName`
            //   return chunk.name !== 'antd-icons'
            // }
          },
          antDesignVue: {
            name: 'ant-design-vue',
            priority: 20,
            test: /[\\/]node_modules[\\/]_?ant-design-vue(.*)/
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      })
      config.optimization.runtimeChunk('single')
    })
    return config
  },
  configureWebpack: config => {
    if (isPro) {
      /* webpack 避开打包项 只在开发环境使用 (此处名字与引入的cdn包名有关) */
      config.externals = {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        vuex: 'Vuex',
        axios: 'axios',
        lodash: '_'
        // moment: 'moment'
      }
      config.performance = {
        hints: 'warning',
        // 入口起点的最大体积
        maxEntrypointSize: 50000000,
        // 生成文件的最大体积
        maxAssetSize: 30000000,
        // 只给出 js 文件的性能提示
        assetFilter: function(assetFilename) {
          return assetFilename.endsWith('.js')
        }
      }
      return {
        plugins: [
          /* 开启打包压缩 */
          new CompressionWebpackPlugin({
            // 目标文件名称。[path] 被替换为原始文件的路径和 [query] 查询
            filename: '[path].gz[query]',
            // 使用 gzip 压缩
            algorithm: 'gzip',
            // 处理与此正则相匹配的所有文件
            test: new RegExp('\\.(js|css)$'),
            // 只处理大于此大小的文件
            threshold: 10240,
            // 最小压缩比达到 0.8 时才会被压缩
            minRatio: 0.8
          })
        ]
      }
    }
  }
}
