/**
 * Created by 2144 on 2016/12/15.
 * author：zhigang.chen@owulia.com
 * 用户登录、注册、注销模块
 */
define(['DEFAULT','Ajuan-1.0'],function (DEFAULT,_a) {
    var clickEvent,
        options,
        doc = document,
        DEFAULT = DEFAULT.USER_DEFAULT;
    function UserModule(opt){
        options = opt || {};
        this.userBox = options.userBox || _a('#' + DEFAULT.userBoxId)[0];
        this.loginUrl = options.loginUrl || DEFAULT.loginUrl;//登录的url
        this.logoutUrl = options.logoutUrl || DEFAULT.logoutUrl;//注销的url
        this.achieveUserMsgUrl = options.achieveUserMsgUrl || DEFAULT.achieveUserMsgUrl;//获取用户信息的url
        this.achieveUserObj = options.achieveUserObj || DEFAULT.achieveUserObj;//获取用户信息需要传递的参数对象
        this.loginBtnId = options.loginBtnId || DEFAULT.loginBtnId;//登录的按钮id
        this.logoutBtnId = options.logoutBtnId || DEFAULT.logoutBtnId;//注销的按钮id
        this.registerBtnId = options.registerBtnId || DEFAULT.registerBtnId;//注册的按钮id
        this.loginCallback = options.loginCallback;//登录后执行的回调函数
        this.logoutCallback = options.logoutCallback;//注销后执行的回调函数
    }
    UserModule.prototype = {
        //用户登录
        userLoginFun : function () {
            var that = this;
            IO.jsonp(this.loginUrl,{
                t:Math.random()
            }, function (data) {
                if(data.isGuest == 0){
                    that.actUserId = data.id;
                    that.actUserName = data.username;
                    if(that.loginCallback) that.loginCallback(that,data);
                }else{
                    that.userLogoutFun();
                }
            });
        },
        //用户注销
        userLogoutFun: function () {
            IO.jsonp(this.logoutUrl, function (data) {
                callback(data);
            });
            this.actUserId = 0;
            this.actUserName = '';
            if(this.logoutCallback) {
                var that = this;
                setTimeout(function () {
                    that.logoutCallback(that);
                },500)
            }
        },
        //获取用户信息
        achieveUserMsg: function (obj,callback) {
            var that = this,
                url = obj.url || this.achieveUserMsgUrl,
                url_obj = obj ? obj.obj : this.achieveUserObj;
            IO.jsonp( url , url_obj, function (data) {
                if(data.status == 0){
                    if(callback) callback(that,data);
                }
            })
        },
        //初始化
        init: function () {
            var that = this;
            if(typeof Login != 'undefined'){
                Login.actLogin = function(){
                    that.userLoginFun();
                };
            }
            if(typeof Logout != 'undefined'){
                Logout.actLogout = function(){
                    that.userLogoutFun();
                };
            }
            this.userLoginFun();
            this.addEvent();
            return this;
        },
        //事件的绑定
        addEvent: function () {
            addEvent(this);
        },
        //事件解除
        unAddEvent: function () {
            removeEvent(this);
        }
    };
    //绑定事件
    function addEvent(that){
        clickEvent = function (event){
            var target = _a.target(event);
            //登录事件
            if(target.id == that.loginBtnId || target.className == that.loginBtnId){
                _jsiframeShow(0);
                return;
            }
            //注销事件
            if(target.id == that.logoutBtnId || target.className == that.logoutBtnId){
                that.userLogoutFun();
                return;
            }
            //注册事件
            if(target.id == that.registerBtnId || target.className == that.registerBtnId){
                _jsiframeShow(1);
                return;
            }
        };
        _a(doc.body).on('click',clickEvent);
    }
    //解除事件
    function removeEvent(){
        _a(doc.body).unbind('click',clickEvent);
    }
    return UserModule;
});