/**
 * Created by Administrator on 2016/9/8 0008.
 */
$(function () {

    function random() {
        $(".random").animate({left: "-100%"}, 1000, function () {
            $(this).css({left: "0px"});
            $(this).children("img").first().remove().clone(true).appendTo(".random");
        });
    }

    var startRandom = setInterval(random, 3000);

    $(".random").hover(function () {
        clearInterval(startRandom);
    }, function () {
        startRandom = setInterval(random, 3000);
    });

    function formate(num) {
        if(num<10){
            return "0"+num;
        }else{
            return num;
        }
    }
    setInterval(function () {
        var date = new Date();
        $(".hours").text(formate(date.getHours()));
        $(".minutes").text(formate(date.getMinutes()));
        $(".seconds").text(formate(date.getSeconds()));


        // var date = new Date();
        // var todayTime=parseInt(date.getTime()/1000);
        //
        // var date1=new Date(10,00,00);
        // var endTime=parseInt(date1.getTime()/1000);
        //
        // var subTime=function (time) {
        //     var Hour=Math.floor((time%86400)/3600);
        //     var Minute=Math.floor(((time%86400)%3600)/60);
        //     var Second=((time%86400)%3600)%60;
        // }
        // document.write(subTime(endTime-todayTime));
    },1000);

    function showNine() {
        
    }
    function init() {
        random();
        showNine();
    }

    init();

});