/**
 * Created by Administrator on 2016/10/10 0010.
 */
(function () {
    var video = document.createElement('video');
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var container = document.getElementById("container");
    var containerContext = container.getContext("2d");
    var rectX, rectY;

    function camera() {
        navigator.mediaDevices.getUserMedia({
            audio: false, video: true
        }).then(function (result) {
            video.autoplay = true;
            video.srcObject = result;
        }).catch(function (error) {
            console.log(error);
        });
    }

    function render() {
        context.clearRect(0, 0, 400, 300);
        containerContext.clearRect(0, 0, 200, 200);
        
        context.save();
        context.beginPath();
        context.fillRect(rectX, rectY, 200, 200);
        context.closePath();
        context.clip();

        context.drawImage(video, 0, 0);

        containerContext.drawImage(video, rectX, rectY, 200, 200, 0, 0, 200, 200);
        context.restore();

        requestAnimationFrame(render);
    }

    document.getElementById("btn").addEventListener("click", function (e) {
        e.preventDefault();
        video.pause();
    });
    
    function init() {
        camera();
        render();
        if(video.pause){
            canvas.addEventListener("mousedown", function (e) {
                e.preventDefault();
                canvas.addEventListener("mousemove", function (e) {
                    rectX = e.clientX - 100;
                    rectY = e.clientY - 100;
                    canvas.addEventListener("mouseup", function (e) {
                        canvas.removeEventListener("mousedown");
                        canvas.removeEventListener("mousemove");
                    });
                });

            });
        }
    }

    init();
})();
