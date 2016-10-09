/**
 * Created by Administrator on 2016/10/8 0008.
 */
(function () {

    var canvas;
    var context;
    var CANVAS_WIDTH = 500;
    var CANVAS_HEIGHT = 400;

    function createCanvas() {
        canvas = document.createElement("canvas");
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;
        canvas.style.border="1px solid black";
        document.body.appendChild(canvas);

        context = canvas.getContext("2d");
    }

    function drawRect() {
        var rect = new CanvasGenerate();
        rect.onDraw(context);
    }

    function init() {
        createCanvas();
        drawRect();
    }
    init();
    
})();