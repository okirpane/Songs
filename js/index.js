var angle = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  diameter = height - 10;
  noStroke();
  fill(0, 204, 255);
}

function draw() {
  background(0);

  var d1 = 10 + sin(angle) * diameter / 2 + diameter / 2;
  var d2 = 10 + sin(angle + PI / 2) * diameter / 2 + diameter / 2;
  var d3 = 10 + sin(angle + PI) * diameter / 2 + diameter / 2;

  ellipse(0, height / 2, d1, d1);
  ellipse(width / 2, height / 2, d2, d2);
  ellipse(width, height / 2, d3, d3);

  angle += 0.005;
}

var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();var EQUALIZER_CENTER_FREQUENCIES = [
100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250,
1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000];


function initEqualizerUI(container, equalizer) {
  equalizer.forEach(function (equalizerBand, index) {
    var frequency = equalizerBand.frequency.value;

    var wrapper = document.createElement('div');
    var slider = document.createElement('div');
    var label = document.createElement('label');

    wrapper.classList.add('slider-wrapper');
    slider.classList.add('slider');
    label.textContent = frequency >= 500 ? frequency / 500 + 'K' : frequency;

    noUiSlider.create(slider, {
      start: 0,
      range: { min: -12, max: 12 },
      step: 0.1,
      direction: 'rtl',
      orientation: 'vertical' });

    slider.noUiSlider.on('update', function (_ref) {var _ref2 = _slicedToArray(_ref, 1),value = _ref2[0];
      var gain = +value;
      equalizerBand.gain.value = gain;
    });

    wrapper.appendChild(slider);
    wrapper.appendChild(label);
    container.appendChild(wrapper);
  });
}

function makeSynth() {
  var envelope = {
    attack: 0.1,
    release: 4,
    releaseCurve: 'linear' };

  var filterEnvelope = {
    baseFrequency: (Math.random()*300),
    octaves: 2,
    attack: 0,
    decay: 0.3,
    release: 1000 };


  return new Tone.DuoSynth({
    harmonicity: 1.5,
    volume: -15,
    voice0: {
      oscillator: { type: 'sine' },
      envelope: envelope,
      filterEnvelope: filterEnvelope },

    voice1: {
      oscillator: { type: 'triangle' },
      envelope: envelope,
      filterEnvelope: filterEnvelope },

    vibratoRate: 0.5,
    vibratoAmount: 0.3 });

}

var leftSynth = makeSynth();
var rightSynth = makeSynth();
var leftPanner = new Tone.Panner(-0.5);
var rightPanner = new Tone.Panner(0.5);
var equalizer = EQUALIZER_CENTER_FREQUENCIES.map(function (frequency) {
  var filter = Tone.context.createBiquadFilter();
  filter.type = 'peaking';
  filter.frequency.value = frequency;
  filter.Q.value = 4.31;
  filter.gain.value = 0;
  return filter;
});
var echo = new Tone.FeedbackDelay('16n', 0.5);
var delay = Tone.context.createDelay(6.0);
var delayFade = Tone.context.createGain();

delay.delayTime.value = 6.0;
delayFade.gain.value = 0.75;

leftSynth.connect(leftPanner);
rightSynth.connect(rightPanner);
leftPanner.connect(equalizer[0]);
rightPanner.connect(equalizer[0]);
equalizer.forEach(function (equalizerBand, index) {
  if (index < equalizer.length - 1) {
    equalizerBand.connect(equalizer[index + 1]);
  } else {
    equalizerBand.connect(echo);
  }
});
echo.toMaster();
echo.connect(delay);
delay.connect(Tone.context.destination);
delay.connect(delayFade);
delayFade.connect(delay);

new Tone.Loop(function (time) {
  leftSynth.triggerAttackRelease('E3', '1:2:3', time);
  leftSynth.setNote('D3', '+0:2');

  leftSynth.triggerAttackRelease('C2', '0:1:1', '+6:0');

  leftSynth.triggerAttackRelease('A2', '1:1:1', '+11:2');

  leftSynth.triggerAttackRelease('A4', '1:1:1', '+19:0');
  leftSynth.setNote('G4', '+19:1:2');
  leftSynth.setNote('G4', '+19:3:0');
  leftSynth.setNote('E4', '+19:4:2');
  leftSynth.triggerAttackRelease('A4', '1:1:1', '+19:0');
  leftSynth.setNote('G4', '+20:1:2');
  leftSynth.setNote('G4', '+20:3:0');
  leftSynth.setNote('A4', '+20:4:2');
}, '34m').start();

new Tone.Loop(function (time) {
  rightSynth.triggerAttackRelease('D4', '1:2', '+5:0');
  rightSynth.setNote('C4', '+6:0');

  rightSynth.triggerAttackRelease('B3', '1m', '+11:2:2');
  rightSynth.setNote('A3', '+12:0:2');

  rightSynth.triggerAttackRelease('A3', '0:2', '+23:2');
}, '37m').start();

new Tone.Loop(function (time) {
  leftSynth.triggerAttackRelease('E1', '1:2:3', time);
  leftSynth.setNote('D2', '+0:2');

  leftSynth.triggerAttackRelease('C2', '0:1:1', '+6:0');
  leftSynth.triggerAttackRelease('D2', '0:2:1', '+6:0');

  leftSynth.triggerAttackRelease('A2', '1:1:1', '+11:2');

  leftSynth.triggerAttackRelease('A4', '1:1:1', '+19:0');
  leftSynth.setNote('G4', '+19:1:2');
  leftSynth.setNote('G4', '+19:3:0');
  leftSynth.setNote('E4', '+19:4:2');
}, '40m').start();

Tone.Transport.start();
initEqualizerUI(document.querySelector('.eq'), equalizer);
