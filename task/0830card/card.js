/**
 * Created by liuyujing on 16/8/30.
 */
$(function () {

    function Card(width, height) {
        var self = {};

        var htmlNode;
        var divA, divB;
        var aVisible = true;

        self.getHtmlNode = function () {
            return htmlNode;
        };

        self.getWidth = function () {
            return width;
        };

        self.getHeight = function () {
            return height;
        };

        function addListeners(from, to) {
            self.widthPercent = 100;
            self.speed = self.widthPercent / 20;
            self.id = setInterval(function () {
                aVisible = true;
                self.widthPercent -= self.speed;
                from.css("width", self.widthPercent + "%");
                if (self.widthPercent <= 0) {
                    clearInterval(self.id);
                    from.css("display", "none");

                    to.css("display", "block");
                    to.css("width", "0");
                    self.id = setInterval(function () {
                        aVisible = false;
                        self.widthPercent += self.speed;

                        if (self.widthPercent >= 100) {
                            self.widthPercent = 100;
                            clearInterval(self.id);
                        }
                        to.css("width", self.widthPercent + "%");
                    }, 20);
                }
            }, 20);
        }

        function turnA() {
            addListeners(divB, divA);
        }

        function turnB() {
            addListeners(divA, divB);
        }

        function init() {
            htmlNode = $("<div></div>").addClass("card");
            htmlNode.css("width", width + "px");
            htmlNode.css("height", height + "px");
            htmlNode.css("overflow", "hidden");

            divA = $("<div></div>").addClass("div-a");
            htmlNode.append(divA);

            divB = $("<div></div>");
            divB.addClass("div-b");
            htmlNode.append(divB);
            aVisible = true;
            htmlNode.bind("click", function () {
                if (aVisible) {
                    turnB();
                } else {
                    turnA();
                }
            });
        }

        init();
        return self;
    }

    window.Card = Card;
});


