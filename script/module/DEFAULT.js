/**
 * Created by 2144 on 2016/12/26.
 * author：zhigang.chen@owulia.com
 * 默认参数模块、更改各大参数
 */
define(function () {

    //url前缀
    var URL = 'http://hd.2144.cn/';

    //用户模块的参数配置
    var USER_DEFAULT = {
        userBoxId:'user-box',
        loginUrl:'http://ptlogin.2144.cn/ptlogin/getuser',
        logoutUrl:'http://ptlogin.2144.cn/ptlogin/ajaxlogout',
        achieveUserMsgUrl:'http://hd.2144.cn/actQuery/actInfo',
        achieveUserObj:{act_id:92},
        loginBtnId:'login-btn',
        logoutBtnId:'logout-btn',
        registerBtnId:'register-btn'
    };

    //弹窗模块参数配置
    var POPUP_DEFAULT = {
        maskIdName:'_popup_mask',
        popupIdName:'_popup',
        closeClassNameArr:['_popup_close','_popup_btn_sure'],
        animate:{
            isAnimate:true,
            closeAnimate:'_fadeOut',
            openAnimate:'_bounceIn',
            animateTime:300
        }
    };

    //页面模块
    var PAGE_DEFAULT = {
        url:'http://hd.2144.cn/actQuery/groupinfo',
        obj:{group_id:3}
    };

    //事件模块参数配置
    var EVENT_DEFAULT = {
        clickEleObjectArr:[]
    };

    //导航条模块参数配置
    /*
    * 格式：
    * anchorArr=[
    *   {eleIdName: //点击的元素ID名
    *    id:    //到达元素的ID名
    *    dur:   //时间，默认500
    *    dir:   //距离到达元素的距离，默认0
    *   }
    * ]
    * */
    var NAV_DEFAULT = {
        anchorArr:[]
    };

    //信息滚动模块参数配置
    /*
    * 格式：
    * scrollArr=[
    *   {url:       //ajax请求的链接
    *    obj:       //ajax传递的参数
    *    divEle:    //需要滚动信息的大盒子
    *    callback:   //回调函数
    *    }
    * ]
    * */
    var INFO_SCROLL_DEFAULT = {
        scrollArr:[]
    };

    return {
        URL:URL,
        USER_DEFAULT:USER_DEFAULT,
        POPUP_DEFAULT:POPUP_DEFAULT,
        PAGE_DEFAULT:PAGE_DEFAULT,
        EVENT_DEFAULT:EVENT_DEFAULT,
        NAV_DEFAULT:NAV_DEFAULT,
        INFO_SCROLL_DEFAULT:INFO_SCROLL_DEFAULT
    }

});