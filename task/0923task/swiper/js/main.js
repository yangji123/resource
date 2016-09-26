/**
 * Created by Administrator on 2016/9/24 0024.
 */
(function () {
    var off = document.querySelector(".off");
    var lightBg = document.querySelector(".lightBg");
    var four = document.querySelector(".four");
    var clickGuide = document.querySelector("#clickGuide");
    var click = document.querySelector("#click");
    var cornerWall = document.querySelector("#cornerWall");
    var cornerTitle = document.querySelector("#cornerTitle");
    var music = document.querySelector("#music");
    var musicBtn = document.querySelectorAll(".musicBtn");
    var index = 0;
    off.addEventListener("click", function (event) {
        off.src = "img/lightOn.png";
        lightBg.src = "img/lightOnBg.jpg";
        four.style.backgroundColor = "#1a7fdc";
        clickGuide.src = "img/weKnowYou.png";
        click.style.marginLeft = "50px";
        cornerWall.style.display = "none";
        cornerTitle.style.display = "none";
    });
    for (var i = 0; i < musicBtn.length; i++) {
        (function (i) {
            musicBtn[i].addEventListener("click", function () {
                index += 1;
                if (index % 2 == 1) {
                    musicBtn[i].src = "img/musicBtnOff.png";
                    music.pause();
                } else {
                    musicBtn[i].src = "img/musicBtn.png";
                    music.play();
                }

            })
        })(i);
    }


})();