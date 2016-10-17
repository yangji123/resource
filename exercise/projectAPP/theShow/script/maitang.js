/**
 * Created by Administrator on 2016/9/26 0026.
 */
$(function () {

    //轮播图
    $("<div></div>").appendTo(".random").addClass("randomImg")
        .append(
            "<img src='images/r1.png'>" +
            "<img src='images/r2.png'>" +
            "<img src='images/r3.png'>" +
            "<img src='images/r4.png'>");
    function random() {
        $(".randomImg").animate({left: "-100%"}, 1000, function () {
            $(this).css({left: "0px"});
            $(this).children("img").first().remove().clone(true).appendTo(".randomImg");
        });
    }

    var startRandom = setInterval(random, 3000);
    $(".random").hover(function () {
        clearInterval(startRandom);
    }, function () {
        startRandom = setInterval(random, 3000);
    });

    //选项卡
    $(".wei").click(function () {
        $(".coupon").hide();
        $($(".coupon")[$(this).index()]).show();
    });

    //注册
    $('#submitRegister').on('click', function (event) {
        event.preventDefault();
        /* Act on the event */
        $.ajax({
            url: 'http://datainfo.duapp.com/shopdata/userinfo.php',
            type: 'get',
            dataType: 'json',
            data: {
                userID: $("#userRegister").val(),
                password: $("#passwordRegister").val(),
                status: 'register'
            }
        }).done(function (data) {
            console.log(data);
            window.location.href = '#login';
        }).fail(function () {
            console.log("error");
        }).always(function () {
            console.log("complete");
        });
    });

    //登录
    $('#submitLogin').on('click', function (event) {
        event.preventDefault();
        /* Act on the event */
        $.ajax({
            url: 'http://datainfo.duapp.com/shopdata/userinfo.php',
            type: 'get',
            dataType: 'json',
            data: {
                userID: $("#userLogin").val(),
                password: $("#passwordLogin").val(),
                status: 'login'
            }
        }).done(function (data) {
            console.log(data);
            window.location.href = '#myShow';
            //跳转直接刷新
            window.location.reload();
            //存储userID
            sessionStorage.setItem('userID', $("#userLogin").val());
        }).fail(function () {
            console.log("error");
        }).always(function () {
            console.log("complete");
        });
    });

    //退出登录
    $('.userOut').on("click", function () {
        sessionStorage.removeItem('userID');
        window.location.href = '#myShow';
        window.location.reload();
    });

    //判断userID 是否已储存
    function getValue(userID) {
        var value = sessionStorage.getItem(userID);
        if (value == " " || undefined) {
            $("#getUser").text("未知");
        } else {
            $("#getUser").text(sessionStorage.getItem(userID));
        }
    }

    getValue("userID");

    //获取商品或列表
    $(document).ready(function () {
        $.ajax({
            url: "http://datainfo.duapp.com/shopdata/getGoods.php",
            dataType: "JSONP",
            success: function (data) {
                var i = 0;
                for (i in data) {
                    var nameView = $("<div class='container'></div>");
                    $(".goodsList").append(nameView);
                    $(".container").eq(i).append("<p class='txt'></p><img src='' class='pic'/>" +
                        "<p class='priceHome'></p><p class='discountHome'></p><img src='images/shoppingCar.png' class='shoppingCar'>");
                    $('.txt').eq(i).text(data[i].goodsName);
                    $('.pic').eq(i).attr("src", data[i].goodsListImg);
                    $('.priceHome').eq(i).text("￥" + data[i].price);
                    $('.discountHome').eq(i).text(parseFloat(data[i].discount) + "折");
                }
                $('.shoppingCar').on('click', function () {
                    if (sessionStorage.getItem('userID') == " " || undefined) {
                        alert("请先登录账号再添加购物车！");
                    } else {
                        $(document).ready(function () {
                            $.ajax({
                                url: "http://datainfo.duapp.com/shopdata/getGoods.php",
                                dataType: "JSONP",
                                success: function (data) {
                                    for (i in data) {
                                        $(".classifyCar").append(nameView);
                                        $(".container").eq(i).append("<p class='txt'></p><img src='' class='pic'/>" +
                                            "<p class='priceHome'></p><p class='discountHome'></p><img src='images/shoppingCar.png' class='shoppingCar'>");
                                        $('.txt').eq(i).text(data[i].goodsName);
                                        $('.pic').eq(i).attr("src", data[i].goodsListImg);
                                        $('.priceHome').eq(i).text("￥" + data[i].price);
                                        $('.discountHome').eq(i).text(parseFloat(data[i].discount) + "折");
                                    }
                                    console.log(data);
                                },
                                error: function () {
                                    alert("错误！");
                                }
                            });
                        })
                    }
                });
            },
            error: function () {
                alert("错误！");
            }
        });
    });
    
    //获取分类
    $(document).ready(function () {
        $.ajax({
            url: "http://datainfo.duapp.com/shopdata/getclass.php",
            dataType: "JSON",
            success: function (data) {
                var i = 0;
                for (i in data) {
                    $(".classify").append("<li><a href='#' class='classifyLi'></a></li>");
                    $('.classifyLi').eq(i).append(data[i].className);
                    $('.classifyLi').eq(i).css({color: "black"});
                }
                console.log(data);
            },
            error: function () {
                alert("错误！");
            }
        });
    })
});

