/* PubNub */
/* Draw on canvas */

var canvas = document.getElementById('drawCanvas');
var ctx = canvas.getContext('2d');
var color = 'yellowgreen';
   
canvas.width = Math.min(document.documentElement.clientWidth, window.innerWidth || 300);
canvas.height = Math.min(document.documentElement.clientHeight, window.innerHeight || 300);


ctx.strokeStyle = color;
ctx.lineWidth = '10';
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

$(document).on('click', '#width li a', function () {
    ctx.lineWidth=$(this).parent().attr('value');
 });
var isTouchSupported = 'ontouchstart' in window;
var isPointerSupported = navigator.pointerEnabled;
var isMSPointerSupported =  navigator.msPointerEnabled;
  
var downEvent = isTouchSupported ? 'touchstart' : (isPointerSupported ? 'pointerdown' : (isMSPointerSupported ? 'MSPointerDown' : 'mousedown'));
var moveEvent = isTouchSupported ? 'touchmove' : (isPointerSupported ? 'pointermove' : (isMSPointerSupported ? 'MSPointerMove' : 'mousemove'));
var upEvent = isTouchSupported ? 'touchend' : (isPointerSupported ? 'pointerup' : (isMSPointerSupported ? 'MSPointerUp' : 'mouseup'));

canvas.addEventListener(downEvent, startDraw, false);
canvas.addEventListener(moveEvent, draw, false);
canvas.addEventListener(upEvent, endDraw, false);

var channel = 'draw';

var pubnub = PUBNUB.init({
    publish_key: 'pub-c-b0111032-2103-4c52-a628-037979ab2842',
    subscribe_key: 'sub-c-298a1dac-0955-11e6-bbd9-02ee2ddab7fe',
});

pubnub.subscribe({
  channel: channel,
  callback: drawFromStream,
  presence: function(m){
    if(m.occupancy > 0){
      document.getElementById('occupancy').textContent = m.occupancy;
    }
  }
});

function publish(data) {
  pubnub.publish({
    channel: channel,
    message: data
  });
   }

function drawOnCanvas(color, plots) {
  ctx.strokeStyle=color;
  ctx.beginPath();
  ctx.moveTo(plots[0].x, plots[0].y);

  for(var i=1; i<plots.length; i++) {
    ctx.lineTo(plots[i].x, plots[i].y);
  }
  ctx.stroke();
}

function drawFromStream(message) {
  if(!message || message.plots.length < 1) 
    return;      
  drawOnCanvas(message.color, message.plots);
}

var isActive = false;
var plots = [];

function draw(e) {
  e.preventDefault();
  if(!isActive) return;

  var x = isTouchSupported ? (e.targetTouches[0].pageX - canvas.offsetLeft) : (e.offsetX || e.layerX - canvas.offsetLeft);
  var y = isTouchSupported ? (e.targetTouches[0].pageY - canvas.offsetTop) : (e.offsetY || e.layerY - canvas.offsetTop);

  plots.push({x: (x << 0), y: (y << 0)}); // round numbers for touch screens
  
  drawOnCanvas(color, plots);
}
  
  
  
  
    
function startDraw(e) {
  e.preventDefault();
  
  isActive = true;

}
  
function endDraw(e) {
  e.preventDefault();  
  isActive = false;
  
  publish({
    color:color,
    plots:plots
  });

  plots = [];
}

