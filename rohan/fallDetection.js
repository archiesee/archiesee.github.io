var x = 0, y = 0,
    vx = 0, vy = 0,
  ax = 0, ay = 0;
if (window.DeviceMotionEvent != undefined) {
  window.ondevicemotion = function(e) {
    ax = event.accelerationIncludingGravity.x * 5;
    ay = event.accelerationIncludingGravity.y * 5;
    document.getElementById("accelerationX").innerHTML = e.accelerationIncludingGravity.x;
    document.getElementById("accelerationY").innerHTML = e.accelerationIncludingGravity.y;
    document.getElementById("accelerationZ").innerHTML = e.accelerationIncludingGravity.z;
    // detects when the user falls using free fall
    if (Math.sqrt((e.accelerationIncludingGravity.x * e.accelerationIncludingGravity.x) + (e.accelerationIncludingGravity.y * e.accelerationIncludingGravity.y) + (e.accelerationIncludingGravity.z * e.accelerationIncludingGravity.z)) <= 5) {
      
        // post help message w info link
        // requires user to say ok
        // FB.ui({
        //    method: 'share',
        //    mobile_iframe: true,
        //    quote: 'I feel and I need help',
        //    href: 'http://www.health.gov.au/internet/publications/publishing.nsf/Content/dff-toc~dff-surroundings~dff-surroundings-getup'
        // }, function(response){});
        
      }
    // rotation rate and orientation
    if ( e.rotationRate ) {
      document.getElementById("rotationAlpha").innerHTML = e.rotationRate.alpha;
      document.getElementById("rotationBeta").innerHTML = e.rotationRate.beta;
      document.getElementById("rotationGamma").innerHTML = e.rotationRate.gamma;
    }   
  }
  setInterval( function() {
    var landscapeOrientation = window.innerWidth/window.innerHeight > 1;
    if ( landscapeOrientation) {
      vx = vx + ay;
      vy = vy + ax;
    } else {
      vy = vy - ay;
      vx = vx + ax;
    }
    vx = vx * 0.98;
    vy = vy * 0.98;
    y = parseInt(y + vy / 50);
    x = parseInt(x + vx / 50);
    
  }, 25);
}

function emailHelp(){
  textToVoice("Emailing for help right now");
  // Avi will do this
}