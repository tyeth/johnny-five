var five = require("../lib/johnny-five.js");
var raspi = require("raspi-io");
var board = new five.Board({io: new raspi()});
var pir = [];


board.on("ready", function() {

  // Create a new `motion` hardware instance.
  var motion = new five.Motion('P1-23');
  pir[0] = new {motionSensor: motion, data: {}, lastValueTimestamp: -1, lastQuietTimestamp:-1, value: false,  }; //activity: (function(){return value;})()
  // "calibrated" occurs once, at the beginning of a session,
  motion.on("calibrated", function() {
    console.log("calibrated");
  });

  // "motionstart" events are fired when the "calibrated"
  // proximal area is disrupted, generally by some form of movement
  motion.on("motionstart", function() {
    console.log("motionstart");
    pir[0].lastValueTimestamp = Date().now;
    value = true;
  });

  // "motionend" events are fired following a "motionstart" event
  // when no movement has occurred in X ms
  motion.on("motionend", function() {
    console.log("motionend");
    pir[0].lastQuietTimestamp = Date().now;
    value = false;
  });

  // "data" events are fired at the interval set in opts.freq
  // or every 25ms. Uncomment the following to see all
  // motion detection readings.
  // motion.on("data", function(data) {
  //   console.log(data);
  // });
});
