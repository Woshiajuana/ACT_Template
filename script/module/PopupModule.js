/**
 * Created by 2144 on 2016/12/26.
 * author：zhigang.chen@owulia.com
 * 弹窗模块
 */

define(['DEFAULT','Ajuan-1.0'],function (DEFAULT,_a) {
    var doc = document,
        clickEvent,
        options,
        IE = _a.IETester(),
        DEFAULT = DEFAULT.POPUP_DEFAULT,
        recordObj = {
            ary : [],
            index : 1,
            page : 6,
            allpage : 0,
            type : 'jl',
            getDatas : function(index){
                var start = (index - 1) * this.page,
                    end = start + this.page;
                if(end > this.ary.length) end = this.ary.length;
                var ary = this.ary.slice(start,end),
                    str = '';
                if(recordObj.type == 'jl'){
                    _a(ary).each(function () {
                        var item = this;
                        if(item.type == 0){ //卡玛
                            var name = item.code_name || item.name;
                            str += '<li class="_popup_record_item"><em title="'+ name +'" class="_popup_record_name">'+ name +'</em>' +
                            '<input class="_popup_record_card" value="'+ item.code +'" readonly="readonly"><i class="_popup_record_copy_btn">复制</i></li>';
                        }else if(item.type == 1){//实物
                            str += '<li class="_popup_record_item"><em title="'+ item.name +'" class="_popup_record_name">'+ item.name +'</em>' +
                            '<span class="_popup_record_card">'+ item.code +'</span><a class="_popup_link" href="http://kf.2144.cn/" target="_blank">联系客服</a></li>';
                        }
                    });
                    _a('._popup_record_con')[0].innerHTML = str;
                }else if(recordObj.type == 'cyjl'){
                    _a(ary).each(function (index, item) {
                        var isT = '';
                        if(item.is_prize == 0 ){
                            isT = '未中奖';
                        }else if(item.is_prize == 1 ){
                            isT = '中奖';
                        }else{
                            isT = '未中奖';
                        }
                        str += '<li class="_popup_record_item_2"><span class="_popup_record_item1">'+ item.created_at +'</span>' +
                        '<span class="_popup_record_item2">'+ item.code +'</span><span class="_popup_record_item3">'+ isT +'</span></li>';
                    });
                    _a('._popup_record_con_2')[0].innerHTML = str;
                }else if(recordObj.type == 'hbjl'){
                    _a(ary).each(function () {
                        var item = this;
                        var s = item.is_prize ? '中奖' : '未中奖';
                        str += '<li class="_popup_record_item"><em title="'+ item.created_at +'" class="_popup_record_name">'+ item.code +'</em>' +
                        '<input class="_popup_record_card" value="'+ s +'" readonly="readonly"></li>';

                    });
                    _a('._popup_record_con')[0].innerHTML = str;
                }
                if(recordObj.allpage <= 1) return;
                _a('._popup_strong')[0].innerHTML = index;
                var prevEle = _a('._popup_btn_pre')[0],
                    nextEle = _a('._popup_btn_next')[0];
                prevEle.style.display = index > 1 ? 'inline-block' : 'none';
                nextEle.style.display = index == recordObj.allpage ? 'none' : 'inline-block';
            }
        };
    function ajuanPopup(opt){
        options = opt || {};
        this.maskIdName = options.maskIdName || DEFAULT.maskIdName;
        this.popupIdName = options.popupIdName || DEFAULT.popupIdName;
        this.closeClassNameArr = options.closeClassNameArr || DEFAULT.closeClassNameArr;
        this.animate = options.animate || DEFAULT.animate;
    }
    ajuanPopup.prototype = {
        //初始化
        init: function(){
            createEle(this);
            addEvent(this);
            return this;
        },
        //弹出弹窗
        pop: function (obj) {
            insertPop(this,obj);
        },
        //关闭弹窗
        close: function () {
            closePop(this)
        },
        //销毁弹窗
        destroy: function(){
            destroyPop(this);
        },
        //复制的方法
        copyToClipboard: function (target) {
            var ele = target && target.parentNode.getElementsByTagName('input')[0],
                txt = (ele && ele.value);
            if (window.clipboardData) {
                window.clipboardData.clearData();
                window.clipboardData.setData("Text", txt);
                alert("复制成功！");
            } else {
                try{
                    ele.select();
                    doc.execCommand('Copy');
                    alert("复制成功！");
                }catch(err){
                    alert("请双击礼包码右键复制！");
                }
            }
        }
    };
    //插入内容
    function insertPop(that,obj){
        var str = '<i class="_popup_close">x</i>';
        obj = obj || {};
        switch (obj.type){
            //带确定按钮的普通提示框
            case 'ts':
                str += '<h2 class="_popup_title">'+ obj.title +'</h2>' +
                '<div class="_popup_content">' +
                '<p class="_popup_prompt">'+ obj.prompt +'</p></div>' +
                '<div class="_popup_btn"><i class="_popup_btn_sure">确定</i></div>';
                that.popupEle.innerHTML = str;
                openPopup(that);
                that.popupEle.style.marginTop = '-' + (that.popupEle.clientHeight / 2) + 'px';
                break;
            //卡玛提示
            case 'km':
                str += '<h2 class="_popup_title">'+ obj.title +'</h2>' +
                '<div class="_popup_content"><p class="_popup_card_prompt">恭喜获得 '+ obj.data.name +' </p> ' +
                '<div class="_popup_card_con"><input class="_popup_card" readonly="readonly" value="'+ obj.data.code +'">' +
                '<i class="_popup_card_copy_btn">复制</i></div></div>' +
                '<div class="_popup_btn"><i class="_popup_btn_sure">确定</i></div>';
                that.popupEle.innerHTML = str;
                openPopup(that);
                that.popupEle.style.marginTop = '-' + (that.popupEle.clientHeight / 2) + 'px';
                break;
            //实物提示
            case 'sw':
                str += '<h2 class="_popup_title">'+ obj.title +'</h2>' +
                '<div class="_popup_content"><p class="_popup_gift_prompt">恭喜你获得</p>' +
                '<p class="_popup_gift_con">'+ obj.data.name +'</p></div><div class="_popup_btn">' +
                '<a class="_popup_btn_link" href="http://kf.2144.cn/" target="_blank">赶紧联系客服吧</a></div>';
                that.popupEle.innerHTML = str;
                openPopup(that);
                that.popupEle.style.marginTop = '-' + (that.popupEle.clientHeight / 2) + 'px';
                break;
            //带保密串实物提示
            case 'bmcsw':
                str += '<h2 class="_popup_title">'+ obj.title +'</h2>' +
                '<div class="_popup_content"><p class="_popup_gift_prompt">恭喜你获得</p>' +
                '<p class="_popup_gift_con">'+ obj.data.name +'</p><div class="_popup_gift_card-con">' +
                '<i class="_popup_gift_name">保密串</i><span class="_popup_gift_card"' +
                '>'+ obj.data.code +'</span></div></div><div class="_popup_btn">' +
                '<a class="_popup_btn_link" href="http://kf.2144.cn/" target="_blank">赶紧联系客服吧</a></div>';
                that.popupEle.innerHTML = str;
                openPopup(that);
                that.popupEle.style.marginTop = '-' + (that.popupEle.clientHeight / 2) + 'px';
                break;
            //带图片圣诞
            case 'tp':
                str += '<h2 class="_popup_title">'+ obj.title +'</h2><div class="_popup_content">' +
                '<p class="_popup_card_prompt">恭喜获得</p><ul class="_popup_list_pic">' +
                '<li class="_pic_item '+ obj.data.type +'"><i class="gift-icon"></i>' +
                '<em class="prop-name">'+ obj.data.msg +'</em><em class="gift-num"></em></li></ul></div>' +
                '<div class="_popup_btn"><i class="_popup_btn_sure">确定</i></div>';
                that.popupEle.innerHTML = str;
                openPopup(that);
                that.popupEle.style.marginTop = '-' + (that.popupEle.clientHeight / 2) + 'px';
                break;
            //查询记录
            case 'jl':
                var str1 = '',
                    data = obj.data,
                    len = data.length;
                recordObj.ary = data;
                recordObj.type = 'jl';
                recordObj.allpage = Math.ceil(len/recordObj.page);
                if(recordObj.allpage > 1){
                    str1 = '<i class="_popup_btn_pre">上一页</i>' +
                    '<b id="pagenumber" class="_popup_strong">1</b>' +
                    '<em class="_popup_num">/ 共'+ recordObj.allpage +'页</em>' +
                    '<i class="_popup_btn_next">下一页</i>';
                }
                str += '<h2 class="_popup_title">'+ obj.title +'</h2><div class="_popup_content"><p class="_popup_record_title">' +
                '<span class="_popup_record_name">礼包名</span><span class="_popup_record_card">礼包卡码</span></p><ul class="_popup_record_con"></ul>' +
                '</div><div class="_popup_btn">' + str1 + '</div>';
                recordObj.index = 1;
                that.popupEle.innerHTML = str;
                openPopup(that);
                recordObj.getDatas(recordObj.index);
                that.popupEle.style.marginTop = '-' + (that.popupEle.clientHeight / 2) + 'px';
                break;
            //查询记录
            case 'hbjl':
                var str1 = '',
                    data = obj.data,
                    len = data.length;
                recordObj.ary = data;
                recordObj.type = 'hbjl';
                recordObj.allpage = Math.ceil(len/recordObj.page);
                if(recordObj.allpage > 1){
                    str1 = '<i class="_popup_btn_pre">上一页</i>' +
                    '<b id="pagenumber" class="_popup_strong">1</b>' +
                    '<em class="_popup_num">/ 共'+ recordObj.allpage +'页</em>' +
                    '<i class="_popup_btn_next">下一页</i>';
                }
                str += '<h2 class="_popup_title">'+ obj.title +'</h2><div class="_popup_content"><p class="_popup_record_title">' +
                '<span class="_popup_record_name">时间</span><span class="_popup_record_card">号码</span></p><ul class="_popup_record_con"></ul>' +
                '</div><div class="_popup_btn">' + str1 + '</div>';
                console.log(data)
                recordObj.index = 1;
                that.popupEle.innerHTML = str;
                openPopup(that);
                recordObj.getDatas(recordObj.index);
                that.popupEle.style.marginTop = '-' + (that.popupEle.clientHeight / 2) + 'px';
                break;
            //查询记录
            case 'cyjl':
                var str1 = '',
                    data = obj.data,
                    len = data.length;
                recordObj.ary = data;
                recordObj.type = 'cyjl';
                recordObj.allpage = Math.ceil(len/recordObj.page);
                if(recordObj.allpage > 1){
                    str1 = '<i class="_popup_btn_pre">上一页</i>' +
                    '<b id="pagenumber" class="_popup_strong">1</b>' +
                    '<em class="_popup_num">/ 共'+ recordObj.allpage +'页</em>' +
                    '<i class="_popup_btn_next">下一页</i>';
                }
                str += '<h2 class="_popup_title">'+ obj.title +'</h2><div class="_popup_content"><p class="_popup_record_title_2">' +
                '<span class="_popup_record_item1">时间</span><span class="_popup_record_item2">号码</span>' +
                '<span class="_popup_record_item3">是否中奖</span></p><ul class="_popup_record_con_2"></ul>' +
                '</div><div class="_popup_btn">' + str1 + '</div>';
                recordObj.index = 1;
                that.popupEle.innerHTML = str;
                openPopup(that);
                recordObj.getDatas(recordObj.index);
                that.popupEle.style.marginTop = '-' + (that.popupEle.clientHeight / 2) + 'px';
                break;
        }
    }
    //打开
    function openPopup(that){
        if(that.animate.isAnimate){
            _a(that.popupEle).removeClass(that.animate.closeAnimate).addClass(that.animate.openAnimate);
            _a(that.maskEle).removeClass('_fadeOut').addClass('_fadeIn');
        }
        _a(that.popupEle).show();
        _a(that.maskEle).show();
    }
    //操作元素,创建元素
    function createEle(that){
        var divEle = doc.createDocumentFragment();
        //创建遮罩
        that.maskEle = doc.createElement('div');
        that.maskEle.id = that.maskIdName;
        that.maskEle.style.display = 'none';
        //创建弹窗主体
        that.popupEle = doc.createElement('div');
        that.popupEle.id = that.popupIdName;
        that.popupEle.style.display = 'none';
        //判断是否需要加入动画
        if(that.animate.isAnimate){
            _a(that.maskEle).addClass('_fadeIn');
            _a(that.popupEle).addClass(that.animate.openAnimate);
        }
        //加入
        divEle.appendChild(that.maskEle);
        divEle.appendChild(that.popupEle);
        doc.body.appendChild(divEle);
    }
    //添加事件
    function addEvent(that){
        clickEvent = function (event){
            var target = _a.target(event);
            //关闭
            _a(that.closeClassNameArr).each(function (index,item) {
                if(target.className == item){
                    closePop(that);
                    return;
                }
            });
            if(target.id == '_popup_mask'){
                closePop(that);
                return;
            }
            //复制
            if(target.className == '_popup_card_copy_btn'||
                target.className == '_popup_record_copy_btn'||
                target.className == '_popup_gift_name'){
                that.copyToClipboard(target);
                return;
            }
            if(target.className == '_popup_btn_pre'){//查看记录上一页
                recordObj.index--;
                recordObj.getDatas(recordObj.index);
                return;
            }
            if(target.className == '_popup_btn_next'){//查看记录下一页
                recordObj.index++;
                recordObj.getDatas(recordObj.index);
                return;
            }
        };
        _a(doc.body).on('click', clickEvent );
    }
    //删除事件
    function removeEvent(that){
        _a(doc.body).unbind('click',clickEvent);
    }
    //删除节点
    function removeEle(that){
        _a(that.popupEle).hide();
        _a(that.maskEle).hide();
        that.popupEle.innerHTML = '';
        doc.body.removeChild(that.popupEle);
        doc.body.removeChild(that.maskEle);
    }
    //销毁弹窗
    function destroyPop(that){
        if(IE && IE < 9){
            removeEle(that);
        }else if(that.animate.isAnimate){//判断是否需要执行动画
            _a(that.popupEle).removeClass(that.animate.openAnimate).addClass(that.animate.closeAnimate);
            _a(that.maskEle).removeClass('fadeIn').addClass('fadeOut');
            setTimeout(function () {
                removeEle(that);
            },that.animate.animateTime);
        }else{
            removeEle(that);
        }
        removeEvent(that);
    }
    //关闭弹窗
    function closePop(that){
        //判断浏览器
        if(IE && IE < 9){
            _a(that.popupEle).hide();
            _a(that.maskEle).hide();
        }else if(that.animate.isAnimate){//判断是否需要执行动画
            _a(that.popupEle).removeClass(that.animate.openAnimate).addClass(that.animate.closeAnimate);
            _a(that.maskEle).removeClass('_fadeIn').addClass('_fadeOut');
            setTimeout(function () {
                _a(that.popupEle).hide();
                _a(that.maskEle).hide();
            },that.animate.animateTime);
        }else{
            _a(that.popupEle).hide();
            _a(that.maskEle).hide();
        }
    }
    return ajuanPopup;
});