var five = require("../lib/johnny-five.js"),
  sinon = require("sinon"),
  MockFirmata = require("./mock-firmata"),
  Wii = five.Wii,
  Board = five.Board;

function newBoard() {
  return new Board({
    io: new MockFirmata(),
    debug: false,
    repl: false
  });
}

exports["Nunchuk"] = {

  setUp: function(done) {

    this.clock = sinon.useFakeTimers();
    this.board = newBoard();

    this.nunchuk = new Wii.Nunchuk({
      board: this.board,
      freq: 50
    });

    this.sendI2CReadRequest = sinon.spy(this.nunchuk.io, "sendI2CReadRequest");

    this.instance = [{
      name: "threshold"
    }, {
      name: "freq"
    }, {
      name: "holdtime"
    }];

    done();
  },

  shape: function(test) {
    test.expect(this.instance.length);

    this.instance.forEach(function(property) {
      test.notEqual(typeof this.nunchuk[property.name], "undefined");
    }, this);

    test.done();
  },

  tearDown: function(done) {
    this.clock.restore();
    this.sendI2CReadRequest.restore();
    done();
  },

  data: function(test) {
    test.expect(1);

    this.nunchuk.on("data", function() {
      test.ok(true);
    });
    this.clock.tick(50);
    test.done();
  },

  "joystick change": function(test) {
    test.expect(1);

    this.clock.tick(100);
    var callback = this.sendI2CReadRequest.args[0][2];

    var spy = sinon.spy();

    this.nunchuk.joystick.on("change", spy);

    callback([31,127,149,88,134,135]);
    this.clock.tick(50);

    callback([199,127,156,92,151,127]);
    this.clock.tick(50);

    test.ok(spy.called);
    test.done();
  },

  "accelerometer change": function(test) {
    test.expect(1);

    this.clock.tick(100);
    var callback = this.sendI2CReadRequest.args[0][2];

    var spy = sinon.spy();

    this.nunchuk.accelerometer.on("change", spy);

    callback([31,127,149,88,134,135]);
    this.clock.tick(50);

    callback([199,127,156,92,151,127]);
    this.clock.tick(50);

    test.ok(spy.called);
    test.done();
  }
};

exports["Classic"] = {
  setUp: function(done) {

    this.clock = sinon.useFakeTimers();
    this.board = newBoard();

    this.classic = new Wii.Classic({
      board: this.board,
      freq: 50
    });

    this.sendI2CReadRequest = sinon.spy(this.classic.io, "sendI2CReadRequest");

    this.instance = [{
      name: "threshold"
    }, {
      name: "freq"
    }, {
      name: "holdtime"
    }];
    done();
  },

  tearDown: function(done) {
    this.clock.restore();
    this.sendI2CReadRequest.restore();
    done();
  },

  shape: function(test) {
    test.expect(this.instance.length);

    this.instance.forEach(function(property) {
      test.notEqual(typeof this.classic[property.name], "undefined");
    }, this);

    test.done();
  },

  data: function(test) {
    test.expect(1);

    this.classic.on("data", function() {
      test.ok(true);
    });
    this.clock.tick(50);
    test.done();
  }
};