/**
 * Created by Administrator on 2016/9/14 0014.
 */
(function () {

    var canvas = document.querySelector("#canvas");
    var ctx = canvas.getContext("2d");
    var array = [60, 90, 150, 130, 170, 190, 125, 175, 155, 165, 155, 145];

    function line(startX, startY, endX, endY, x, y,y1, height, text, text1, text2) {
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "black";
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.fillText(text, startX - 25, startY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(50, 390);
        ctx.lineTo(50, 60);
        ctx.moveTo(530, 390);
        ctx.lineTo(530, 60);
        ctx.closePath();
        ctx.stroke();

        ctx.save();
        ctx.beginPath();
        ctx.arc(x + 15, y, 5, 0, Math.PI * 2, false);
        ctx.fillText(text1, x, 410);
        ctx.fillText(text2, x, 380 - Math.abs(height));
        ctx.closePath();
        ctx.stroke();

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x+15, y);
        ctx.lineTo(x+39+15,y1);
        ctx.closePath();
        ctx.stroke();
    }
    var startX = 50, startY = 60, endX = 530, endY = 60, x = 60, index = 330;
    for (var i = 0; i < array.length; i++) {
        line(startX, startY, endX, endY, x, 390 - array[i], 390 - array[i+1],-array[i], index, i + 1 + "月", Math.abs(-array[i]));
        startY += 30;
        endY += 30;
        x += 39;
        index -= 30;
    }



})();