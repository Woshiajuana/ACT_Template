/**
 * Created by 2144 on 2016/12/23.
 * author：zhigang.chen@owulia.com
 * 入口
 */
requirejs.config({
    baseUrl:'script/module/',
    paths:{
        DEFAULT:'DEFAULT',
        'Ajuan-1.0':'Ajuan-1.0',
        UserModule:'UserModule',
        EventModule:'EventModule',
        PageModule:'PageModule',
        InfoScrollModule:'InfoScrollModule',
        PopupModule:'PopupModule',
        NavModule:'NavModule'
    }
});
requirejs(['DEFAULT','Ajuan-1.0','UserModule','EventModule','PageModule','InfoScrollModule',
    'NavModule'],
    function (DEFAULT,_a,UserModule,EventModule,PageModule,InfoScrollModule,NavModule) {

        //url前缀
        var URL = DEFAULT.URL;

        //用户模块
        //实例化用户
        var User = new UserModule({
                //登录成功后执行的回调函数
                loginCallback: function (that) {//that指代这个实例
                //暴露出来，填写登录之后的文字
                    that.userBox.innerHTML = '您好，<i>'+ that.actUserName +'</i>欢迎来到2144游戏，' +
                    '<em class="see-record">我的礼包></em><em id="'+ that.logoutBtnId +'">注销</em>';
                    Page.init('initPage');
                },
                //注销用户后执行的回调函数
                logoutCallback: function (that) {
                    //暴露出来，填写未登录的文字
                    that.userBox.innerHTML = '欢迎来到2144游戏，请 <em id="'+ that.loginBtnId +'">登录</em> | <em id="'+ that.registerBtnId +'">注册</em>';
                    Page.init('initPage');
                }
            }).
            init();

        //页面初始化模块
        //实例出来
        var Page = new PageModule().
            work('initPage',function(){
                //数据处理
                IO.jsonp(URL + 'platformNewYear/actinfo', function (data) {
                    //初始化页面
                    var user_code = data.user_code,
                        prize_code = data.prize_code || '',
                        prize_codeArr = prize_code && prize_code.split(''),
                        gift_listObject = data.gift_list,
                        prizeStr = !user_code ? '等待开奖' : user_code == prize_code ? '中奖' : '未中奖';
                    if(user_code) {
                        _a('#user-prize').removeClass('achieve-prize').addClass('achieve-prize-after').html(user_code);
                    }else{
                        _a('#user-prize').removeClass('achieve-prize-after').addClass('achieve-prize').html('');
                    }
                    if(prize_code){
                        _a('.num-item').each(function (index, item) {
                            item.innerHTML = prize_codeArr[index];
                        })
                    }
                    _a('.prize-show').html(prizeStr);
                    _a('.select-option').each(function (index,item) {
                        var str = '';
                        _a.each(gift_listObject[index+1], function (ind, it) {
                            str += '<li class="select-option-item" v="'+ it.id +'">'+ it.name +'</li>';
                        });
                        item.innerHTML = str;
                    });
                });
            }).
            work('initRanking',function(){
                //数据处理
                IO.jsonp(URL + 'actQuery/chargelist',{
                    group_id:23,
                    gid:0
                }, function (data) {
                    var divEle = _a('.ranking-list-con'),
                        str = '<dt class="ranking-list-con-title"><span class="w-1">排行</span><span class="w-2">账号</span><span class="w-3">金额</span></dt>';
                    _a.each(data, function (index, item) {
                        str += '<dd>' +
                        '<span class="w-1">'+ (index + 1) +'</span>' +
                        '<span class="w-2">'+ item.username +'</span>' +
                        '<span class="w-3">'+ item.money +'</span></dd>';
                    });
                    divEle.html(str);
                });
            }).
            init();

        //事件模块
        var Event = new EventModule({
            userModule:User,
            pageModule:Page,
            clickEleObjectArr:[]}).
            work('click',{'className':'achieve-btn-1','url':URL + 'actCommon/getcard','attrName':['act_id'],'action':0}).
            work('click',{'className':'see-record','url':URL + 'actQuery/cardlog','obj':{ group_id:23},'action':1}).
            work('click',function (target) {
                if(target.className !='select-input'){
                    _a('.select-option').hide();
                }
                //书写一些点击事件的方法
                if(target.className =='select-input'){
                    var optEle =  _a(target.parentNode).find('.select-option');
                    optEle[0].style.display = optEle[0].style.display == 'block' ? 'none' : 'block';
                    //optEle[0].style.display = 'block';
                    return;
                }
                if(target.className == 'achieve-btn'){
                    var that = this;
                    if(!that.userModule.actUserId){
                        _jsiframeShow(0);
                        return;
                    }
                    this.popup.pop({
                        type:'ts',
                        title:'温馨提示',
                        prompt:'请先选择游戏'
                    });
                    return;
                }
                if(target.className =='select-option-item'){
                    var parEle = target.parentNode,
                        parParEle = parEle.parentNode,
                        parParParParEle = parParEle.parentNode.parentNode;
                    _a(parEle).hide();
                    _a(parParEle).find('.select-input').html(_a(target).html());
                    _a(parParParParEle).find('i').data('act_id',target.getAttribute('v')).removeClass('achieve-btn').addClass('achieve-btn-1');
                    return;
                }
                if(target.className == 'achieve-prize'){
                    var that = this;
                    if(!that.userModule.actUserId){
                        _jsiframeShow(0);
                        return;
                    }
                    if(that.type) return;
                    that.type = true;
                    IO.jsonp(URL + 'platformNewYear/lotterycode', function (data) {
                        if(data.status == 0){
                            that.pageModule.init('initPage');
                        }else{
                            that.popup.pop({
                                type:'ts',
                                title:'温馨提示',
                                prompt:data.msg
                            });
                        }
                        that.type = false;
                    });
                    return;
                }
                if(target.className == 'see-prize-msg'){
                    var that = this;
                    if(!that.userModule.actUserId){
                        _jsiframeShow(0);
                        return;
                    }
                    if(that.type) return;
                    that.type = true;
                    IO.jsonp(URL + 'platformNewYear/prizelist', function (data) {
                        if(data.status == 0){
                            var data = data.prize_list;
                            if(!data.length){
                                that.popup.pop({
                                    type:'ts',
                                    title:'温馨提示',
                                    prompt:'您还未有纪录，赶紧去参加吧~~'
                                });
                                that.type = false;
                                return;
                            }
                            that.popup.pop({
                                type:'cyjl',
                                title:'温馨提示',
                                data:data
                            });
                        }
                        that.type = false;
                    });
                    return;
                }
            }).
            init();

        //信息滚动模块
        var InfoScroll = new InfoScrollModule().
            work(URL + 'platformNewYear/actinfo',{},_a('.prize-list-box'), function (data, str) {
                var lottery_history = data.lottery_history;
                if(!lottery_history.length){
                    str = '<li class="prize-item">暂无数据</li>';
                }else{
                    _a.each(lottery_history, function (index,item) {
                        str += '<li class="prize-item">' +
                        '<span class="w-1">'+ item.created_at.split(' ')[0] +'</span>' +
                        '<span class="w-2">'+ item.username +'</span>' +
                        '<span class="w-3">'+ '1000RMB的游戏币' +'</span></li>';
                    });
                }
                return str;
            }).
            init();

        //侧边导航栏控制模块
        var Nav = new NavModule().
            work('returnOne','section-one',500).
            work('returnTwo','section-two',500).
            work('returnThree','section-three',500).
            work('returnFour','section-four',500).
            init();

});