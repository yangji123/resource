/**
 * Created by Administrator on 2016/10/11 0011.
 */
(function () {

    var canvas = document.querySelector("#canvas");
    var context = canvas.getContext("2d");

    var btnSaveImage=document.querySelector("#btn-save-data");

    canvas.addEventListener("mousedown", function (event) {
        context.moveTo(event.pageX - canvas.offsetLeft,
            event.pageY - canvas.offsetTop);
        canvas.onmousemove=function (event) {
            context.lineTo(event.pageX - canvas.offsetLeft,
                event.pageY - canvas.offsetTop);

            context.strokeStyle = "lightgreen";
            context.lineWidth = 3;
            context.stroke();

            localStorage.setItem("img",canvas.toDataURL());
            
            context.drawImage(canvas,0,0,500,500);
            
            canvas.addEventListener("mouseup", function () {
               canvas.onmousemove=" ";
            })
        }
    });
    
    btnSaveImage.addEventListener("click",function (event) {
        window.open(canvas.toDataURL());
    });
    window.addEventListener("load",function (event) {
        var img=new Image();
        img.src=localStorage.getItem("img");
    })

})();