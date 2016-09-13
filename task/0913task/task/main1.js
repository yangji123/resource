/**
 * Created by Administrator on 2016/9/13 0013.
 */

(function () {

    var canvas=document.querySelector("#canvas");
    var ctx = canvas.getContext("2d");

    function arc(x, y, r, start, end, clock) {
        ctx.save();
        ctx.beginPath();
        ctx.translate(250, 250);
        ctx.moveTo(0, 0);
        ctx.arc(x, y, r, start, end, clock);
        ctx.closePath();
        ctx.restore();
    }
    function draw() {
        arc(0,0,200,0,Math.PI*2,true);
        ctx.fillStyle="green";
        ctx.fill();

        arc(0,0,200,0,Math.PI/3,false);
        ctx.fillStyle="red";
        ctx.fill();

        arc(0,0,200,Math.PI/3,Math.PI*1.2,false);
        ctx.fillStyle="blue";
        ctx.fill();
    }
    draw();
})();