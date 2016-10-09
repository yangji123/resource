/**
 * Created by Administrator on 2016/10/8 0008.
 */
window=window||{};
(function () {
    
    function CanvasGenerate() {

    }
    var p=CanvasGenerate.prototype;
    p.onDraw = function (context) {
        context.fillStyle="red";
        context.fillRect(120, 20, 260, 50);

        context.fillStyle="orange";
        context.fillRect(50, 200, 100, 50);

        context.fillStyle="lightgreen";
        context.fillRect(340, 200, 100, 50);

        context.fillStyle="black";
        context.font="30px 微软雅黑";
        context.fillText("你是人？还是猪？",130,55);

        context.fillStyle="lightgreen";
        context.font="25px 微软雅黑";
        context.fillText("我是人",60,230);

        context.fillStyle="orange";
        context.font="25px 微软雅黑";
        context.fillText("我是猪",350,230);

    };

    window.CanvasGenerate=CanvasGenerate;
})();