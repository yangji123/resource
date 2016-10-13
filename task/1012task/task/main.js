/**
 * Created by Administrator on 2016/10/12 0012.
 */
(function () {

    var target = document.querySelector("#target");
    var audio = document.querySelector("audio");
    target.addEventListener("dragover", function (e) {
        e.preventDefault();
    });
    target.addEventListener("drop", function (e) {
        e.preventDefault();
        var files = e.dataTransfer.files;
        var reader;

        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];

                switch (file.type) {
                    case "audio/mp3":
                        reader = new FileReader();
                        reader.onload = function () {
                            // target.appendChild() = "<audio  controls='controls' src='" + reader.result + "'></audio>";
                        };
                        reader.readAsDataURL(file);
                        var audioText = document.createElement("div");
                        audioText.innerHTML = file.name;
                        audioText.className = "audioText";
                        target.appendChild(audioText);

                        audioText.onclick = function () {
                            audio.src = reader.result;
                        };
                        break;
                    default:
                        console.log(file);
                        break;
                }
            }
        }
    });
})();