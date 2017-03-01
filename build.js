/**
 * Created by 2144 on 2017/2/4.
 * 在命令行中运行 node r.js -o build.js
 */
({
    baseUrl: 'dist/js',
    paths:{
        jquery:'../lib/zepto/zepto.min',
        backbone:'../lib/backbone/backbone-min',
        underscore:'../lib/underscore/underscore-min',
    },
    shim:{
        jquery:{
            exports:'$'
        },
        backbone:{
            deps:['underscore','jquery']
        }
    },
    name: 'main',// 模块入口
    optimize: 'none',//是否压缩 默认是压缩的，去掉不要就是压缩
    out: "dist/js/main-built.js",// 输出压缩后的文件位置
})
