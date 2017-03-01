/**
 * Created by 2144 on 2016/9/29.
 * author：zhigang.chen@owulia.com
 * 事件模块
 */
define(['DEFAULT','Ajuan-1.0','PopupModule'], function (DEFAULT,_a,PopupModule) {
    var doc = document,
        clickEvent,
        options,
        DEFAULT = DEFAULT.EVENT_DEFAULT;
    function EventModule(opt){
        options = opt || {};
        this.clickEleObjectArr = options.clickEleObjectArr || DEFAULT.clickEleObjectArr || [];
        this.userModule = options.userModule;
        this.pageModule = options.pageModule;
        this.popup = new PopupModule().init();
        this.type = false;
    }
    EventModule.prototype = {
        //初始化事件
        init: function () {
            if(!this.clickEleObjectArr.length) return this;
            addEvent(this);
            return this;
        },
        //做事情
        work: function (type,objOrCallack) {
            if(!type) return this;
            if((type && typeof type === 'object')
            || (type && typeof type === 'string' && objOrCallack && typeof objOrCallack === 'object')){
                var obj = typeof type === 'object' ? type : objOrCallack,
                    eleObj = {
                        className:obj.className || obj.id,
                        url:obj.url,
                        obj:obj.obj,
                        attrName:obj.attrName,
                        action:obj.action,
                        callback:obj.callback
                    };
                    type = typeof type === 'object' ? 'click' : type;
                if(type === 'click')
                    this.clickEleObjectArr.push(eleObj);
            }else if((type && typeof type === 'function')
            || (type && typeof type === 'string' && objOrCallack && typeof objOrCallack === 'function')){
                var that = this,
                    callback = typeof type === 'function' ? type : objOrCallack,
                    clickEvent = function (event) {
                        var target = _a.target(event);
                        callback.call(that,target);
                    };
                type = typeof type === 'function' ? 'click' : type;
                _a(doc.body).on(type,clickEvent);
            }
            return this;
        },
        //删除事件(此只能删除由 clickEleObjectArr 所绑定的事件，不能删除addEvent所绑定的事件)
        removeEvent: function (type) {
            var type  = type || 'click';
            removeEvent(type);
        },
        //用户签到的方法
        userSign: function (url, obj, callback) {
            var that = this;
            IO.jsonp(url,obj, function (data) {
                if(data.status == 0){
                    that.popup.pop({
                        type:'ts',
                        title:'温馨提示',
                        prompt:data.msg
                    });
                }else{
                    that.popup.pop({
                        type:'ts',
                        title:'温馨提示',
                        prompt:data.msg
                    });
                }
                if(callback) callback.call(that);
                that.type = false;
            });
        },
        //领取卡玛的方法
        achieveCard: function (url, obj, callback) {
            var that = this;
            IO.jsonp(url,obj, function (data) {
                if(data.status == 0){
                    that.popup.pop({
                        type:'km',
                        title:'温馨提示',
                        data: data
                    });
                }else{
                    that.popup.pop({
                        type:'ts',
                        title:'温馨提示',
                        prompt:data.msg
                    });
                }
                if(callback) callback.call(that);
                that.type = false;
            });
        },
        //查看记录的方法
        seeRecord: function (url, obj, callback) {
            var that = this;
            IO.jsonp(url,obj, function (data) {
                if(data.status == 0){
                    var data = data.data || data.card_list || [];
                    if(!data.length){
                        that.popup.pop({
                            type:'ts',
                            title:'温馨提示',
                            prompt:'您还没有奖品记录，赶快去领取吧~~~'
                        });
                        that.type = false;
                        return;
                    }
                    that.popup.pop({
                        type:'jl',
                        title:'温馨提示',
                        data:data
                    });
                }else{
                    that.popup.pop({
                        type:'ts',
                        title:'温馨提示',
                        prompt:data.msg
                    });
                }
                if(callback) callback.call(that);
                that.type = false;
            });
        }
    };
    //步骤选择
    function selectionStep(that,item,target){
        if(!that.userModule.actUserId){
            _jsiframeShow(0);
            return;
        }
        if(that.type) return;
        that.type = true;
        var obj = returnAttrObj(item,target);
        switch (item.action){
            //领取卡玛
            case 0:
                that.achieveCard(item.url,obj,item.callback);
                break;
            //查看记录
            case 1:
                that.seeRecord(item.url,obj,item.callback);
                break;
            //用户签到
            case 2:
                that.userSign(item.url,obj,item.callback);
                break;
        }
        return;
    }
    //删除事件
    function removeEvent(type){
        _a(doc.body).unbind(type,clickEvent);
    }
    //添加事件
    function addEvent(that){
        if(clickEvent) _a(doc.body).unbind('click',clickEvent);
        clickEvent = function (event) {
            var target = _a.target(event);
            _a.each(that.clickEleObjectArr, function (index,item) {
                if(item.className && target.className == item.className){
                    selectionStep(that,item,target);
                    return;
                }else if(item.idName && target.idName == item.idName){
                    selectionStep(that,item,target);
                    return;
                }
            });
        };
        if(that.clickEleObjectArr && that.clickEleObjectArr.length) _a(doc.body).on('click',clickEvent);
    }
    //返回参数
    function returnAttrObj(item,target) {
        var obj = item.obj || {};
        if(item.attrName){
            if(typeof item.attrName == 'object'){
                _a.each(item.attrName, function (index,it) {
                    obj[it] = target.getAttribute(it);
                });
            }else{
                obj[item.attrName] = target.getAttribute(item.attrName);
            }
        }
        return obj;
    }
    return EventModule;
});