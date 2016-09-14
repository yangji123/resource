/**
 * Created by Administrator on 2016/9/13 0013.
 */
(function () {

    var myCanvas = document.querySelector("#myCanvas");
    var ctx = myCanvas.getContext("2d");

    function time() {
        ctx.clearRect(0,0,500,500);
        ctx.beginPath();
        ctx.arc(250, 250, 200, 0, Math.PI * 2, true);
        ctx.strokeStyle = "red";
        ctx.lineWidth = 10;
        ctx.stroke();

        ctx.strokeStyle = "purple";
        ctx.lineWidth = 3;
        //分钟刻度
        for (var i = 0; i < 60; i++) {
            ctx.save();
            ctx.beginPath();
            ctx.translate(250, 250);//旋转中心
            ctx.rotate(i * 6 * Math.PI / 180);
            ctx.moveTo(0, -180);
            ctx.lineTo(0, -190);
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
        }

        ctx.strokeStyle = "green";
        ctx.lineWidth = 5;
        //小时刻度
        for (var i = 0; i < 12; i++) {
            ctx.save();
            ctx.beginPath();
            ctx.translate(250, 250);
            ctx.rotate(i * 30 * Math.PI / 180);
            ctx.moveTo(0, -170);
            ctx.lineTo(0, -193);
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
        }

        //指针
        var date = new Date();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();

        //时针
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 10;
        ctx.translate(250, 250);
        ctx.rotate((hour+minute/60)* 30 * Math.PI / 180);
        ctx.moveTo(0,10);
        ctx.lineTo(0,-125);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();

        //分针
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.lineWidth = 5;
        ctx.translate(250, 250);
        ctx.rotate((minute+second/60)* 6 * Math.PI / 180);
        ctx.moveTo(0,10);
        ctx.lineTo(0,-145);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();

        //秒针
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = "green";
        ctx.lineWidth = 2;
        ctx.translate(250, 250);
        ctx.rotate(second * 6 * Math.PI / 180);
        ctx.moveTo(0,10);
        ctx.lineTo(0,-165);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }

    setInterval(time,1000);
})();