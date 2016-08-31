/**
 * Created by Administrator on 2016/8/31 0031.
 */

$(function () {

    function generateRubbish(number) {
        for (var i=0;i<number;i++){
           $("body").append($("<div></div>").addClass("rubbish-black"));
            for (var j=0;j<i-5;j++){
                $("body").append($("<div></div>").addClass("rubbish-pink"));
            }
        }
    }
    generateRubbish(12);
    $(".rubbish-black").draggable({revert:"invalid"});
    $(".rubbish-pink").draggable({revert:"invalid"});

    $("#rubbish-one").droppable({
        accept:".rubbish-black",
        drop:function (event,ui) {
            $(".rubbish-black").draggable.remove();
        }
    });

    $("#rubbish-two").droppable({
        accept:".rubbish-pink",
        drop:function (event,ui) {
            $(".rubbish-pink").draggable.remove();
        }
    })

});