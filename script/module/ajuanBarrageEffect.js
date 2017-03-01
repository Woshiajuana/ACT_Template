/**
 * 原生js弹幕效果
 * Created by 2144 on 2016/10/11.
 * zhigang.chen@owulia.com
 * 简介：本js效果模仿视频弹幕效果，从右到左运行弹幕，
 * 字母大小可随机，颜色可随机，速度可随机，支持可重复运行弹幕，
 * 支持弹幕出现的最多条目数，支持主流浏览器，支持require模块化
 * 默认支持jQuery动画，运动效果更流畅,无jQuery动画，将使用内置滚动动画
 * 使用示例：
 *  ajuanBarrageEffect({
 *      mainEleBox:conEle,//DOM对象，弹幕盒子，如果没有此参数，则不运行
 *      inputEle:inputEle,//DOM对象，发送输入框，如果不传入，则没有内置的发送弹幕效果，需使用ajuanBarrageEffect对象.addItemEle(txt)另行定制
 *      subEleBtn:subEle,//DOM对象，发表弹幕的按钮，如果不传入，则没有内置的发送弹幕效果，
 *      但可以使用方法ajuanBarrageEffect对象.addItemEle(txt)；
 *      sleepArr：[5000,10000],//弹幕运行速度取值范围，默认随机在5000到10000之内，单位ms
 *      fontSizeArr:[12,36],//弹幕字体大小取值范围，默认随机在12到36之内，单位px
 *      itemTagName:'span',//弹幕元素标签名，默认是span元素
 *      isRepeat:true,//弹幕是否循环重复滚动，默认循环
 *      maxItem:8,//弹幕在屏幕上最多出现的条数，默认是8条
 *      fontSizeColorArrOrIsRandom:true,//弹幕的字体颜色，默认是true,随机颜色，也可以定制颜色数组，例如['#333','#222']
 *      interval:200//弹幕与弹幕之间的时间间隔，默认为200，单位ms
 *  });
 * 注意事项：使用本插件时，css样式，弹幕元素需设置为绝对定位，初始化位置{left:父元素弹幕盒子的宽度}，
 * 弹幕盒子需设置相对定位且超出隐藏，本弹幕js没有隐藏显示弹幕的功能，如果需要，请把弹窗盒子单独设置成一个独立的元素
 * 然后控制它即可
 */
;(function (win,doc,$,undefined) {

    var options,
        DEFAULT = {
            fontSizeArr:[12,36],
            fontSizeColorArrOrIsRandom:true,
            interval:200,
            itemTagName:'span',
            sleepArr:[5000,10000],
            maxItem:10,
            isRepeat:false
        },
        packMove = (function(){
            var getStyle = function(el, style){
                if(/msie/i.test(navigator.userAgent)){
                    style = style.replace(/\-(\w)/g, function(all, letter){
                        return letter.toUpperCase();
                    });
                    var value = el.currentStyle[style];
                    (value == "auto")&&(value = "0px" );
                    return value;
                }else{
                    return document.defaultView.getComputedStyle(el,null).getPropertyValue(style);
                }
            };
            var tween = {
                easeInQuad: function(pos){
                    return Math.pow(pos, 2);
                },

                easeOutQuad: function(pos){
                    return -(Math.pow((pos-1), 2) -1);
                },

                easeInOutQuad: function(pos){
                    if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,2);
                    return -0.5 * ((pos-=2)*pos - 2);
                },

                easeInCubic: function(pos){
                    return Math.pow(pos, 3);
                },

                easeOutCubic: function(pos){
                    return (Math.pow((pos-1), 3) +1);
                },

                easeInOutCubic: function(pos){
                    if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,3);
                    return 0.5 * (Math.pow((pos-2),3) + 2);
                },

                easeInQuart: function(pos){
                    return Math.pow(pos, 4);
                },

                easeOutQuart: function(pos){
                    return -(Math.pow((pos-1), 4) -1)
                },

                easeInOutQuart: function(pos){
                    if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,4);
                    return -0.5 * ((pos-=2)*Math.pow(pos,3) - 2);
                },

                easeInQuint: function(pos){
                    return Math.pow(pos, 5);
                },

                easeOutQuint: function(pos){
                    return (Math.pow((pos-1), 5) +1);
                },

                easeInOutQuint: function(pos){
                    if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,5);
                    return 0.5 * (Math.pow((pos-2),5) + 2);
                },

                easeInSine: function(pos){
                    return -Math.cos(pos * (Math.PI/2)) + 1;
                },

                easeOutSine: function(pos){
                    return Math.sin(pos * (Math.PI/2));
                },

                easeInOutSine: function(pos){
                    return (-.5 * (Math.cos(Math.PI*pos) -1));
                },

                easeInExpo: function(pos){
                    return (pos==0) ? 0 : Math.pow(2, 10 * (pos - 1));
                },

                easeOutExpo: function(pos){
                    return (pos==1) ? 1 : -Math.pow(2, -10 * pos) + 1;
                },

                easeInOutExpo: function(pos){
                    if(pos==0) return 0;
                    if(pos==1) return 1;
                    if((pos/=0.5) < 1) return 0.5 * Math.pow(2,10 * (pos-1));
                    return 0.5 * (-Math.pow(2, -10 * --pos) + 2);
                },

                easeInCirc: function(pos){
                    return -(Math.sqrt(1 - (pos*pos)) - 1);
                },

                easeOutCirc: function(pos){
                    return Math.sqrt(1 - Math.pow((pos-1), 2))
                },

                easeInOutCirc: function(pos){
                    if((pos/=0.5) < 1) return -0.5 * (Math.sqrt(1 - pos*pos) - 1);
                    return 0.5 * (Math.sqrt(1 - (pos-=2)*pos) + 1);
                },

                easeOutBounce: function(pos){
                    if ((pos) < (1/2.75)) {
                        return (7.5625*pos*pos);
                    } else if (pos < (2/2.75)) {
                        return (7.5625*(pos-=(1.5/2.75))*pos + .75);
                    } else if (pos < (2.5/2.75)) {
                        return (7.5625*(pos-=(2.25/2.75))*pos + .9375);
                    } else {
                        return (7.5625*(pos-=(2.625/2.75))*pos + .984375);
                    }
                },

                easeInBack: function(pos){
                    var s = 1.70158;
                    return (pos)*pos*((s+1)*pos - s);
                },

                easeOutBack: function(pos){
                    var s = 1.70158;
                    return (pos=pos-1)*pos*((s+1)*pos + s) + 1;
                },

                easeInOutBack: function(pos){
                    var s = 1.70158;
                    if((pos/=0.5) < 1) return 0.5*(pos*pos*(((s*=(1.525))+1)*pos -s));
                    return 0.5*((pos-=2)*pos*(((s*=(1.525))+1)*pos +s) +2);
                },

                elastic: function(pos) {
                    return -1 * Math.pow(4,-8*pos) * Math.sin((pos*6-1)*(2*Math.PI)/2) + 1;
                },

                swingFromTo: function(pos) {
                    var s = 1.70158;
                    return ((pos/=0.5) < 1) ? 0.5*(pos*pos*(((s*=(1.525))+1)*pos - s)) :
                    0.5*((pos-=2)*pos*(((s*=(1.525))+1)*pos + s) + 2);
                },

                swingFrom: function(pos) {
                    var s = 1.70158;
                    return pos*pos*((s+1)*pos - s);
                },

                swingTo: function(pos) {
                    var s = 1.70158;
                    return (pos-=1)*pos*((s+1)*pos + s) + 1;
                },

                bounce: function(pos) {
                    if (pos < (1/2.75)) {
                        return (7.5625*pos*pos);
                    } else if (pos < (2/2.75)) {
                        return (7.5625*(pos-=(1.5/2.75))*pos + .75);
                    } else if (pos < (2.5/2.75)) {
                        return (7.5625*(pos-=(2.25/2.75))*pos + .9375);
                    } else {
                        return (7.5625*(pos-=(2.625/2.75))*pos + .984375);
                    }
                },

                bouncePast: function(pos) {
                    if (pos < (1/2.75)) {
                        return (7.5625*pos*pos);
                    } else if (pos < (2/2.75)) {
                        return 2 - (7.5625*(pos-=(1.5/2.75))*pos + .75);
                    } else if (pos < (2.5/2.75)) {
                        return 2 - (7.5625*(pos-=(2.25/2.75))*pos + .9375);
                    } else {
                        return 2 - (7.5625*(pos-=(2.625/2.75))*pos + .984375);
                    }
                },

                easeFromTo: function(pos) {
                    if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,4);
                    return -0.5 * ((pos-=2)*Math.pow(pos,3) - 2);
                },

                easeFrom: function(pos) {
                    return Math.pow(pos,4);
                },

                easeTo: function(pos) {
                    return Math.pow(pos,0.25);
                },

                linear:  function(pos) {
                    return pos;
                },

                sinusoidal: function(pos) {
                    return (-Math.cos(pos*Math.PI)/2) + 0.5;
                },

                reverse: function(pos) {
                    return 1 - pos;
                },

                mirror: function(pos, transition) {
                    transition = transition || tween.sinusoidal;
                    if(pos<0.5)
                        return transition(pos*2);
                    else
                        return transition(1-(pos-0.5)*2);
                },

                flicker: function(pos) {
                    var pos = pos + (Math.random()-0.5)/5;
                    return tween.sinusoidal(pos < 0 ? 0 : pos > 1 ? 1 : pos);
                },

                wobble: function(pos) {
                    return (-Math.cos(pos*Math.PI*(9*pos))/2) + 0.5;
                },

                pulse: function(pos, pulses) {
                    return (-Math.cos((pos*((pulses||5)-.5)*2)*Math.PI)/2) + .5;
                },

                blink: function(pos, blinks) {
                    return Math.round(pos*(blinks||5)) % 2;
                },

                spring: function(pos) {
                    return 1 - (Math.cos(pos * 4.5 * Math.PI) * Math.exp(-pos * 6));
                },

                none: function(pos){
                    return 0;
                },

                full: function(pos){
                    return 1;
                }
            };
            function move(elem,json,options,callback){
                options = options || {};
                options.duration = options.duration || 2000;
                options.ease = options.ease || tween.linear;

                var start = {},distance = {};
                for(var atrr in json){
                    if(atrr == "opacity"){
                        start[atrr] = parseInt(100 * getStyle(elem, "opacity"));
                    }else{
                        start[atrr] = parseInt(getStyle(elem, atrr));
                    }
                    distance[atrr] = json[atrr] - start[atrr];
                    var speed = (json[atrr] - start[atrr])/options.duration;
                    speed=speed>0?Math.ceil(speed):Math.floor(speed);
                    var startTime = new Date().getTime();
                    (function(atrr){
                        setTimeout(function(){
                            var newTime = new Date().getTime();
                            var easetime = (newTime - startTime)/options.duration;
                            if (atrr == "opacity") {
                                elem.style.filter = "alpha(opacity:" + (start[atrr] + options.ease(easetime) * distance[atrr]) + ")";
                                elem.style.opacity = start[atrr]/100 + options.ease(easetime) * distance[atrr]/100;
                            }else{
                                elem.style[atrr] = Math.ceil(start[atrr] + options.ease(easetime) * distance[atrr]) + "px";
                            }
                            if(options.duration <= (newTime - startTime)){
                                elem.style[atrr] = json[atrr] + "px";
                                if(callback){
                                    callback();
                                }
                            }else{
                                setTimeout(arguments.callee,25);
                            }
                        },25)
                    })(atrr)
                }
            }

            return move;
        })(),
        query = {

            EventUtil : {

                add : function(ele,type,handler){

                    if (ele.addEventListener){

                        ele.addEventListener(type, handler, false);

                    }else if(ele.attachEvent){

                        ele.attachEvent('on' + type,handler);

                    }else{

                        ele["on" + type] = handler;

                    }
                },

                remove : function(ele,type,handler){

                    if(ele.removeEventListener){

                        ele.removeEventListener(type, handler, false);

                    }else if(ele.attachEvent){

                        ele.detachEvent('on' + type,handler);

                    }else{
                        ele["on" + type] = null;
                    }
                },

                getEvent : function(event){

                    return event ? event : window.event;

                },

                getTarget : function(event){

                    return event.target || event.srcElement;

                },

                preventDefault : function(event){

                    var e = query.EventUtil.getEvent(event);

                    if(event.preventDefault){

                        event.preventDefault();

                    }else{

                        event.returnValue = false;

                    }
                },

                stopPropagation: function(event){

                    if(event.stopPropagation){

                        event.stopPropagation();

                    }else{

                        event.cancelBubble = true;

                    }

                }
            },

            getTarget : function(event){

                var e = query.EventUtil.getEvent(event),

                    target = query.EventUtil.getTarget(e);

                return target;
            },

            addClass : function(node,classname){

                if(node.classList){

                    node.classList.add(classname);

                }else{

                    node.className += ' ' + classname;
                }
            },

            removeClass : function(node,classname){

                if(node.classList){

                    node.classList.remove(classname);

                }else{

                    node.className = node.className.replace(classname,'');
                }
            },

            getByClass : function(Classname,ele){

                var ele = ele ? ele : document;

                return ele.querySelectorAll ? ele.querySelectorAll('.'+Classname) : (function(ele){

                    var ele = ele.getElementsByTagName('*'),

                        Result = [],

                        re = new RegExp('\\b'+Classname+'\\b','i'),

                        i = 0;

                    for(;i < ele.length;i++){

                        if(re.test(ele[i].className)){

                            Result.push(ele[i]);

                        }
                    }

                    return Result;

                }(ele));

            },

            reduceDimension:function(arr){

                var reduced = [],

                    i = 0,

                    len = arr.length;

                for (; i < len; i++){

                    reduced = reduced.concat(arr[i]);

                }
                return reduced;
            },

            forEach : (function(){

                return  function(ary,callback){
                    if(typeof Array.prototype.forEach == "function"){

                        ary.forEach(function(value,index,a){
                            callback.call(ary,value,index,a);
                        });

                    }else{// 对于古董浏览器，如IE6-IE8
                        for(var k = 0, length = ary.length; k < length; k++) {
                            callback.call(ary,ary[k],k,ary);
                        }
                    }

                };
            })()

        };

    function ajuanBarrageEffect(opt){
        options = opt || {};
        this.mainEleBox = options.mainEleBox;//弹幕盒子
        this.inputEle = options.inputEle;//发送输入框
        this.subEleBtn = options.subEleBtn;//发表弹幕的按钮
        this.sleepArr = options.sleepArr || DEFAULT.sleepArr;//速度
        this.interval = options.interval || DEFAULT.interval;//弹幕运动的时间间隔时间间隔
        this.fontSizeArr = options.fontSizeArr || DEFAULT.fontSizeArr;//字体大小数组[minSize,maxSize]
        this.fontSizeColorArrOrIsRandom = options.fontSizeColorArrOrIsRandom || DEFAULT.fontSizeColorArrOrIsRandom;//字体颜色
        this.itemTagName = options.itemTagName || DEFAULT.itemTagName;//弹幕包裹的元素名称
        this.index = 0;//弹幕滚到的标记
        this.maxItem = options.maxItem || DEFAULT.maxItem;//弹幕盒子最多同时出现多少条弹幕
        this.barrageArr = [];//需要滚动的弹幕
        this.isRepeat = options.isRepeat || DEFAULT.isRepeat;//是否重复
        this.type = null;
    }

    ajuanBarrageEffect.prototype = {

        //初始化
        init: function () {
            if(!this.mainEleBox) return;
            if(this.subEleBtn && this.inputEle)this.addEvent();
            this.achieveEleData();
            this.operateItemEle();
            var that = this;
            setInterval(function () {
                that.scrollItemEle();
            },that.interval);
            return this;
        },
        
        //获取元素数据
        achieveEleData: function () {
            this.width = +(this.mainEleBox.offsetWidth);//获取滑过的宽
            this.height = +(this.mainEleBox.offsetHeight);//获取滑过的高
            this.itemArr = query.reduceDimension(this.mainEleBox.getElementsByTagName(this.itemTagName));//获取所有滚动的弹幕
        },

        //添加弹幕
        addItemEle: function (txt) {
            if(!txt) return;
            var that = this,
                itemEle = doc.createElement(this.itemTagName),
                itemObj = {};
            this.mainEleBox.appendChild(itemEle);
            itemEle.innerHTML = txt;
            itemEle.style.fontSize = that.achieveFontSize();
            itemEle.style.color = that.achieveFontColor();
            itemEle.style.top = that.achieveItmeTop(itemEle);
            itemObj.item = itemEle;
            itemObj.dir = that.achieveItemDis(itemEle);
            itemObj.sleep = that.achieveItemSleep();
            itemObj.state = true;//运动状态
            that.insertArrItem(itemObj,that.index);
        },

        //数组中插入一个元素的方法
        insertArrItem: function (itemObj,index) {
            this.barrageArr.splice(index,0,itemObj);
        },

        //操作元素
        operateItemEle: function () {
            var that = this;
            query.forEach(this.itemArr,function (item) {
                var itemObj = {};
                item.style.fontSize = that.achieveFontSize();
                item.style.color = that.achieveFontColor();
                item.style.top = that.achieveItmeTop(item);
                itemObj.item = item;
                itemObj.dir = that.achieveItemDis(item);
                itemObj.sleep = that.achieveItemSleep();
                itemObj.state = true;//运动状态
                that.barrageArr.push(itemObj);
            });
        },

        //滚动弹幕
        scrollItemEle: function () {
            var that = this;
            //当需要滚动的弹幕对象为空时，什么都不做返回
            if(!that.barrageArr.length) return;
            //判断是否重复，重复且当滚动完了最后一个弹幕时，把滚动的位置初始化为0
            if(that.isRepeat && that.index >= that.barrageArr.length){
                that.index = 0;
            };
            //当屏幕上滚动的元素条数小于最大值的时候,且还有弹幕的时候，让弹幕去滚动
            if(that.index < this.barrageArr.length && that.maxItem > 0 ){
                var item = that.barrageArr[that.index];
                if($ && item.state){
                    item.state = false;
                    that.maxItem--;
                    $(item.item).animate({'left':'-' + item.dir},item.sleep,'linear', function () {
                        that.maxItem++;
                        item.state = true;
                        if(that.isRepeat) that.initItemObj(item.item);
                    });
                }else if(item.state){
                    item.state = false;
                    that.maxItem--;
                    packMove(item.item,{
                        'left':'-' + item.dir
                    },{duration:item.sleep}, function () {
                        that.maxItem++;
                        item.state = true;
                        if(that.isRepeat) that.initItemObj(item.item);
                    });
                }
                that.index++;
            }
        },

        //初始化弹幕对象
        initItemObj: function (item) {
            item.style.left = this.width + 'px';
        },

        //获取需要滚动的距离
        achieveItemDis: function (item) {
            return item.offsetWidth;
        },

        //获取随机的字体大小
        achieveFontSize: function () {
            return this.fontSizeArr[0] + Math.floor(Math.random() * this.fontSizeArr[1]) + 'px';
        },

        //随机获取字体颜色
        achieveFontColor: function () {
            if(typeof this.fontSizeColorArrOrIsRandom == 'object'){
                return this.fontSizeColorArrOrIsRandom[Math.floor(Math.random() * this.fontSizeColorArr.length)];
            }else{
                return '#' + (function (h) {
                        return new Array(7 - h.length).join("0") + h
                    })((Math.random() * 0x1000000 << 0).toString(16));
            }
        },

        //随机获取top值
        achieveItmeTop: function (item) {
            return Math.floor(Math.random() * (this.height - (+item.offsetHeight))) + 'px';
        },

        //获取随机的速度
        achieveItemSleep: function () {
            return this.sleepArr[0] + Math.floor(Math.random() * this.sleepArr[1]);
        },

        //绑定事件
        addEvent: function () {
            var that = this,
                clickEvent = function (event) {
                    var target = query.getTarget(event);
                    if(target == that.subEleBtn){
                        if(that.inputEle.value)
                        that.addItemEle(that.inputEle.value);
                        that.inputEle.value = '';
                        return;
                    }
                };
            query.EventUtil.add(doc.body,'click',clickEvent);
        }
        
    };

    if(typeof define === 'function' && define.amd){
        define('ajuanBarrageEffect',[],function(){return ajuanBarrageEffect});
    }else{
        window.ajuanBarrageEffect = function (options) {
            return new ajuanBarrageEffect(options).init();
        };
    }

}(this,document));
