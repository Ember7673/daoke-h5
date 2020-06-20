// const CompressionPlugin = require('compression-webpack-plugin');
// const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;
const { publicPath, outputDir, assetsDir, title } = require('./setting');
const path = require('path');
const resolve = (dir) => {
  return path.resolve(__dirname, `./${ dir }`);
};

module.exports = {
  lintOnSave: process.env.NODE_ENV === 'development',
  //是否开启sourceMap
  // productionSourceMap: process.env.NODE_ENV === 'production',
  productionSourceMap: false,
  //生产环境二级路径
  publicPath: publicPath,
  //生产环境构建文件目录
  outputDir: outputDir,
  //静态资源放置目录
  assetsDir: assetsDir,
  //如果cup内核大于1核的时候开启babel多核编译
  parallel: require('os').cpus().length > 1,
  //开发服务器设置
  devServer: {
    //开发环境host(类型:string)
    host: process.env.VUE_APP_HOST,
    //开发环境port(类型:number)
    // port: process.env.VUE_APP_PORT,
    port: '60010',
    //对外访问地址，需配置nginx(类型:string)
    //de: process.env.VUE_APP_PUBLIC_URL,
    //是否开启host检测(类型:boolean)
    //disableHostCheck: true,
    //启动时是否打开默认浏览器(类型:boolean)
    open: true,
    proxy: {
      '/api/': {
        target: 'http://193.112.240.150:60010',
        changeOrigin: true
      }
    }
  },
  //alias等配置
  configureWebpack: {
    name: title || '稻壳汇',
    resolve: {
      alias: {
        '@styles': resolve('src/assets/styles'),
        '@views': resolve('src/views'),
        '@api': resolve('src/api'),
        '@core_components': resolve('src/core/components'),
        '@register': resolve('src/core/register'),
        '@core_tools': resolve('src/core/tools')
      }
    }
  },
  //webpack相关配置
  chainWebpack: config => {
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/svg'))
      .end();

    config.module
      .rule('svgIcon')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/svg'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end();

    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhiteSpace = false;
        return options;
      })
      .end();

    // if (process.env.NODE_ENV === 'production') {
    //     config.plugin('compressionPlugin')
    //     .use(new CompressionPlugin({
    //         filename: '[path].gz[query]',
    //         algorithm: 'gzip',
    //         test: productionGzipExtensions,
    //         threshold: 10240,
    //         minRatio: 0.8,
    //         deleteOriginalAssets: true
    //     }));
    // }
  }
};