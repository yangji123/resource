/**
 * Created by Administrator on 2016/9/12 0012.
 */

$(function () {

    $(".submit").bind("click",function () {
        if($("#repsd").val()==$("#psd").val()){
            return true;
        }else {
            alert("确认密码与设置密码不一致，请重新填写！");
        }
    });
    $(".test").text(Math.floor((Math.random()+1)*10000));
    $(".on").blur(function () {
        if ($(".on").val()!=$(".test").text()){
            alert("验证码错误，请重新输入！");
        }
    })
});