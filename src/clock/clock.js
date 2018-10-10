;(function(w,d){
  'use strict';


  var Clock = function(options){
    this.init(options);
    console.log('Remote type is not available');
    this.isLocal?this.clockRunLocal():this.clockRunRemote();
  };

  Clock.prototype = {
    test:function(){
      console.log('test');
    },
    init:function(options){
      //配置参数
      var options = (this.options = this.extend(Clock.DEFAULTS,options));

      var transitions = options.transitions;

      //包裹元度（div）id
      var id = options.id;

      //时钟的大小
      var size = options.size;

      //包裹div
      var wrap = (this.el = d.getElementById(id));
      wrap.style.width  = size + 'px';
      wrap.style.height = size + 'px';
      wrap.style.margin = transitions ? '35px auto' : '15px auto';

      //canvas元素
      var clock = (this.clock = d.createElement('canvas'));
      clock.setAttribute('width', size + 'px');
      clock.setAttribute('height', size + 'px');

      //把canvas添加到包裹元素里面
      wrap.appendChild(clock);

      var isNotRome = options.numberType === 'Arabic' || options.numberType !== 'Rome';
      this.hours = (isNotRome?[3,4,5,6,7,8,9,10,11,12,1,2]:['Ⅲ','Ⅳ','Ⅴ','Ⅵ','Ⅶ','Ⅷ','Ⅸ','Ⅹ','Ⅺ','Ⅻ','Ⅰ','Ⅱ']);
      var fontFamily = (isNotRome?'Arial':'Times New Roman');
      var fontSize = (isNotRome?size * 0.1:size * 0.08);

      this.ctx = this.clock.getContext('2d');
      this.r = size * 0.5;
      this.DPI = 2 * Math.PI;

      //圆圈的宽和半径
      this.borderWidth = options.borderWidth || size * 0.05;
      this.circleR = this.r - this.borderWidth * 0.5;

      //数字半半径和字体大小
      this.numberR = 0.35 * size;
      this.fontStyle = 'normal normal bold ' + fontSize + 'px ' + fontFamily;

      //时刻表点的半径和大小
      this.timeDotR = 0.44 * size;
      this.timeDotSize = size * 0.01;

      //中心点的大小
      this.centerDotSize = size * 0.02;

      this.ha = size * 0.05;//时针尾部长度
      this.ma = size * 0.06;//分针尾部长度

      this.h  = size * 0.025;//时针粗细
      this.m  = size * 0.015;//分针粗细
      this.s  = size * 0.01; //秒针尾部宽度*0.5
      this._s = size * 0.075;//秒针尾部长度

      this.isLocal = (options.type === 'local'?true:false);
      transitions && this.animate();
    },

    //画背景
    drawBackground: function(){
      var ctx = this.ctx, r = this.r,DPI = this.DPI,borderWidth = this.borderWidth , circleR = this.circleR , numberR = this.numberR,
          fontStyle = this.fontStyle, timeDotR = this.timeDotR,timeDotSize = this.timeDotSize,options = this.options;
      ctx.save();
      //画圆
      ctx.translate(r,r);
      ctx.beginPath();
      ctx.lineWidth = borderWidth;
      ctx.strokeStyle  = options.borderColor;
      ctx.fillStyle  = options.backgroundColor;
      ctx.arc(0,0,circleR,0,DPI,false);
      ctx.stroke();
      ctx.fill();

      //画时刻表点
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      var shape = options.hourDotShape;
      for(var i = 0 ; i < 60 ; i++){
        var t = (i % 5 === 0);
        var color = t ? options.hourDotColor : options.minuteDotColor;
        var factor = t ? 0.93 : 0.96;
        var w = t ? timeDotSize * 1.8 : timeDotSize * 1.5;

        var rad = DPI /60 * i;
        var x = Math.cos(rad) * timeDotR;
        var y = Math.sin(rad) * timeDotR;

        ctx.beginPath();

        if(shape === 'square'){
          ctx.strokeStyle = color;
          ctx.lineWidth = w;
          ctx.moveTo(x,y);
          ctx.lineTo(x * factor,y * factor);
          ctx.stroke();
        }else{
          ctx.fillStyle = color;
          ctx.arc(x,y,timeDotSize,0,DPI,false);
          ctx.fill();
        }
      }


      //画数字
      var hours = this.hours;
      ctx.font = fontStyle;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = options.numberColor;
      hours.forEach(function(number,i){
        var rad = DPI /12 * i;
        var x = Math.cos(rad) * numberR;
        var y = Math.sin(rad) * numberR;
        ctx.fillText(number,x,y);
      });
    },

    //画时针
    drawHour: function (hour,minute){
      var DPI = this.DPI ,ctx = this.ctx,r = this.r,ha = this.ha,h = this.h;
      var rad = DPI / 12 * hour;
      var mrad = DPI / 12 / 60 * minute;

      ctx.save();
      ctx.beginPath();
      ctx.rotate(rad + mrad);
      ctx.lineWidth = h;
      ctx.lineCap = 'round';
      ctx.strokeStyle = this.options.hourPointerColor;
      ctx.moveTo(0,ha);
      ctx.lineTo(0,-r * 0.45);
      ctx.stroke();
      ctx.restore();
    },

    //画分针
    drawMinute: function(minute){
      var DPI = this.DPI ,ctx = this.ctx,r = this.r,ma = this.ma,m = this.m;

      var rad = DPI / 60 * minute;

      ctx.save();
      ctx.beginPath();
      ctx.rotate(rad);
      ctx.lineWidth = m;
      ctx.lineCap = 'round';
      ctx.strokeStyle = this.options.minutePointerColor;
      ctx.moveTo(0,ma);
      ctx.lineTo(0,-r * 0.65);
      ctx.stroke();
      ctx.restore();
    },

    //画秒针
    drawSecond: function(second){

      var DPI = this.DPI ,ctx = this.ctx,r = this.r,_s = this._s,s = this.s;

      var rad = DPI / 60 * second;

      ctx.save();
      ctx.beginPath();
      ctx.rotate(rad);
      ctx.lineWidth = 1;
      ctx.lineCap = 'round';
      ctx.fillStyle = this.options.secondPointerColor;
      ctx.moveTo(-s,_s);
      ctx.lineTo(0,_s+3);
      ctx.lineTo(s,_s);
      ctx.lineTo(s * 0.1,-r * 0.8);
      ctx.lineTo(-s * 0.1,-r * 0.8);
      ctx.fill();
      ctx.restore();
    },

    //画中心圆点
    drawDot: function(){
      var ctx = this.ctx, DPI = this.DPI,centerDotSize = this.centerDotSize;

      ctx.beginPath();
      ctx.fillStyle = this.options.centerDotColor;
      ctx.arc(0,0,centerDotSize,0,DPI,false);
      ctx.fill();
    },

    //画一个完整的时刻（本地获取时间）
    drawLocal: function (_this){
      var ctx = _this.ctx,options = _this.options;
      ctx.clearRect(0,0,options.size,options.size);
      _this.drawBackground();
      var date = new Date();
      var h = date.getHours();
      var m = date.getMinutes();
      var s = date.getSeconds();
      _this.drawHour(h,m,s);
      _this.drawMinute(m,s);
      _this.drawSecond(s);
      _this.drawDot();
      ctx.restore();
      date = null;
    },

    //画一个完整的时刻(远程获取时间)
    drawRemote: function (_this){
      var ctx = _this.ctx,options = _this.options;
      ctx.clearRect(0,0,options.size,options.size);
      _this.drawBackground();
      var date = new Date();
      var h = date.getHours();
      var m = date.getMinutes();
      var s = date.getSeconds();
      _this.drawHour(h,m,s);
      _this.drawMinute(m,s);
      _this.drawSecond(s);
      _this.drawDot();
      ctx.restore();
      date = null;
    },

    //让时钟跑起来（本地获取时间）
    clockRunLocal:function(){
      var _this = this;
      w.setInterval(function(){
        _this.drawLocal(_this);
      },1000);
    },

    //让时钟跑起来（远程获取时间）
    clockRunRemote:function(){
      var _this = this;
      w.setInterval(function(){
        _this.drawRemote(_this);
      },1000);
    },

    animate:function(){
      var el = this.el,transitions = this.options.transitions;
      el.addEventListener('click', function(){
        this.setAttribute('class', 'animated '+transitions);
      });

      el.addEventListener('webkitAnimationEnd', removeAnimate);
      el.addEventListener('animationend', removeAnimate);

      function removeAnimate(){
        el.removeAttribute('class');
      }
    },

    extend:function(target,source){
      for (var i in source) {
        target[i] = source[i]?source[i]:target[i];
      }
      return target;
    }
  };

  Clock.DEFAULTS = {
    id:'clock',
    size:400,
    type:'local',//'remote'
    numberType:'Arabic',//'Rome'
    borderWidth:null,
    borderColor:'#000',
    hourDotColor:'#000',
    hourDotShape:'round',// round：圆 ，square:方
    minuteDotColor:'#ccc',
    hourPointerColor:'#000',
    minutePointerColor:'#000',
    secondPointerColor:'#890518',
    centerDotColor:'#000',
    backgroundColor: '#fff',
    numberColor:'#000',
    transitions:'',//bounce
    timezone:''
  };

  if(w.hasOwnProperty('Clock')){
    throw 'window has a Clock Property,please check! ';
  }
  w.Clock = Clock;

  if(module.exports){
    module.exports = Clock
  }

})(window,document);
