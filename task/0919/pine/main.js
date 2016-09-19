/**
 * Created by Administrator on 2016/9/19 0019.
 */
(function () {
    var canvas = document.getElementById("canvas");
    var zca = canvas.getContext("2d");
    var j1x = 0, j1y = 0, j1h = 0, j1w = 60;
    var j2x = 0, j2y = 0, j2h = 0, j2w = 0;
    var j3x = 0, j3y = 0, j3h = 0, j3w = 0;
    var gunzic = 0, gunzix = 60, gunziy = 330;
    var playx = 40, playy = 330, fenshu = 0;
    window.addEventListener("keydown", dokeydown, false);
    window.addEventListener("keyup", dokeyup, false);
    function start() {
        j1x = 0, j1y = 0, j1h = 0, j1w = 60;
        j2x = 0, j2y = 0, j2h = 0, j2w = 0;
        j3x = 0, j3y = 0, j3h = 0, j3w = 0;
        gunzic = 0, gunzix = 60, gunziy = 330;
        playx = 40, playy = 330, fenshu = 0;


        zca.fillStyle = "#ABCDEF";
        zca.fillRect(0, 0, 300, 500);
        /*第一块*/
        zca.fillStyle = "#000000";
        zca.fillRect(j1x, 350, j1w, 150);
        /*第二块*/
        j2x = Math.floor(Math.random() * 150 + 20) + j1x + j1w;
        j2w = Math.floor(Math.random() * 50 + 20);
        zca.fillRect(j2x, 350, j2w, 150);
        /*第三块*/
        j3x = Math.floor(Math.random() * 150 + 20) + j2x + j2w;
        j3w = Math.floor(Math.random() * 50 + 20);
        zca.fillRect(j3x, 350, j3w, 150);
        /*小红块*/
        zca.fillStyle = "red";
        zca.fillRect(playx, playy, 20, 20);
        huafenshu();
    }

    function dokeydown(e) {
        var keycod = e.keyCode || e.which;
        if (keycod === 32) {
                gunziy = gunziy - 5;
                gunzic = 350 - gunziy;
                // zca.strokeStyle = "#9933cc";
                // zca.lineWidth = 3;
                // zca.moveTo(playx + 20, playy + 20);
                // zca.lineTo(gunzix, gunziy);
                zca.beginPath();
                zca.fillRect(playx+20,playy+20,3,gunziy-playy-20);
                zca.fillStyle="green";
                zca.fill();
                zca.stroke();
        } else if (keycod === 13) {
            start();
        }
    }

    function dokeyup(e) {
        var keycod = e.keyCode || e.which;
        if (keycod === 32) {
            gunziy = 350;
            zca.beginPath();
            zca.strokeStyle = "#000000";
            zca.lineWidth = 4;
            zca.moveTo(playx + 20, playy + 20);
            zca.lineTo(playx + 20 + gunzic, gunziy);
            zca.stroke();
            moveplay();
        }
    }

    function moveplay() {
        zca.beginPath();
        zca.strokeStyle = "#ABCDEF";
        zca.fillStyle = "#ABCDEF";
        zca.fillRect(playx, playy, 20, 20);
        zca.stroke();

        zca.beginPath();
        zca.strokeStyle = "red";
        zca.fillStyle = "red";
        playx = playx + 5;
        zca.fillRect(playx, playy, 20, 20);
        zca.stroke();

        if (playx <= gunzic + j1w - 20) {
            setTimeout(moveplay, 100);
        } else {
            if (j1w + gunzic < (j2x + j2w) && j1w + gunzic > j2x) {
                zca.beginPath();
                zca.strokeStyle = "#ABCDEF";
                zca.fillStyle = "#ABCDEF";
                zca.fillRect(playx, playy, 20, 20);
                zca.stroke();

                zca.beginPath();
                zca.strokeStyle = "#red";
                zca.fillStyle = "red";
                playx = j2x + j2w - 20;
                zca.fillRect(playx, playy, 20, 20);
                zca.stroke();
                fenshu++;
                moveall();
            } else {
                zca.fillStyle = "#333";
                zca.font = "20px 宋体";
                zca.fillText("最终得分" + fenshu, 100, 80);
                zca.fillText("GAME OVER", 100, 100);
            }
        }

    }

    function moveall() {
        zca.fillStyle = "#ABCDEF";
        zca.fillRect(0, 0, 300, 500);
        zca.fillStyle = "#000000";
        j1x--;
        j2x--;
        j3x--;
        playx--;
        zca.fillRect(j1x, 350, j1w, 150);
        zca.fillRect(j2x, 350, j2w, 150);
        zca.fillRect(j3x, 350, j3w, 150);
        zca.fillStyle = "red";
        zca.fillRect(playx, playy, 20, 20);
        huafenshu();
        if (j2x >= 0) {
            setTimeout(moveall, 3)
        } else {
            change();
        }
    }

    function change() {
        j1x = j2x;
        j1w = j2y;
        j2x = j3x;
        j2w = j3y;
        j3x = Math.floor(Math.random() * 150 + 20) + j2x + j2w;
        j3w = Math.floor(Math.random() * 50 + 20);
        gunzix = j1w;
    }

    function huafenshu() {
        zca.fillStyle = "#fff";
        zca.font = "60px 宋体";
        zca.fillText(fenshu, 130, 50)

    }


    start();


})();

