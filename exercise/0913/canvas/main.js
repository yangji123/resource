/**
 * Created by Administrator on 2016/9/13 0013.
 */

(function () {

    var mycanvas = document.querySelector("#mycanvas");
    var tx = mycanvas.getContext("2d");

    // 五角星

    // tx.beginPath();
    // tx.arc(250,250,185,0,Math.PI*2,true);
    // tx.lineWidth=5;
    // tx.strokeStyle="yellow";
    // tx.stroke();
    // tx.fillStyle="red";
    // tx.fill();
    // tx.closePath();
    //
    // tx.beginPath();
    // tx.lineWidth = 5;
    // tx.strokeStyle="yellow";
    // tx.moveTo(76, 197);
    // tx.lineTo(421, 197);
    // tx.lineTo(143, 399);
    // tx.lineTo(248, 71);
    // tx.lineTo(356, 399);
    // tx.lineTo(76, 197);
    // tx.stroke();
    // tx.fillStyle="yellow";
    // tx.fill();
    // tx.closePath();

    // 五角星

    // tx.beginPath();
    // tx.moveTo(250,50);
    // for (var i=0;i<5;i+=1){
    //     var ox=200*Math.cos(i*144*Math.PI/180-Math.PI/2)+250;
    //     var oy=200*Math.sin(i*144*Math.PI/180-Math.PI/2)+250;
    //     tx.lineTo(ox,oy);
    // }
    // tx.closePath();
    // tx.stroke();
    // tx.fillStyle="yellow";
    // tx.fill();

    // 五边形

    // tx.beginPath();
    // tx.moveTo(250,50);
    // for (var i=0;i<5;i+=1){
    //     var ox=200*Math.cos(i*72*Math.PI/180-Math.PI/2)+250;
    //     var oy=200*Math.sin(i*72*Math.PI/180-Math.PI/2)+250;
    //     tx.lineTo(ox,oy);
    // }
    // tx.closePath();
    // tx.stroke();
    // tx.fillStyle="yellow";
    // tx.fill();

    // 六边形

    // tx.beginPath();
    // tx.moveTo(250,50);
    // for (var i=0;i<9;i+=1){
    //     var ox=200*Math.cos(i*60*Math.PI/180-Math.PI/2)+250;
    //     var oy=200*Math.sin(i*60*Math.PI/180-Math.PI/2)+250;
    //     tx.lineTo(ox,oy);
    // }
    // tx.closePath();
    // tx.stroke();
    // tx.fillStyle="yellow";
    // tx.fill();

    // 八边形

    // tx.beginPath();
    // tx.moveTo(250,50);
    // for (var i=0;i<13;i+=1){
    //     var ox=200*Math.cos(i*45*Math.PI/180-Math.PI/2)+250;
    //     var oy=200*Math.sin(i*45*Math.PI/180-Math.PI/2)+250;
    //     tx.lineTo(ox,oy);
    // }
    // tx.closePath();
    // tx.stroke();
    // tx.fillStyle="yellow";
    // tx.fill();

    //笑脸

    // var index=true;
    // function arc(x,y,r,start,end,clock) {
    //     tx.beginPath();
    //     tx.lineWidth=5;
    //     tx.strokeStyle="black";
    //     tx.arc(x,y,r,start,end,clock);
    //     tx.closePath();
    //     tx.stroke();
    // }
    // function bigface() {
    //     arc(250,250,200,0,Math.PI*2,true);
    // }
    // function eyes() {
    //     arc(180,170,40,0,Math.PI*2,true);
    //     tx.fillStyle="black";
    //     tx.fill();
    //     arc(320,170,40,0,Math.PI*2,true);
    //     tx.fillStyle="black";
    //     tx.fill();
    // }
    // function lip() {
    //     arc(250,280,100,0,Math.PI,false);
    //     tx.beginPath();
    //     tx.lineWidth=5;
    //     tx.moveTo(250,280);
    //     tx.lineTo(250,380);
    //     tx.closePath();
    //     tx.stroke();
    //
    //     tx.beginPath();
    //     tx.lineWidth=5;
    //     tx.moveTo(200,280);
    //     tx.lineTo(200,365);
    //     tx.closePath();
    //     tx.stroke();
    //
    //     tx.beginPath();
    //     tx.lineWidth=5;
    //     tx.moveTo(300,280);
    //     tx.lineTo(300,365);
    //     tx.closePath();
    //     tx.stroke();
    // }
    // function init() {
    //     bigface();
    //     eyes();
    //     lip();
    // }
    // init();

    //字体颜色渐变

    // tx.font="80px 华文中魏";
    // var changeColor=tx.createLinearGradient(90,200,410,280);//渐变的起始坐标
    // changeColor.addColorStop("0.3","red");
    // changeColor.addColorStop("0.5","green");
    // changeColor.addColorStop("0.7","blue");
    // tx.strokeStyle=changeColor;
    // tx.strokeText("优才学院",90,200);

    //矩形颜色渐变

    // var changeColor=tx.createLinearGradient(0,0,0,100);
    // var changeColor=tx.createLinearGradient(0,0,100,0);
    // var changeColor=tx.createLinearGradient(0,0,100,100);
    // changeColor.addColorStop("0.3","red");
    // changeColor.addColorStop("0.4","yellow");
    // changeColor.addColorStop("1.0","green");
    // changeColor.addColorStop("0.6","blue");
    // changeColor.addColorStop("0.8","orange");
    // tx.rect(0,0,100,100);
    // tx.fillStyle=changeColor;
    // tx.fill();

    //画板

    // mycanvas.onmousedown=function (event) {
    //     tx.beginPath();
    //     tx.lineWidth=5;
    //     tx.strokeStyle="red";
    //     tx.moveTo(event.pageX,event.pageY);
    //     mycanvas.onmousemove=function (event) {
    //         tx.lineTo(event.pageX,event.pageY);
    //         tx.stroke();
    //         mycanvas.onmouseup=function (event) {
    //             mycanvas.onmousemove=" ";
    //         }
    //     }
    // }

    //画板

    // mycanvas.onmousedown=function (ev) {
    //     var oevent=ev||event;
    //     tx.beginPath();
    //     tx.strokeStyle="green";
    //     tx.lineWidth=5;
    //     tx.moveTo(oevent.clientX-mycanvas.offsetLeft,oevent.clientY-mycanvas.offsetTop);
    //     mycanvas.onmousemove=function (ev) {
    //         var oevent=ev||event;
    //         tx.lineTo(oevent.clientX-mycanvas.offsetLeft,oevent.clientY-mycanvas.offsetTop);
    //         tx.stroke();
    //         mycanvas.onmouseup=function () {
    //             mycanvas.onmousemove=" ";
    //         }
    //     }
    // }
})();