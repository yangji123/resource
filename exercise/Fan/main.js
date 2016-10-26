/**
 * Created by REN on 2016/9/9.
 */
(function () {

    /**
     * 思路：
     * 1：所有扇叶用绝对防定位重合在一起；
     * 封面点击效果：第一次点击展开所有扇叶，每个扇叶间隔1定角度（eg:15度，用rotate实现）
     *                          第二次点击合上所有扇叶
     * 扇叶点击效果（除封面）：对应扇叶显示在正中间；与右侧相邻的扇叶拉开一定角度；
     *                                          如：左侧全部间隔15度；右侧全部间隔15度，但右侧相邻第二个扇叶间隔30度；
     *
     *  实现方法只用到了transition（过度动画）和transform的rotate；
     */




    var bgColors = ["#6be","#f2b6b6","#ffe957","#f29f3f","#bdb76a","#ffe957","#83fcd8","#61ff69","#b8f788","#000"];
    var fans = document.querySelectorAll(".fan");
    var fansLength = fans.length;
    var firstFan = document.querySelector(".fan-1st");
    var midFan = Math.floor((fansLength+1) / 2);
    var isOpen=false;

    function rotateDEGandTime(ele,deg,time) {
        ele.style.transition="all "+time+"s";
        ele.style.transform = "rotate("+deg+"deg)";
    }

    function initFanData() {
        for(var i=0;i<fansLength;i++) {
            fans[i].number=i;
            fans[i].style.background = bgColors[i];
            fans[i].onclick = fanClicked;
        }
        firstFan.onclick = function () {
            if (!isOpen) openFan();
            else closeFan();
        }
    }

    function initFansDEG() {
        for(var i=0;i<fansLength;i++) {
            rotateDEGandTime(fans[i],0,0);
        }
    }

    function openFan() {
        for (var i=0;i<fansLength;i++) {
            var deg = -15*(midFan-i);
            rotateDEGandTime(fans[i],deg,1);
        }
        isOpen = true;
    }

    function closeFan() {
        for (var i=0;i<fansLength;i++) {
            rotateDEGandTime(fans[i],360);
        }
        setTimeout(initFansDEG,1000);
        isOpen = false;
    }

    function fanClicked() {
        var midFan = this.number
        //left：
        for (var i=0;i<=midFan;i++) {
            var deg = -15*(midFan-i);
            rotateDEGandTime(fans[i],deg);
        }
        //right：
        for (var i=midFan+1;i<fansLength;i++) {
            var deg = 15*(i-midFan)+15;
            rotateDEGandTime(fans[i],deg);
        }
    }

    initFanData();

})();