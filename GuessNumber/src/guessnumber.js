var MainLayer = cc.Layer.extend({
    sprite:null,
    nums:new Array(10),
    rects:new Array(10),
    enter:null,
    enterrect:null,
    back:null,
    backrect:null,
    input:null,
    mesg:null,
    guess:"",
    dx:4,
    counter:0,
    answer:createAnswer(3),
    winner:null,
    loser:null,
    isRun:true,
    ctor:function () {

        this._super();

        var title = new cc.LabelTTF("猜數字遊戲","",48);
        title.x = cc.winSize.width / 2;
        title.y = cc.winSize.height * 7 / 8;
        title.setColor(cc.color(255,255,0));
        this.addChild(title,0,"mytitle");

        this.initLayout();

        this.initGame();

        this.setUpmymouse(this);

        this.scheduleUpdate(); //update()

        return true;
    },

    initLayout: function(){
        var frameCache = cc.spriteFrameCache;
        frameCache.addSpriteFrames(res.number_plist, res.number_png);

        //number key
        var px,py;
        for (i = 0; i<this.nums.length ;i++){
            this.nums[i] = new cc.Sprite("#number"+ i +".png");
            if(i==0){
                px = 3;
                py = 1;
            }
            else{
            px = (i-1) % 3 + 2;
            py = parseInt((i-1) / 3) + 2;
            }

            this.nums[i].x = cc.winSize.width * px /6;
            this.nums[i].y = cc.winSize.height * py /8;

            this.rects[i] = new cc.Rect(
                this.nums[i].x - this.nums[i].width/2,
                this.nums[i].y - this.nums[i].height/2,
                this.nums[i].width,
                this.nums[i].height
            );

            this.addChild(this.nums[i]);
        }

        //enter key
        this.enter = new cc.Sprite(res.enter_png);
        this.enter.x = cc.winSize.width * 4 / 6;
        this.enter.y = cc.winSize.height * 1 / 8;

        this.enterrect = new cc.Rect(
            this.enter.x - this.enter.width/2,
            this.enter.y - this.enter.height/2,
            this.enter.width,
            this.enter.height,
        );

        this.addChild(this.enter);


        //back key
        this.back = new cc.Sprite(res.back_png);
        this.back.x = cc.winSize.width * 2 / 6;
        this.back.y = cc.winSize.height * 1 / 8;

        this.backrect = new cc.Rect(
            this.back.x - this.back.width/2,
            this.back.y - this.back.height/2,
            this.back.width,
            this.back.height,
        );

        this.addChild(this.back);

        //input
        this.input = new cc.LabelTTF("","",48);
        this.input.x = cc.winSize.width * 3 / 6;
        this.input.y = cc.winSize.height * 6 / 8;
        this.addChild(this.input);

        //mesg
        this.mesg = new cc.LabelTTF("輸入三位數","",36);
        this.mesg.x = cc.winSize.width * 3 / 6;
        this.mesg.y = cc.winSize.height * 5 / 8;
        this.addChild(this.mesg);

        //winner
        this.winner = new cc.Sprite(res.winner_png);
        this.winner.x = cc.winSize.width / 2;
        this.winner.y = cc.winSize.height  / 2;
        this.addChild(this.winner);
        // this.winner.setVisible(false);

        //loser
        this.loser = new cc.Sprite(res.loser_png);
        this.loser.x = cc.winSize.width / 2;
        this.loser.y = cc.winSize.height  / 2;
        this.addChild(this.loser);
        // this.loser.setVisible(false);

    },

    initGame() {
      this.isRun = true;
      this.counter=0;
      this.answer=createAnswer(3);
      this.winner.setVisible(false);
      this.loser.setVisible(false);
      this.guess = '';
      this.input.setString("");
      this.mesg.setString(""); 

    },

    setUpmymouse: function(layer){
        if('mouse' in cc.sys.capabilities){
          // define listener object
          var mouseListener = {
              event: cc.EventListener.MOUSE,
              onMouseDown: function (event) {
                  var x = event.getLocationX();
                  var y = event.getLocationY();
                  // console.log(x + " x " + y);
                  var point = new cc.Point(x, y);

                  if (!layer.isRun){
                      // 開新局
                      layer.initGame();
                      return;
                  }

                  if (layer.guess.length>0){
                      // back
                      if (cc.rectContainsPoint(layer.backrect, point)) {
                          console.log("press:back");
                          layer.guess = layer.guess.substring(0, layer.guess.length-1);
                          layer.input.setString(layer.guess);
                          return;
                      }
                  }

                  if (layer.guess.length == 3){
                      // enter
                      if (cc.rectContainsPoint(layer.enterrect, point)) {
                          console.log("press:enter");
                          console.log(layer.answer + "==>" + layer.guess);
                          var result = checkAB(layer.answer,layer.guess);
                          layer.counter++;
                          layer.mesg.setString(checkAB(layer.answer,layer.guess));
                          layer.guess = "";

                          if (result === "3A0B"){
                              //winner
                              // layer.mesg.setString("WINNER");
                              layer.winner.setVisible(true);
                              layer.isRun = false;
                          }else if (layer.counter == 3){
                              //loser
                              layer.mesg.setString("Loser:" + layer.answer);
                              layer.loser.setVisible(true);
                              layer.isRun = false;
                          }else {
                              layer.mesg.setString(result);
                          }
                      }
                  }else{
                      // number
                      for (i = 0; i < layer.rects.length; i++) {
                          if (cc.rectContainsPoint(layer.rects[i], point)) {
                              console.log("press:" + i);
                              layer.guess += i;
                              layer.input.setString(layer.guess);

                              break;
                          }
                      }
                  }







              },
          };
          cc.eventManager.addListener(mouseListener,this);
        }
    },

    update: function () {
        var title = this.getChildByName("mytitle");
        if (title.x + title.width/2 >= cc.winSize.width ||
            title.x - title.width/2 <= 0){
            this.dx *= -1;

        }

        title.x += this.dx;
    }
});

var MainScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MainLayer();
        this.addChild(layer);
    }
});

//延伸樂透範例
function myLottery() {
    var n = new Array(49);
    for (var i=0;i<n.length;i++) n[i] = i+1;

    n = shuffle(n);
    var r = "";
    for (var i=0;i<6;i++){
        r += n[i] + ",";
    }
    return r;
}

function createAnswer(d) {
    var n = [0,1,2,3,4,5,6,7,8,9];
    n = shuffle(n);
    var r ="";
    for (var i=0;i<d;i++){
        r += n[i];
    }
    return r;
}

function shuffle(a) {
    var i,j,x;

    for(i=a.length;i;i--){
        j = parseInt(Math.random()*i); // 0-9
        x = a[i-1];
        a[i-1] = a[j];
        a[j] = x;
    }
    return a;
}

function checkAB(ans,guess){
    var a,b; a = b = 0;
    for (var i=0; i<guess.length;i++){
        if (ans.charAt(i) == guess.charAt(i)){
            a++;
        }else if (ans.indexOf(guess.charAt(i)) !== -1){
            b++;
        }
    }

    return a + "A" + b + "B";
}