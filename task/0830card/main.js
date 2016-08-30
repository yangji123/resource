/**
 * Created by liuyujing on 16/8/30.
 */

$(function () {

    for (var i=0;i<100;i++){
        window.console.log(Card(100,100).getHtmlNode);
        $("body").append(Card(100,100).getHtmlNode);
    }

});
