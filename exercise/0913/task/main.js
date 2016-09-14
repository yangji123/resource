/**
 * Created by Administrator on 2016/9/13 0013.
 */

(function () {

    var canvas = document.querySelector("#canvas");
    var ctx = canvas.getContext("2d");

    function arc(x, y, r, start, end, clock) {
        ctx.beginPath();
        ctx.arc(x, y, r, start, end, clock);
        ctx.closePath();
        ctx.stroke();
    }
    function draw() {
        arc(250,250,250,0,Math.PI*2,true);
        ctx.fillStyle="#cd2e3e";
        ctx.fill();
        arc(250,250,200,0,Math.PI*2,true);
        ctx.fillStyle="white";
        ctx.fill();
        arc(250,250,150,0,Math.PI*2,true);
        ctx.fillStyle="#cd2e3e";
        ctx.fill();
        arc(250,250,100,0,Math.PI*2,true);
        ctx.fillStyle="#02468d";
        ctx.fill();
    }
    function start() {
        ctx.beginPath();
        ctx.moveTo(250,150);
        for (var i=0;i<5;i+=1){
            var ox=100*Math.cos(i*144*Math.PI/180-Math.PI/2)+250;
            var oy=100*Math.sin(i*144*Math.PI/180-Math.PI/2)+250;
            ctx.lineTo(ox,oy);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle="white";
        ctx.fill();
    }
    draw();
    start();
})();