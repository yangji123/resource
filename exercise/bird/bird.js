/**
 * Created by Administrator on 2016/9/18 0018.
 */
(function () {

    var ctx;
    var birds = ["imag/0.gif", "imag/1.gif", "imag/2.gif"];
    var index = 0;
    var bg = new SS(0, 0, 400, 580, "imag/bg.png");
    var gr = new SS(0, 520, 400, 50, "imag/ground.png");
    var uP = new SS(0, 0, 100, 200, "imag/pipe.png");
    var dP = new SS(0, 400, 100, 120, "imag/pipe.png");
    var bird = new Bird(10, 210, 45, 45);
    var bv = 10;//小鸟初速度
    var g = 10;//重力加速度
    var pv = 10;//管子初速度
    var star = false;//得分的计时启动器
    var score = 0;//计算得分
    var timer;//计时器
    var hover = false;//判断游戏是否结束
    var count = 1;//计算关卡

    //开始函数
    window.onload=function() {
        var can = document.getElementById("canvas");
        ctx = can.getContext('2d');
        hover = false;
        document.onkeyup = keyup;
        document.onclick = reAction;
        draw();
        timer = window.setInterval(draw, 80);
    }
    //	进入绘制函数
    function draw() {
        bg.draw(1);
        gr.draw(1);
        uP.draw(2);
        dP.draw(3);
        bird.draw();
        cal();
    }

    //重复计算和碰撞检测
    function cal() {
        //碰撞检测（1）天空（2）地面（3）上柱子（4）下柱子
        var acT = bird.y <= 0;

        var acG = bird.y + bird.height >= gr.y;

        var acU = ((bird.x + bird.width >= uP.x) && (bird.x + bird.width <= uP.x + uP.width)
            && (bird.y >= uP.y) && (bird.y <= uP.y + uP.height))
            || ((bird.x >= uP.x) && (bird.x <= uP.x + uP.width)
            && (bird.y >= uP.y) && (bird.y <= uP.y + uP.height));

        var acD = ((bird.x + bird.width >= dP.x) && (bird.x + bird.width <= dP.x + dP.width)
            && (bird.y + bird.height >= dP.y) && (bird.y + bird.height <= dP.y + dP.height))
            || ((bird.x >= dP.x) && (bird.x <= dP.x + dP.width)
            && (bird.y + bird.height >= dP.y) && (bird.y + bird.height <= dP.y + dP.height));

        if (acT || acG || acU || acD) {
            clearInterval(timer);
            hover = true;
            ctx.font = "bold 32px Avenir";
            ctx.fillStyle = "black";
            ctx.fillText("Game Over! ", 100, 250);
            ctx.fillText("score: " + score + "  ", 100, 290);
        }

//重复计算
        bird.y += (bv + g) / 2;
        if (uP.x + uP.width > 0) {
            uP.x -= pv;
            dP.x -= pv;
        } else {
            uP.x = 400;
            dP.x = 400;
            uP.height = Math.random() * 200 + 100;
            dP.y = uP.height + 150;
            dP.height = 570 - dP.y - 50;
            star = true;
        }
        if (star == true && bird.x > uP.x + uP.width) {
            score++;
            star = false;
            if (score > 0 && score % 5 == 0) {
                g += 2;
                pv += 2;
                count++;
            }
        }
        ctx.font = "bold 32px Avenir";
        ctx.fillStyle = "pink";
        ctx.fillText("Pass " + count, 150, 50);
    }

    //空格键控制小鸟的下落
    function keyup(e) {
        //解决浏览器兼容问题
        e = e || event;
        var currentkey = e.keycode || e.which || e.charcode;
        switch (currentkey) {
            case 32:
                bird.y -= 50;
                if (bird.y < 0) {
                    bird.y = 0;
                } else if ((bird.x >= uP.x) && (bird.x + bird.width <= uP.x + uP.width) && (bird.y <= uP.y + uP.height)) {
                    bird.y = uP.y + uP.height;
                }
        }
    }

    //重新启动
    function reAction() {
        if (hover == true) {
            window.location.reload();
            hover = false;
        }
    }

    //绘制的构造函数
    function SS(x, y, width, height, src) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        var image = new Image();
        image.src = src;
        this.image = image;
        this.draw = generateDraw;

    }

    //	进行对对象进行绘制 背景图、地面、上下柱子
    function generateDraw(n) {
        if (n == 1) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else if (n == 2) {
            ctx.drawImage(this.image, 150, 500, 150, 800, this.x, this.y, this.width, this.height);
        } else if (n == 3) {
            ctx.drawImage(this.image, 0, 500, 150, 500, this.x, this.y, this.width, this.height);
        }
    }

    //小鸟的构造函数
    function Bird(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.draw = birdDraw;

    }

    //小鸟的绘制
    function birdDraw() {
        var img = new Image();
        img.src = birds[index % 3];
        this.img = img;
        index++;
        ctx.drawImage(img, this.x, this.y, this.width, this.height);
    }

})();