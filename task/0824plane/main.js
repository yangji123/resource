/**
 * Created by Administrator on 2016/8/24 0024.
 */
(function () {
    
    function showPlaneA() {
        var showA=setInterval(function () {
            var s = new Plane();
            s.getLeftPlane();
            clearInterval(showA);
        }, 1500);
        showA=setInterval(showPlaneA,1500);
    }
    function showPlaneB(){
        var showB=setInterval(function () {
            var s = new Plane();
            s.getRightPlane();
            clearInterval(showB);
        }, 1500);
        showB=setInterval(showPlaneB,1500);
    }
    function showGun(){
        var showG=setInterval(function () {
            var s = new Plane();
            s.getGun();
            clearInterval(showG);
        },1000);
        showG=setInterval(showGun,1000);
    }
    function init() {
        showPlaneA();
        showPlaneB();
        showGun();
    }

    init();

})();