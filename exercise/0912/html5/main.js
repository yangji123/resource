/**
 * Created by Administrator on 2016/9/12 0012.
 */

$(function () {

    $(document).bind("click",function (ev) {
        var oevent=ev||event;
        if(localStorage.num){
            localStorage.num=Number(localStorage.num)+1;
        }else{
            localStorage.num=1;
        }
        $("<div></div>").appendTo("body").addClass("container");

        var x=event.pageX+"px";
        var y=event.pageY+"px";
        $(".container").css("left",x);
        $(".container").css("top",y);
        $(".container").innerHTML=localStorage.num;
        var a="hello";
    });
});