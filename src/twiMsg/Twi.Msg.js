/** 
 * Twi.Msg base on HubSpot messenger
 * @Author：feitianxinhong http://feitianxinhong.com/  
 * @Version：1.1.0
 * @CreateDate：2013-08-19
 * @LastEditDate：2015-11-20
 * @PublicDate：
 * @Require: jQuery、messenger-1.4.2
 * @Example: Visit http://feitianxinhong.com  
 * @Copyright ©2010-2020 Tyingsoft 踏影 之 TwiUI开源系列. 转载请保留本行注明. 
 * @License：Twi Framework of Tyingsoft is licensed under the MIT license.  
 * @Description：消息提示插件
 * ------------------------------------------------------------------
 *  编号    版本号      作者              修改日期         修改内容
 * ------------------------------------------------------------------
 *   1     1.0.0       feitianxinhong    2013-8-19       根据之前的Twi使用Extjs框架改成使用jquery的简化版。共有三个方法Info、Error、Comfirm
 *   2     1.0.1       feitianxinhong    2015-01-17      将自动加载messenger-1.3.5去掉。  
 *   3     1.1.0       feitianxinhong    2015-11-20      改成使用messenger-1.4.2，新的写法之前的$.globalMessenger().post()改成了Messenger().post()。
 *                                                       扩展成四个方法：Info、Error、Comfirm、Success
 * ------------------------------------------------------------------
 */



(function ($) {
    var global = this;
    if (typeof Twi === 'undefined') {
        global.Twi = {};
    }
    Twi.global = global;

    //Messengerc初始化设置
    if (Messenger) {
        Messenger.options = {
            extraClasses: 'messenger-fixed messenger-on-bottom messenger-on-right',//'messenger-fixed messenger-on-top',
            theme: 'future'
        }
    }

    Twi.Msg = {
        Success: function (config) {
            if (typeof config == "string") config = { message: config };
            config = config || {};
            var msgConfig = $.extend({
                message: '操作成功',
                type: "success",
                hideAfter:2, //2秒后自动关闭
                showCloseButton: true //显示关闭按钮                
            }, config);
            Messenger().post(msgConfig);
        },
        Info: function (config) {
            if (typeof config == "string") config = { message: config };
            config = config || {};
            var msgConfig = $.extend({
                message: '操作成功',
                type: "info",
                hideAfter:2, //2秒后自动关闭
                showCloseButton: true //显示关闭按钮                
            }, config);
            Messenger().post(msgConfig);
        }
        , Error: function (config) {
            if (typeof config == "string") config = { message: config };
            config = config || {};
            var msgConfig = $.extend({
                message: '操作失败',
                type: "error",
                hideAfter: 5, //5秒后自动关闭
                showCloseButton: true //显示关闭按钮                
            }, config);
            Messenger().post(msgConfig);
        }
        , Comfirm: function (handler, msg) {
            msg = msg || "执行后数据不能恢复，你确定要执行吗？";
            var msgObj = Messenger().post({
                message: msg,
                showCloseButton: true, //显示关闭按钮  
                actions: {
                    retry: {
                        label: '是',
                        action: function () {
                            msgObj.cancel();
                            if (typeof handler == "function") {
                                handler();
                            }                            
                        }
                    },
                    cancel: {
                        label: '否',
                        action: function () {
                            return msgObj.cancel();
                        }
                    }
                }
            });
        }
    } //end Twi.Msg

})(window.jQuery);

