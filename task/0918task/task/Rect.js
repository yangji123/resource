/**
 * Created by Administrator on 2016/9/18 0018.
 */

(function () {

    var canvas = document.querySelector("#canvas");
    var ctx = canvas.getContext("2d");
    var array = [20, 70, 125];

    function drawRect(pX, pWidth) {
        //绘制柱子
        ctx.save();
        ctx.beginPath();
        ctx.rect(pX, 500, pWidth, -200);
        ctx.closePath();
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.restore();
    }
    function rects(rX) {
        //绘制正方形
        ctx.save();
        ctx.beginPath();
        ctx.rect(rX, 300, 15, -15);
        ctx.closePath();
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.restore();
    }
    function generateRect() {
        for (var i = 0; i < array.length; i++) {
            drawRect(array[i], Math.random() * 30 + 15);
        }
        rects(array[0]);
    }
    function drawPine(pHeight) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(array[0] + 15, 300, 3, -pHeight);
        ctx.closePath();
        ctx.fillStyle = "green";
        ctx.fill();
        ctx.restore();
    }
    var index = 0, speed = 3,rx1=20;
    drawPine(index);
    function init() {
        generateRect();
        document.onkeydown = function (e) {
            var ev = event || e;
            if (ev.keyCode == 32) {
                    index += speed;
                    drawPine(index);
                document.onkeyup = function (e) {
                    ctx.clearRect(array[0] + 15, 300, 3, -index);
                    ctx.save();
                    ctx.beginPath();
                    ctx.rect(array[0] + 15, 300, index,-3);
                    ctx.closePath();
                    ctx.fillStyle = "green";
                    ctx.fill();
                    ctx.restore();
                    // var timer=setInterval(function () {
                    //     rx1++;
                    //     rects(rx1);
                    //     ctx.clearRect(rx1, 300, 15, -15);
                    //     if (rx1>=index+15+20){
                    //         clearInterval(timer);
                    //     }
                    // },100);

                };
            }
        };
    }
    init();
})();