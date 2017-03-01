/**
 * Created by 2144 on 2016/12/30.
 * author：zhigang.chen@owulia.com
 * 导航侧边栏控制模块
 */
define(['DEFAULT','Ajuan-1.0'], function (DEFAULT,_a) {
    var doc = document,
        clickEvent,
        options,
        DEFAULT = DEFAULT.NAV_DEFAULT;
    function NavModule(opt){
        options = opt || {};
        this.timer ='';
        this.anchorArr = options.anchorArr || DEFAULT.anchorArr || [];
    }
    NavModule.prototype = {
        //初始化
        init: function(){
            if(!this.anchorArr.length) return this;
            addEvent(this);
            return this;
        },
        unwork: function (eleIdName) {
            var that = this;
            if(eleIdName){
                _a.each(this.anchorArr,function(index,item){
                    if(item.eleIdName == eleIdName){
                        removeArr(that.anchorArr,index);
                        return false;
                    }
                });
                addEvent(this);
            }else{
                _a(doc.body).unbind('click',clickEvent);
                clickEvent = '';
            }
            return this;
        },
        //增加锚点控制器
        work: function(eleIdName,idName,duration,dir){
            duration = duration || 500;
            dir = dir || 0;
            var anObj = {
                eleIdName:eleIdName,
                id:idName,
                dur:duration,
                dir:dir
            };
            this.anchorArr.push(anObj);
            return this;
        }
    };
    function removeArr(arr,obj){
        for(var i =0;i <arr.length;i++){
            var temp = arr[i];
            if(!isNaN(obj)){
                temp=i;
            }
            if(temp == obj){
                for(var j = i;j <arr.length;j++){
                    arr[j]=arr[j+1];
                }
                arr.length = arr.length-1;
            }
        }
    }
    function addEvent(that){
        if(clickEvent) _a(doc.body).unbind('click',clickEvent);
        clickEvent = function (event) {
            var target = _a.target(event);
            _a.each(that.anchorArr, function (index, item) {
                if(target.id == item.eleIdName){
                    anchorPosition(that,item.id,item.dur,item.dir);
                    return;
                }
            })
        };
        _a(doc.body).on('click',clickEvent);
    }
    function anchorPosition(that,idName,duration,dir){
        if(typeof idName != 'object') { idName = doc.getElementById(idName); }
        if(!idName) return;
        var z = that;
        z.el = idName;
        z.p = getPos(idName,dir);
        z.s = getScroll();
        z.clear = function(){window.clearInterval(z.timer);z.timer=null};
        z.clear();
        z.t=(new Date).getTime();
        z.step = function(){
            var t = (new Date).getTime();
            var p = (t - z.t) / duration;
            if (t >= duration + z.t) {
                z.clear();
                window.setTimeout(function(){z.scroll(z.p.y, z.p.x)},13);
            } else {
                var st = ((-Math.cos(p*Math.PI)/2) + 0.5) * (z.p.y-z.s.t) + z.s.t;
                var sl = ((-Math.cos(p*Math.PI)/2) + 0.5) * (z.p.x-z.s.l) + z.s.l;
                z.scroll(st, sl);
            }
        };
        z.scroll = function (t, l){window.scrollTo(l, t)};
        z.timer = window.setInterval(function(){z.step();},13);
    }
    function intval(v) {
        v = parseInt(v);
        return isNaN(v) ? 0 : v;
    }
    //获取元素信息
    function getPos(e,dir) {
        var l = 0;
        var t  = 0;
        var dir = dir || 0;
        var w = intval(e.style.width);
        var h = intval(e.style.height);
        var wb = e.offsetWidth;
        var hb = e.offsetHeight;
        while (e.offsetParent){
            l += e.offsetLeft + (e.currentStyle?intval(e.currentStyle.borderLeftWidth):0);
            t += e.offsetTop  + (e.currentStyle?intval(e.currentStyle.borderTopWidth):0);
            e = e.offsetParent;
        }
        l += e.offsetLeft + (e.currentStyle?intval(e.currentStyle.borderLeftWidth):0);
        t  += e.offsetTop  + (e.currentStyle?intval(e.currentStyle.borderTopWidth):0) - dir;
        return {x:l, y:t, w:w, h:h, wb:wb, hb:hb};
    }
    //获取滚动条信息
    function getScroll() {
        var t, l, w, h;
        if (document.documentElement && document.documentElement.scrollTop) {
            t = document.documentElement.scrollTop;
            l = document.documentElement.scrollLeft;
            w = document.documentElement.scrollWidth;
            h = document.documentElement.scrollHeight;
        } else if (document.body) {
            t = document.body.scrollTop;
            l = document.body.scrollLeft;
            w = document.body.scrollWidth;
            h = document.body.scrollHeight;
        }
        return { t: t, l: l, w: w, h: h };
    }
    return NavModule;
});