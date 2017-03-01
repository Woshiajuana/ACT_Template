/**
 * Created by 2144 on 2016/12/26.
 * author：zhigang.chen@owulia.com
 * 信息滚动模块
 */
define(['DEFAULT','Ajuan-1.0'], function (DEFAULT,_a) {
    var options,
        DEFAULT = DEFAULT.INFO_SCROLL_DEFAULT;
    function InfoScrollModule(opt){
        options = opt || {};
        this.scrollArr = options.scrollArr || DEFAULT.scrollArr || [];
    }
    InfoScrollModule.prototype = {
        init: function () {
            if(!this.scrollArr.length) return this;
            _a.each(this.scrollArr, function (index, item) {
                achieveListData(item)
            });
            return this;
        },
        work: function (url,obj,divEle,callback) {
            if(!callback) return this;
            var scObj = {
                url:url,
                obj:obj,
                divEle:divEle,
                callback:callback
            };
            this.scrollArr.push(scObj);
            return this;
        }
    };
    function achieveListData(item){
        var dir = item.dir || 'up';
        IO.jsonp(item.url, item.obj, function (data) {
            if(!data.status || data.status == 0){
                var str = '';
                item.ulEle = item.divEle.find('ul')[0];
                if(item.callback) str = item.callback(data,str);
                item.ulEle.innerHTML = str;
                if(item.divEle[0].offsetHeight < item.ulEle.offsetHeight) marqueeStart(item.divEle[0],dir);
            }
        })
    }
    function marqueeStart(ele,t){
        var o = ele,
            n = _a(o).find('ul')[0],
            s = _a(o).find('ul')[1],
            marquee = function(obj,t){
                if("up" == t){
                    if (obj.s.offsetTop - obj.o.scrollTop <= 0){
                        obj.o.scrollTop -= obj.n.offsetHeight + 20;
                    }else{
                        var r = obj.o.scrollTop;
                        obj.o.scrollTop++;
                        obj.o.scrollTop == r && (obj.o.scrollTop = 1);
                    }
                }else{
                    obj.s.offsetWidth - obj.o.scrollLeft <= 0 ? obj.o.scrollLeft -= obj.n.offsetWidth : obj.o.scrollLeft++;
                }
            };
        s.innerHTML = n.innerHTML;
        var r = window.setInterval(function(){
            marquee({o:o,n:n,s:s},t);
        },30);
        o.onmouseover = function(){
            window.clearInterval(r);
        };
        o.onmouseout = function() {
            r = window.setInterval(function(){
                marquee({o:o,n:n,s:s},t);
            },30);
        };
    }
    return InfoScrollModule
});