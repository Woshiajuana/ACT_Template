/**
 * 弹幕模块
 * Created by 2144 on 2016/10/13.
 * zhigang.chen@owulia.com
 */
define(['queryModule','ajuanBarrageEffect'], function (que,barrage) {

    var doc = document,
        options,
        query = que.queryModule,
        ajuanBarrageEffect = barrage;

    function barrageModule(opt){
        options = opt || {};
        this.mainEleBox = options.mainEleBox;
        this.subEleBtn = options.subEleBtn;
        this.inputEle = options.inputEle;
    }

    barrageModule.prototype = {
        //初始化
        init: function () {
            this.ajuanBarrageEffect = new ajuanBarrageEffect({
                mainEleBox:this.mainEleBox
            });
        },
        //监听事件
        addEvent: function () {
            var that = this,
                clickEvent = function (event) {
                    var target = query.getTarget(event);
                    if(target == that.subEleBtn){
                        if(!that.inputEle.value.replace(/(^\s*)|(\s*$)/g,'')){return;}
                        that.ajuanBarrageEffect.addItemEle(that.inputEle.value);
                        return;
                    }
                };
            query.EventUtil.add(doc.body,'click',clickEvent);
        }
    };

    return {
        barrageModule:barrageModule
    }

});