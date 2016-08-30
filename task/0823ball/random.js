/**
 * Created by Administrator on 2016/8/23 0023.
 */

(function () {
    
    function DrawBall() {
        this.container=document.querySelector("#container");

        this.htmlNode=document.createElement("div");
        this.htmlNode.style.width="50px";
        this.htmlNode.style.height="50px";
        this.htmlNode.style.left=Math.random()*500+"px";
        this.htmlNode.style.top=Math.random()*500+"px";
        this.htmlNode.style.backgroundColor="black";
        this.htmlNode.style.borderRadius="50%";
        this.htmlNode.style.position="absolute";

        this.container.appendChild(this.htmlNode);



    }
    
    DrawBall.prototype.getHtmlNode=function () {
        return this.htmlNode;
    };
    DrawBall.prototype.flight=function () {
        var speedX=(Math.random()-0.5)*10;
        var speedY=(Math.random()-0.5)*10;
        var self=this;
        setInterval(function () {
            self.htmlNode.style.left=parseInt(self.htmlNode.style.left)+speedX+"px";
            self.htmlNode.style.top=parseInt(self.htmlNode.style.left)+speedY+"px";            
        },10);
    }
    window.DrawBall=DrawBall;
})();