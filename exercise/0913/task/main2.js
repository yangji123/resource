/**
 * Created by Administrator on 2016/9/14 0014.
 */
(function () {
    var canvas = document.querySelector("#canvas");
    var ctx = canvas.getContext("2d");

    //start 起始角度  per 结束角度
    function draw(start, per, color, fn) {
        var nowpre = 0;
        var ox = ((200 * Math.cos(start + per / 2) + 250) - 250) / 2 + 250;
        var oy = ((200 * Math.sin(start + per / 2) + 250) - 250) / 2 + 250;
        var time = setInterval(function () {
            nowpre += per / 100;
            if (nowpre >= per) {
                clearInterval(time);
                nowpre = per;
            }
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.arc(250, 250, 200, start, start + nowpre, false);
            ctx.lineTo(250, 250);
            ctx.closePath();
            ctx.fill();
            if (nowpre >= per) {
                // ctx.beginPath();
                // ctx.fillStyle = "black";
                // ctx.font = "20px 宋体";
                // ctx.closePath();
                // ctx.fillText((per / (2 * Math.PI)) * 100 + "%", ox, oy);
                fn();
            }
        }, 10);
    }

    function count(per) {//百分比
        return (per / 100) * 2 * Math.PI;
    }

    draw(0, count(30), "red", function () {
        draw(count(30), count(25), "green", function () {
            draw(count(55), count(20), "purple", function () {
                draw(count(75), count(20), "pink", function () {
                    draw(count(95), count(5), "blue", function () {

                    });
                });
            });
        });
    });
})();
