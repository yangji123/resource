/**
 * Created by Administrator on 2016/9/14 0014.
 */
(function () {
    var canvas=document.querySelector("#canvas");
    var ctx = canvas.getContext("2d");

    function arc(x, y, r, start, end, clock,color) {
        ctx.save();
        ctx.beginPath();
        ctx.translate(250, 250);
        ctx.moveTo(0, 0);
        ctx.arc(x, y, r, start, end, clock);
        ctx.closePath();
        ctx.fillStyle=color;
        ctx.fill();
        ctx.restore();
    }
    arc(0,0,200,0,Math.PI*2,true,"green");
    var speed=Math.PI/60;
    var sub=0;
    setInterval(function () {
        sub +=speed;
        arc(0,0,200,0,sub,false,"red");
    },50);
})();
