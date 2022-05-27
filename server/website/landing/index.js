var rackrand = Math.random;

let module_color = [140, 80, 100, 255];

function draw_encoder(buf, x, y, w, h, name) {

  let vmin = -10;
  let vmax =  10;
  let base_val = rackrand() * 20 - 10;
  let precision = 2;

  function val2ang(val) {
    let ang = (val - vmin) / (vmax - vmin) * 1.5 * Math.PI;
    if (ang > 1.5 * Math.PI) ang = 1.5 * Math.PI;
    if (ang < 0) ang = 0;
    return ang;
  }

  let sw = 0.5;
  let rc = 0.8;
  let r = w / 2 * rc;
  buf.noStroke(); buf.fill(255);
  buf.circle(x + w / 2, y + w / 2, r * 2 + sw * 2);
  buf.stroke(60); buf.strokeWeight(sw); buf.fill(255);
  buf.circle(x + w / 2, y + w / 2, r * 2 - 2 * sw);
  
  r = w / 2 * rc;
  sw = 1;
  buf.stroke(60); buf.strokeWeight(sw); buf.noFill();
  let ang_high = val2ang(base_val.toFixed(precision)) + buf.HALF_PI;
  if (ang_high - buf.HALF_PI > 0.05) 
    buf.arc(x + w / 2, y + w / 2, r * 2 - 2 * sw, r * 2 - 2 * sw, buf.HALF_PI, ang_high - 0.05);
  else 
    buf.arc(x + w / 2, y + w / 2, r * 2 - 2 * sw, r * 2 - 2 * sw, ang_high - 0.05, buf.HALF_PI);
  sw = 0.5;
  buf.strokeWeight(sw);
  buf.line(x + w / 2 + Math.cos(ang_high) * (r - 1), y + w / 2 + Math.sin(ang_high) * (r - 1), 
           x + w / 2 + Math.cos(ang_high) * (r + 0), y + w / 2 + Math.sin(ang_high) * (r + 0));

  sw = 0.5;
  buf.stroke(60); buf.strokeWeight(sw); buf.fill(255);
  buf.rect(x + sw + w * 0.1, y + h + sw, w - 2 * sw - w * 0.2, h / 3 - 2 * sw);

  sw = 0.1;
  buf.textSize(w / 5);
  buf.fill(60);
  buf.textAlign(buf.CENTER, buf.CENTER);
  buf.strokeWeight(sw);
  buf.text(base_val.toFixed(precision), x + w / 2 + sw, y + h * 0.5 + sw);
  buf.text(name.substring(0,4), x + w / 2, y + h * 1.18);
}

function draw_wire(buf, p1, p2) {
  let maxy = 1000;
  let midx = (p1[0] + p2[0]) / 2;
  let midy = Math.max(p1[1], p2[1]);
  let c = 0;
  let midx1 = (midx + p1[0]) / 2;
  let midy1 = midy + Math.min(Math.abs(p1[0] - p2[0]) * Math.abs(p1[0] - p2[0]) / 1e2, 20);
  let midx2 = (midx + p2[0]) / 2;
  let midy2 = midy + Math.min(Math.abs(p1[0] - p2[0]) * Math.abs(p1[0] - p2[0]) / 1e2, 20);

  while (midy1 > maxy) midy1 -= 10;
  while (midy2 > maxy) midy2 -= 10;

  let col1 = [170, 100, 100, 255];
  let col2 = 60;
  let col3 = [170, 100, 100, 255];

  buf.stroke(col2);
  buf.fill(col1);
  buf.strokeWeight(0.5);
  buf.circle(p1[0], p1[1], 3.5);

  buf.circle(p2[0], p2[1], 3.5);
  
  buf.stroke(col2);
  buf.strokeWeight(2);
  buf.noFill();
  buf.bezier(p1[0], p1[1], midx1, midy1, midx2, midy2, p2[0], p2[1]);

  buf.stroke(col3);
  buf.strokeWeight(1);
  buf.noFill();
  buf.bezier(p1[0], p1[1], midx1, midy1, midx2, midy2, p2[0], p2[1]);
}

function draw_module_static(buf, x, y, w, h, name) {
  let sw = 0.7;
  let rounding = 2.5;

  buf.stroke(70); buf.strokeWeight(sw); buf.strokeJoin(buf.ROUND); buf.fill(module_color);
  buf.rect(x + sw / 2, y + sw / 2, w - sw, h - sw, rounding, rounding, rounding, rounding);

  buf.stroke(180); buf.strokeWeight(sw / 3);
  let line_step = 5;// + rackrand() * 3;
  let y0 = 0, x0 = 0, inc = 0, x1 = 0, y1 = 0;
  while (inc < w + h - 10) {
    inc += line_step;
    if (inc < w) x0 += line_step;
    else y0 += line_step;
    if (inc < h) {
      y1 += line_step;
      buf.line(x + x0, y + y0 + 1, x + x1 + 1, y + y1 - 1);
    } else {
      x1 += line_step;
      buf.line(x + x0, y + y0 + 1, x + x1 + 1 - (h-y1), y + h - 1);
    }
  }

  buf.fill(50);
  let displ = 0.5;

  let angle;

  buf.fill(100); buf.strokeWeight(0.4); buf.stroke(10);
  buf.circle(x + 2*rounding, y + 2*rounding, rounding * 1.5);
  buf.circle(x + w - 2*rounding, y + 2*rounding, rounding * 1.5);
  buf.circle(x + w - 2*rounding, y + h - 2*rounding, rounding * 1.5);
  buf.circle(x + 2*rounding, y + h - 2*rounding, rounding * 1.5);

  buf.stroke(30); buf.strokeWeight(0.5);
  angle = rackrand() * 2 * Math.PI;
  buf.line(x + 2*rounding - Math.cos(angle) * rounding * 0.75, y + 2*rounding + Math.sin(angle) * rounding * 0.75, 
           x + 2*rounding + Math.cos(angle) * rounding * 0.75, y + 2*rounding - Math.sin(angle) * rounding * 0.75);
  angle = rackrand() * 2 * Math.PI;
  buf.line(x + w - 2*rounding - Math.cos(angle) * rounding * 0.75, y + 2*rounding + Math.sin(angle) * rounding * 0.75, 
           x + w - 2*rounding + Math.cos(angle) * rounding * 0.75, y + 2*rounding - Math.sin(angle) * rounding * 0.75);
  angle = rackrand() * 2 * Math.PI;
  buf.line(x + w - 2*rounding - Math.cos(angle) * rounding * 0.75, y + h - 2*rounding + Math.sin(angle) * rounding * 0.75, 
           x + w - 2*rounding + Math.cos(angle) * rounding * 0.75, y + h - 2*rounding - Math.sin(angle) * rounding * 0.75);
  angle = rackrand() * 2 * Math.PI;
  buf.line(x + 2*rounding - Math.cos(angle) * rounding * 0.75, y + h - 2*rounding + Math.sin(angle) * rounding * 0.75, 
           x + 2*rounding + Math.cos(angle) * rounding * 0.75, y + h - 2*rounding - Math.sin(angle) * rounding * 0.75);

  if (name.length > 0) {
    sw = 0.4;
    buf.stroke(30); buf.strokeWeight(sw); buf.fill(255);
    buf.rect(x + w / 4, y + 2.5, w - w / 2, 5);

    sw = 0.1;
    buf.textSize(4);
    buf.fill(60);
    buf.textAlign(buf.CENTER, buf.CENTER);
    buf.strokeWeight(sw);
    buf.text(name.substring(0, Math.floor((w - w / 3) / buf.textWidth(name) * name.length)), x + w / 2, y + 5);
  }

  sw = 0.9;
  buf.stroke(10); buf.strokeWeight(sw); buf.noFill();
  buf.rect(x + sw / 2, y + sw / 2, w - sw, h - sw, rounding, rounding, rounding, rounding);
}

function draw_port(buf, x, y, w, h) {
  let sw = 0.5;
  buf.background(0,0,0,0);

  buf.stroke(60); buf.strokeWeight(sw); buf.fill(40);
  buf.circle(x + w / 2, y + sw + h / 2, w - 2 * sw);
  buf.circle(x + w / 2, y + sw + h / 2, w - 6 * sw);
}

function draw_lfo(cbf) {
  draw_module_static(cbf, 0, 0, 5.08 * 8, 128.5, 'LFO');
  draw_encoder(cbf, 5.08 * 1, 60, 5.08 * 3, 5.08 * 3, 'CV');
  draw_encoder(cbf, 5.08 * 4, 60, 5.08 * 3, 5.08 * 3, 'FM');
  draw_encoder(cbf, 5.08 * 1, 80, 5.08 * 3, 5.08 * 3, 'WAVE');
  draw_encoder(cbf, 5.08 * 4, 80, 5.08 * 3, 5.08 * 3, 'PW');
  draw_port(cbf, 5.08 * 1.7, 105, 8, 8, 'FM');
  draw_port(cbf, 5.08 * 4.7, 105, 8, 8, 'OUT');
  cbf.strokeWeight(0.5); cbf.fill(240);
  cbf.rect(5.08 * 1, 5.08*2, 5.08*6, 5.08*9);
  lfo_scope.draw_cbf(cbf, 5.08 * 1, 5.08*2, 5.08*6, 5.08*9);
}

function draw_vco(cbf) {
  draw_module_static(cbf, 5.08 * 8, 0, 5.08 * 10, 128.5, 'VCO');
  draw_encoder(cbf, 5.08 * 8 + 5.08 * 1.25, 60, 5.08 * 3, 5.08 * 3, 'CV');
  draw_port(cbf, 5.08 * 8 + 5.08 * 3.15, 68, 8, 8, 'CV');
  draw_encoder(cbf, 5.08 * 8 + 5.08 * 5.25, 60, 5.08 * 3, 5.08 * 3, 'FM');
  draw_port(cbf, 5.08 * 8 + 5.08 * 5.25 + 5.08 * 2, 68, 8, 8, 'FM');
  draw_encoder(cbf, 5.08 * 8 + 5.08 * 1.25, 80, 5.08 * 3, 5.08 * 3, 'WAVE');
  draw_port(cbf, 5.08 * 8 + 5.08 * 3.15, 88, 8, 8, 'WAVE');
  draw_encoder(cbf, 5.08 * 8 + 5.08 * 5.25, 80, 5.08 * 3, 5.08 * 3, 'PW');
  draw_port(cbf, 5.08 * 8 + 5.08 * 5.25 + 5.08 * 2, 88, 8, 8, 'PW');
  draw_port(cbf, 5.08 * 1.7, 105, 8, 8, 'FM');
  draw_encoder(cbf, 5.08 * 8 + 5.08 * 1.25, 100, 5.08 * 3, 5.08 * 3, 'AMP');
  draw_port(cbf, 5.08 * 8 + 5.08 * 5 + 5.08, 105, 8, 8, 'OUT');
  cbf.strokeWeight(0.5); cbf.fill(240);
  cbf.rect(5.08 * 8 + 5.08 * 1, 5.08*2, 5.08*8, 5.08*9);
  vco_scope.draw_cbf(cbf, 5.08 * 8 + 5.08 * 1, 5.08*2, 5.08*8, 5.08*9);
}

function draw_wires(cbf) {
  // draw_wire(cbf, [5.08 * 8 + 5.08 * 3.15 + 4, 68 + 4.5], [5.08 * 18 + 5.08 * 3 + 4, 116 + 4.5]);
  draw_wire(cbf, [5.08 * 8 + 5.08 * 6 + 4, 105 + 4.5], [5.08 * 18 + 5.08 * 3 + 4, 116 + 4.5]);
  draw_wire(cbf, [5.08 * 8 + 5.08 * 7.25 + 4, 68 + 4.5], [5.08 * 8 + 5.08 * 6 + 4, 105 + 4.5]);
  draw_wire(cbf, [5.08 * 8 + 5.08 * 6 + 4, 105 + 4.5], [5.08 * 1.7 + 4, 105 + 4.5]);
  draw_wire(cbf, [5.08 * 8 + 5.08 * 3.15 + 4, 88 + 4.5], [5.08 * 4.7 + 4, 105 + 4.5]);
  draw_wire(cbf, [5.08 * 4.7 + 4, 105 + 4.5], [5.08 * 18 + 5.08 * 6 + 4, 116 + 4.5]);
}

function draw_visual(cbf) {
  draw_module_static(cbf, 5.08 * 18, 0, 5.08 * 20, 128.5, 'VISUAL');
  cbf.strokeWeight(0.5); cbf.fill(240);
  cbf.rect(5.08 * 18 + 5.08, 5.08*2, 5.08*18, 128.5 - 5.08*5);

  draw_port(cbf, 5.08 * 18 + 5.08 * 3, 116, 8, 8, '1');
  draw_port(cbf, 5.08 * 18 + 5.08 * 6, 116, 8, 8, '2');
  draw_port(cbf, 5.08 * 18 + 5.08 * 9, 116, 8, 8, '3');
  draw_port(cbf, 5.08 * 18 + 5.08 * 12, 116, 8, 8, '4');
  draw_port(cbf, 5.08 * 18 + 5.08 * 15, 116, 8, 8, '5');
}

class RawScope {
  constructor({size=32, divider=256, offset=4}={}) {
    this.size = size;
    this.divider = divider;
    this.i = 0;
    this.offset = offset;

    this.sample_counter = 0;
    this.divider_sample_counter = 0;
    this.buffer = [];
    this.i = 0;
    for (var j = 0; j < this.size; j ++) this.buffer.push(0);

    this.delta = 0;
    this.y1 = 0;
    this.y2 = 0;
  }

  draw_cbf(buf, x, y, w, h) {
    let sw = 0.5;
    let rounding = 0.5; 
    buf.stroke(60); buf.strokeWeight(sw); buf.strokeJoin(buf.ROUND); buf.fill(255);
    buf.rect(x + sw / 2, y + sw / 2, w - sw, h - sw, rounding, rounding, rounding, rounding);

    buf.stroke(60);
    for (var i = 1; i < 20; i ++) {
      if (i % 5 == 0) buf.strokeWeight(0.15);
      else buf.strokeWeight(0.05);
      buf.line(x + i * w * 0.05, y + sw, x + i * w * 0.05, y + h - sw);
      buf.line(x + sw, y + i * h * 0.05, x + w - sw, y + i * h * 0.05);
    }
  }

  draw_dbf(buf, x, y, w, h) {
    buf.stroke(60); buf.strokeWeight(0.5); buf.noFill();

    this.delta = (w - this.offset * 2) / this.size;
    for (var j = 0; j < this.size - 1; j++) { 
      this.y1 = -this.buffer[(this.i + j + 1) % this.size] * h / 1 / 5 + h / 2;
      this.y2 = -this.buffer[(this.i + j + 2) % this.size] * h / 1 / 5 + h / 2;
      buf.line(x + this.offset + j * this.delta, y + this.y1, x + this.offset + (j + 1) * this.delta, y + this.y2);
    }
  }

  trig() {
    this.divider = this.divider_sample_counter / this.size;
    this.divider_sample_counter = 0;
  }

  process(sample) {
    if (this.sample_counter > this.divider) {
      this.i ++;
      this.buffer[this.i] = sample;
      if (this.i == this.size - 1) { this.i = -1; }
      this.sample_counter = 0;
    }
    this.sample_counter ++;
    this.divider_sample_counter ++;
  }
}

function lfo_draw_dbf(dbf, x, y, w, h) {
  lfo_scope.draw_dbf(dbf, x, y, w, h);
}

function vco_draw_dbf(dbf, x, y, w, h) {
  vco_scope.draw_dbf(dbf, x, y, w, h);
}

function visual_draw_dbf(dbf, x, y, w, h) {
  let cx = 0, cy = 0, it = 0, sz = rackrand() * 6;
  for (let i = 0; i < vis_buf_len; i ++) {
    it = (vis_buf_i + i) % vis_buf_len;
    dbf.fill([fc[0] + sz * fv[0], fc[1] + sz * fv[1], fc[2] + sz * fv[2], rackrand() * 135]);
    dbf.noStroke();
    dbf.square(x + w*0.1 - 3 + vis_buf[it][0]*w*0.8, y + h*0.1 + vis_buf[it][1]*h*0.8, sz);
  }
}

let lfo_base_freq = rackrand() * 2, lfo_freq = 0, vco_base_freq = rackrand() * 50 + 30, vco_freq = 0;
let lfo_phase = 0, vco_phase = 0;
let vco_val = 0, lfo_val = 0;
let lfo_scope = new RawScope();
let vco_scope = new RawScope();
let sr = 44100;
let vis_buf_len = 300, vis_buf_i = 0;
let vis_buf = new Array(vis_buf_len);
let vis_buf_cnt = 0;
for (let i = 0; i < vis_buf_len; i ++) vis_buf[i] = new Array(2);
let fc = [rackrand() * 50, rackrand() * 50, rackrand() * 50];
let fv = [rackrand() * 150, rackrand() * 150, rackrand() * 150];

function lfo_process() {
  lfo_freq = lfo_base_freq * Math.pow(2, vco_val * 4);
  lfo_phase += Math.PI * 2 * lfo_freq / sr;
  lfo_val = Math.sin(lfo_phase);
  if (lfo_phase > Math.PI * 2) lfo_phase -= Math.PI * 2;
  lfo_scope.process(lfo_val);
}
      
function vco_process() {
  vco_freq = vco_base_freq * Math.pow(2, lfo_val * 4);
  vco_phase += Math.PI * 2 * vco_freq / sr;
  vco_val = Math.sin(vco_phase);
  if (vco_phase > Math.PI * 2) vco_phase -= Math.PI * 2;
  vco_scope.process(vco_val);
}
      
function visual_process() {
  if (vis_buf_cnt > 32) {
    vis_buf[vis_buf_i][0] = (vco_val + 1) / 2;
    vis_buf[vis_buf_i][1] = (lfo_val + 1) / 2;
    vis_buf_i = (vis_buf_i + 1) % vis_buf_len;
    vis_buf_cnt = 0;
  } else {
    vis_buf_cnt ++;
  }
}


function draw_horizontal(cbf, w, h) {
  cbf.textSize(w / 20);
  cbf.fill([240, 180, 120]);
  cbf.textAlign(cbf.CENTER, cbf.CENTER);
  cbf.text('MetaRack', w / 2, h / 20);
  draw_lfo(cbf);
  draw_vco(cbf);
  draw_visual(cbf);
  draw_wires(cbf);
}

function drawstatic(p, pw, ph) {
  var cbf = p.createGraphics(pw, ph);
  var dbf = p.createGraphics(pw, ph);
  let sc = ph / 128.5;
  cbf.scale(sc);
  dbf.scale(sc);
  draw_horizontal(cbf, pw / sc, ph / sc);
  p.image(cbf, 0, 0);
  return[sc, cbf, dbf]
}

let run = false;
let first_cycle = true;

function indiv(p) {
  p.setup = function () {
    let pw = p.canvas.parentElement.offsetWidth;
    let ph = p.canvas.parentElement.offsetHeight;
    p.createCanvas(pw, ph);
    [this.scale, this.cbf, this.dbf] = drawstatic(p, pw, ph);
  }

  p.draw = function () {
    p.clear();
    p.image(this.cbf, 0, 0);
    if (!run) {
      this.dbf.clear();
      this.dbf.fill([200, 200, 200, 180]);
      let w = this.dbf.width/this.scale;
      let h = this.dbf.height/this.scale
      this.dbf.rect(0, 0, w, h, 2.5);
      this.dbf.stroke(60);
      this.dbf.fill([250, 250, 250, 255]);
      this.dbf.rect(w/4, h/2 - h/8, w/2, h/4, 2.5);
      this.dbf.textSize(h / 15);
      this.dbf.textAlign(p.CENTER, p.CENTER);
      this.dbf.noStroke();
      this.dbf.fill(40);
      this.dbf.text('TAP TO START', w/2, h/2);
    } else {
      if (first_cycle) {
        this.dbf.clear();
        first_cycle = false;
      }

      this.dbf.erase();
      this.dbf.rect(5.08 * 1, 5.08*2, 5.08*6, 5.08*9);
      this.dbf.rect(5.08 * 8 + 5.08 * 1, 5.08*2, 5.08*8, 5.08*9);
      this.dbf.noErase();
      this.dbf.erase(10, 255);
      this.dbf.rect(5.08 * 18 + 5.08, 5.08*2, 5.08*18, 128.5 - 5.08*5);
      this.dbf.noErase();
      lfo_draw_dbf(this.dbf, 5.08 * 1, 5.08*2, 5.08*6, 5.08*9);
      vco_draw_dbf(this.dbf, 5.08 * 8 + 5.08 * 1, 5.08*2, 5.08*8, 5.08*9);
      visual_draw_dbf(this.dbf, 5.08 * 18 + 5.08, 5.08*2, 5.08*18, 128.5 - 5.08*5);
    }
    p.image(this.dbf, 0, 0);
  }

  p.windowResized = function() {
    let pw = p.canvas.parentElement.offsetWidth;
    // p.canvas.parentElement.style.width=`${pw * 128.5 / 193.04}px`;
    let ph = p.canvas.parentElement.offsetHeight;
    p.resizeCanvas(pw, ph);
    [this.scale, this.cbf, this.dbf] = drawstatic(p, pw, ph);
  }
}


document.addEventListener('DOMContentLoaded', (event) => {
  console.log(window.document.getElementById('synth'));
  new p5(indiv, window.document.getElementById('synth'));
})

let audioContext;

function engine_run() {
  run = true;
  audioContext = new AudioContext();
  let scriptNode = audioContext.createScriptProcessor(2048, 0, 1);

  scriptNode.onaudioprocess = function(audioProcessingEvent) {
    let outputBuffer = audioProcessingEvent.outputBuffer;

    let output = outputBuffer.getChannelData(0);
    for (let sample = 0; sample < output.length; sample++) {
      lfo_process();
      vco_process();
      visual_process();
      output[sample] = vco_val;
    }
  }

  scriptNode.connect(audioContext.destination);
}

var synth = window.document.getElementById('synth');
document.body.addEventListener('click', function (event) {
  if (synth.contains(event.target)) {
    if(!audioContext) {
      engine_run();
    }
  }
});


