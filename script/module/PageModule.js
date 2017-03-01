/**
 * Created by 2144 on 2016/12/21.
 * author：zhigang.chen@owulia.com
 * 页面模块
 */
define(['DEFAULT','Ajuan-1.0'], function (DEFAULT,_a) {
    var options,
        DEFAULT = DEFAULT.PAGE_DEFAULT;
    function PageModule(opt){
        options = opt || {};
        this.url = options.url || DEFAULT.url;
        this.obj = options.obj || DEFAULT.obj || {};
        this.arrFun = [];
    }
    PageModule.prototype = {
        //初始化
        init: function (funName) {
            //判断传递进来的参数
            if(!funName){
                //没有参数，循环执行初始化页面数据
                for(var i in this.arrFun){
                    if(this.arrFun.hasOwnProperty(i))
                        this.arrFun[i].call(this);
                }
            }else if(funName && typeof funName === 'string'){
                if(this.arrFun[funName] && typeof this.arrFun[funName] === 'function')
                    this.arrFun[funName]();
            }else if(funName && typeof funName === 'function'){
                if(!this.url) return this;
                this.achieveData(this.url,this.obj,funName);
            }
            return this;
        },
        work: function (funName,fun) {
            if(!fun) return this;
            this.arrFun[funName]  = fun;
            return this;
        },
        //可初始化数据
        achieveData: function(url,obj,callback){
            if(!url) return this;
            IO.jsonp( url, obj, function (data) {
                if(callback) callback(data);
            });
            return this;
        }
    };
    return PageModule;
});