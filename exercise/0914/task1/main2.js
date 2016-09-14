/**
 * Created by Administrator on 2016/9/14 0014.
 */
(function () {
    var canvas = document.querySelector("#canvas");
    var ctx = canvas.getContext("2d");

    var draw = function (deg) {//角度
        ctx.lineWidth = 20;
        for (var i = 1; i < 361; i++) {
            var red = 200;
            var green = 150;
            var blue = 170;
            var alpha = i / 360;
            ctx.beginPath();
            ctx.strokeStyle = "rgba(" + [red, green, blue, alpha].join(",")+")";
            ctx.arc(250, 250, 200, (i - 1 + deg) * Math.PI / 180, (i + deg) * Math.PI / 180);
            ctx.stroke();
        }
    };
    var deg = 0;
    setInterval(function () {
        ctx.clearRect(0, 0, 500, 500);
        deg += 1;
        draw(deg);
    }, 10);
})();
