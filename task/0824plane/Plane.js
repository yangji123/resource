/**
 * Created by Administrator on 2016/8/24 0024.
 */

(function () {

    function Plane() {

        this.contianer = document.querySelector("#container");

        this.leftplane = document.createElement("div");
        this.leftplane.className = "planeA";
        this.leftplane.style.width = "69px";
        this.leftplane.style.height = "26px";
        this.leftplane.style.left = Math.random() * 100 + "px";
        this.contianer.appendChild(this.leftplane);

        this.rightplane = document.createElement("div");
        this.rightplane.className = "planeB";
        this.rightplane.style.width = "69px";
        this.rightplane.style.height = "26px";
        this.rightplane.style.left = (Math.random() + 1) * 300 + "px";
        this.contianer.appendChild(this.rightplane);

        this.guns=document.createElement("div");
        this.guns.className="guns";
        this.contianer.appendChild(this.guns);

        this.gun = document.createElement("div");
        this.gun.className = "gun";
        this.gun.style.width="25px";
        this.gun.style.height="25px";
        this.gun.style.top = (Math.random() + 1) * 160 + "px";
        this.contianer.appendChild(this.gun);

        this.movePlaneA();
        this.bombPlaneB();
        this.moveGun();
        this.bombPlaneA();
        this.movePlaneB();
    }

    Plane.prototype.getLeftPlane = function () {
        return this.leftplane;
    };

    Plane.prototype.getRightPlane = function () {
        return this.rightplane;
    };
    Plane.prototype.getGun = function () {
        return this.gun;
    };


    Plane.prototype.movePlaneA = function () {
        this.speedX = 5;
        var self = this;
        var planeATimer = setInterval(function () {
            self.leftplane.style.left = parseInt(self.leftplane.style.left) + self.speedX + "px";
            self.bombPlaneA();
            clearInterval(planeATimer);
        }, 20);
        planeATimer = setInterval(this.movePlaneA, 20);
    };
    Plane.prototype.movePlaneB = function () {
        this.speedX = 5;
        var self = this;
        var planeBTimer = setInterval(function () {
            self.rightplane.style.left = parseInt(self.rightplane.style.left) - self.speedX + "px";
            self.bombPlaneB();
            clearInterval(planeBTimer);
        }, 20);
        planeBTimer = setInterval(this.movePlaneB, 20);
    };

    Plane.prototype.moveGun = function () {
        this.speedX = 5;
        var self = this;
        var gunTimer = setInterval(function () {
            self.gun.style.top = parseInt(self.gun.style.top) - self.speedX + "px";
            clearInterval(gunTimer);
        }, 10);
        gunTimer = setInterval(this.moveGun, 10);

    };

    Plane.prototype.bombPlaneA = function () {
        var planeAArr=[];
        var self = this;
        var planeAx = parseInt(self.leftplane.style.left) + "px";
        var gunX = parseInt(self.gun.style.left) + "px";

        if (parseInt(planeAx) + parseInt(self.leftplane.style.width) >= parseInt(self.gun.style.left) &&
            parseInt(planeAx) <= parseInt(gunX) + parseInt(self.gun.style.width)) {
            self.contianer.removeChild(self.leftplane);
            planeAArr.push(self.leftplane);
        }
    };

    Plane.prototype.bombPlaneB = function () {
        var planeBArr=[];
        var self = this;
        var planeBx = parseInt(self.rightplane.style.left) + "px";
        var gunX = parseInt(self.gun.style.left) + "px";

        if (parseInt(planeBx) - parseInt(self.rightplane.style.width) >= parseInt(self.gun.style.left) &&
            parseInt(planeBx) <= parseInt(gunX) + parseInt(self.gun.style.width)) {
            self.contianer.appendChild(self.rightplane);
            planeBArr.push(self.rightplane);
        }
    };
    // Plane.prototype.drawDiv = function () {
    //     var index;
    //     var self = this;
    //     this.img = ["images/plane0001.png", "images/plane0002.png", "images/plane0003.png",
    //         "images/plane0004.png", "images/plane0005.png"];
    //     self.leftplane.style.background = url(this.img[index]);
    //     self.rightplane.style.background = url(this.img[index]);
    //     self.gun.style.background = url(this.img[index]);
    //
    // };

    window.Plane = Plane;
})();