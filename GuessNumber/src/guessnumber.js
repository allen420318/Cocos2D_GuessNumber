var MainLayer = cc.Layer.extend({
    sprite:null,
    nums:new Array(10),
    rects:new Array(10),
    enter:null,
    back:null,
    input:null,
    mesg:null,
    guess:"",
    dx:4,
    ctor:function () {

        this._super();

        var title = new cc.LabelTTF("猜數字遊戲","",48);
        title.x = cc.winSize.width / 2;
        title.y = cc.winSize.height * 7 / 8;
        title.setColor(cc.color(255,255,0));
        this.addChild(title,0,"mytitle");

        this.initLayout();

        this.setUpmymouse(this);

        this.scheduleUpdate(); //update()

        return true;
    },

    initLayout: function(){
        var frameCache = cc.spriteFrameCache;
        frameCache.addSpriteFrames(res.number_plist, res.number_png);

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
        this.addChild(this.enter);

        //back key
        this.back = new cc.Sprite(res.back_png);
        this.back.x = cc.winSize.width * 2 / 6;
        this.back.y = cc.winSize.height * 1 / 8;
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

                  for (i = 0; i < layer.rects.length; i++) {
                      if (cc.rectContainsPoint(layer.rects[i], point)) {
                          console.log("press:" + i);
                          layer.guess += i;
                          layer.input.setString(layer.guess);

                          break;
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

