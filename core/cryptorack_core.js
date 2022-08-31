document.addEventListener('contextmenu', event => event.preventDefault());
var rackrand = Math.random;//fxrand; //rackrand;

let fps = 60;
let sample_rate = 44100;
let background_color = 255;
let rackp5;

let engine;

function hp2x(hp, round=false) {if (round) return Math.round(hp) * 5.08; return hp * 5.08;}
function hp2y(hp, round=false) {if (round) return Math.round(hp) * 128.5; return hp * 128.5;}
function x2hp(x, round=false)  {if (round) return Math.round(x / 5.08); return x / 5.08;}
function y2hp(y, round=false)  {if (round) return Math.round(y / 128.5); return y / 128.5;}

function pow2(x, xr=0, y=1, c=1) {
  if (x < 0) { x += 20; c = 1048576; }
  xr = Math.floor(x);
  if (xr > 1) y = 2 << (xr - 1);
  if (x == 0) return 1;
  x -= xr;
  y *= 0.9999976457798443 + x * (0.6931766804601935 + x * (0.2400729486415728 + x * (0.05592817518644387 + x * (0.008966320633544 + x * 0.001853512473884202))));
  return y / c;
}

// STYLES

class PortStyle {
  // constructor(hole=45, ring=120, text=60, hastext=true){
  constructor(hole=255, ring=80, text=100, hastext=true){
    this.hole = hole;
    this.ring = ring;
    this.text = text;
    this.hastext = hastext;
  }
}


let wire_diff = [(rackrand() - 0.5) * 180, (rackrand() - 0.5) * 180, (rackrand() - 0.5) * 180];

let wire_color = [198, 70, 15, 255];
if (rackrand() < 0.5)
      wire_color = [254, 197, 46];

wire_color = [wire_color[0], wire_color[1] + wire_diff[1], wire_color[2] + wire_diff[2]]

class WireStyle {
  // constructor(core=[100, 100, 180, 255], edge=40) {
  constructor(core=255, edge=80) {
    this.core = wire_color;
    this.edge = edge;
  }
}


let white_text = false;

let diff = [(rackrand() - 0.5) * 30, (rackrand() - 0.5) * 30, (rackrand() - 0.5) * 30];
let base = rackrand() * 30 + 200
let module_color = [base + diff[0], base + diff[1], base + diff[2]];

class ModuleStyle {
  // constructor(panel=[140, 80, 100, 255], frame=10, shadow=70, name=40, lining=180, label=255, background=255) {
  constructor(panel=module_color, frame=60, shadow=70, name=40, lining=100, label=255, background=255) {
    this.panel = panel;
    this.frame = frame;
    this.shadow = shadow;
    this.name = name;
    this.label = label;
    this.lining = lining;
    this.background = background;
  }
}

// GRAPHICOBJECT

class GraphicObject {
  constructor({x=0, y=0, w=0, h=0, name='name undefined', visible=true}={}) {
    this.set_position(x, y);
    this.set_size(w, h);
    this.gparent = null;
    this.gchildren = [];
    this.visible = visible;
    this.focus = null;
    this.name = name;
    this.ax = 0;
    this.ay = 0;
  }

  contains(x, y) { if (x < this.x || y < this.y || x > this.x + this.w || y > this.y + this.h) return false; return true; }
  set_position(x, y) { this.x = x; this.y = y; }
  set_size(w, h) { 
    this.w = w; this.h = h; 
    this.cbf = null;
    this.sbf = null;
    this.dbf = null;
    this.changed = true;
  }
  attach(go) { this.gchildren.push(go); go.gparent = this; go.changed = true; }
  detach(go) { let i = this.gchildren.indexOf(go); if (i !== -1) this.gchildren.splice(i, 1); }

  proxy_draw(cbf, sbf, dbf, x, y) {
    if (!this.visible) return;
    if (this.w == 0 || this.h == 0) return;

    this.ax = x; this.ay = y;

    if (!this.cbf && this.draw_cbf) { this.cbf = createGraphics(this.w * engine.scale * engine.res_multiplier, this.h * engine.scale * engine.res_multiplier); this.draw_cbf(this.cbf, this.cbf.width, this.cbf.height); }
    if (!this.sbf && this.draw_sbf) { this.sbf = createGraphics(this.w * engine.scale * engine.res_multiplier, this.h * engine.scale * engine.res_multiplier); }
    
    if (this.changed && this.draw_sbf) {
      sbf.erase(); sbf.noStroke(); sbf.rect(x + this.x, y + this.y, this.w, this.h); sbf.noErase();
      this.sbf.clear(); this.draw_sbf(this.sbf, this.sbf.width, this.sbf.height);
    }

    if (this.gparent.changed) this.changed = true;

    if (this.changed && this.cbf) cbf.image(this.cbf, x + this.x, y + this.y, this.w, this.h);
    if (this.changed && this.sbf) sbf.image(this.sbf, x + this.x, y + this.y, this.w, this.h);
    if (this.draw_dbf) { this.draw_dbf(dbf, x + this.x, y + this.y, this.w, this.h); }

    for (const go of this.gchildren) go.proxy_draw(cbf, sbf, dbf, x + this.x, y + this.y);
    
    this.changed = false;
  }

  find_focus(x, y) {
    if (!this.visible) return null;
    if (this.contains(x, y)) {
      this.focus = null;
      for (var i = this.gchildren.length - 1; i >= 0; i--) {
        this.focus = this.gchildren[i].find_focus(x - this.x, y - this.y);
        if (this.focus != null) return this.focus;
      }
      if (this.focus == null) return this;
    }
    return null;
  }

  mouse_pressed(x, y, dx, dy) { console.warn(this.name + ' press method undefined'); }
  mouse_dragged(x, y, dx, dy) { console.warn(this.name + ' drag method undefined'); }
  mouse_released(x, y, dx, dy) { console.warn(this.name + ' release method undefined'); }
  double_clicked(x, y, dx, dy) { console.warn(this.name + ' doubleclick method undefined'); }
}

// PORT

class ProtoPort extends GraphicObject {
  constructor({x=10, y=10, r=7, name='', style=new PortStyle(), default_value=0, visible=true, isinput=false}={}) {
    super({x:x, y:y, w:r*2, h:r*2, name:name, visible:visible});
    this.channels = 1;
    this.isinput = isinput;
    this.in_wire = null;
    this.wires = [];
    this.default_value = default_value;
    this.value = this.default_value;
    this.style = style;
    this.port = this;
  }

  draw_cbf(buf, w, h) {
    let sw = 1.5;
    buf.background(0,0,0,0);

    buf.stroke(this.style.ring); buf.strokeWeight(sw); buf.fill(30);
    buf.circle(w / 2, h / 2, w - 2 * sw);
    buf.circle(w / 2, h / 2, w - 6 * sw);
  }

  set(value) {
    this.value = value;
  }

  get() {
    return this.value;
  }

  get_center() {
    return [this.ax + this.x + this.w / 2, this.ay + this.y + this.h / 2];
  }

  connect(port) {
    let w = new Wire();
    w.connect(this, port);
    engine.add_wire(w);
  }

  mouse_pressed(x, y, dx, dy) { engine.start_wire(x, y, this.spawn_or_get_wire()); }
  mouse_dragged(x, y, dx, dy) { engine.move_wire(x, y); }
  mouse_released(x, y, dx, dy) { engine.end_wire(x, y); }

  plug_wire(w) { 
    this.wires.push(w); 
    this.changed = true;
    if (this.gparent) this.gparent.changed = true;
  }

  unplug_wire(w) {
    let i = this.wires.indexOf(w);
    if (i !== -1) this.wires.splice(i, 1);
    if (this == w.a) w.a = null;
    if (this == w.b) w.b = null;
    this.changed = true;
    if (this.gparent) this.gparent.changed = true;
    this.value = this.default_value;
  }

  spawn_or_get_wire() {
    if (this.wires.length > 0) {
      let w = this.wires[this.wires.length - 1];
      this.unplug_wire(w);
      if (w.a == null) [w.a, w.b] = [w.b, w.a];
      return w;
    }
    return new Wire({a: this});
  }

  remove_all_wires() {
    while (this.wires.length > 0) engine.remove_wire(this.wires[0]);
    if (this.in_wire) engine.remove_wire(this.in_wire);
  }
}

class Led extends GraphicObject {
  constructor({x=0, y=0, r=10, brightness=1} = {}) {
    super ({x:x, y:y, w:2*r, h:r*2, name:'Led'});
    this.brightness = brightness;
  }

  set(b) {
    if (b != this.brightness) this.changed = true;
    this.brightness = b;
  }

  draw_cbf(buf, w, h) {
    let sw = 1;
    buf.stroke(60); buf.strokeWeight(sw); buf.fill(255);
    buf.circle(w/2, h/2, w - 2*sw);
  }

  draw_sbf(buf, w, h) {
    buf.noStroke(); buf.fill(this.brightness);
    buf.circle(w/2, h/2, w*0.8);
  }
}

class Button extends GraphicObject {
  constructor({x=0, y=0, r=10, state=false} = {}) {
    super ({x:x, y:y, w:2*r, h:r*2, name:'Button'});
    this.state = state;
  }

  draw_cbf(buf, w, h) {
    let sw = 1;
    buf.stroke(60); buf.strokeWeight(sw); buf.fill(0);
    buf.circle(w/2, h/2, w - 2*sw);
  }

  set(s) {
    this.state = s;
  }

  mouse_pressed(x, y, dx, dy) {
    this.state = !this.state;
  }

  get() {
    return this.state;
  }
}

class Port extends GraphicObject {
  constructor({x=0, y=0, r=10, name='', style=new PortStyle(), default_value=0, visible=true, isinput=false, type='input'}={}) {
    super({x:x, y:y, w:2*r, h:r*3, name:name, visible:visible});
    let pr = r * Math.pow(7 / this.w, 0.8);
    let px = this.w / 2 - pr;
    let py = this.h / 1.5 / 2 - pr;
    this.port = new ProtoPort({x:px, y:py, r:pr, name:name, default_value: default_value});
    this.attach(this.port);
    this.type = type;
  }

  draw_cbf(buf, w, h) {
    let sw = 1;

    if (this.type == 'output') {
      buf.fill(10)
      buf.rect(w/15, h/15, w - w/8, h - h/8, 5);
    } else {
      buf.fill(255)
      buf.rect(w/15, h/15, w - w/8, h - h/8, 5);
    }

    buf.stroke(60); buf.strokeWeight(sw); buf.fill(255);
    //buf.rect(sw + w * 0.05, h / 1.5 + sw + h * 0.05, w - 2 * sw - w * 0.1, h / 3 - 2 * sw - h * 0.1);

    buf.textSize(w / 4);

    if (this.type == 'output') {
      buf.fill(230)
      //buf.rect(w/15, h/15, w - w/8, h - h/8, 5);
    } else {
      buf.fill(60)
      //buf.rect(w/15, h/15, w - w/8, h - h/8, 5);
    }

    //buf.fill(60);
    buf.textAlign(buf.CENTER, buf.CENTER);
    buf.strokeWeight(sw / 10);
    buf.text(this.name.substring(0,5), w / 2, h * 5 / 6 + 1);
  }

  set(value) { this.port.value = value; }
  get() { return this.port.value; }
  connect(c) {
    let w = new Wire();
    w.connect(this.port, c.port);
    engine.add_wire(w);
  }
}

let knob_color;
if (rackrand() < 0.25) {
  knob_color = [232, 111, 104];
} else  if (rackrand() < 0.5) {
  knob_color = [131, 183, 153]
} else if (rackrand() < 0.75) {
  knob_color = [228, 216, 180];
} else knob_color = [190, 190, 190];

let knob_diff = [(rackrand() - 0.5) * 80, (rackrand() - 0.5) * 80, (rackrand() - 0.5) * 80];
knob_color = [knob_color[0] + knob_diff[0], knob_color[1] + knob_diff[1], knob_color[2] + knob_diff[2]]


class Encoder extends GraphicObject {
  constructor({x=0, y=0, r=10, name='?', val=5, vmin=-10, vmax=10, precision=6, mod=0.1}={}) {
    super({x:x, y:y, w:2*r, h:3*r, name:name});
    this.def_val = val;
    this.def_mod = mod;
    this.base_val = val;
    this.vmin = vmin;
    this.vmax = vmax;
    this.mod = mod;

    this.ang_low = 0;
    this.ang_high = 0;

    this.rc = 0.8;
    this.r = 0;

    this.value_changed = false;
    this.first_time = true;
    
    //knob_color = [131, 183, 153];//190
    this.precision = Math.min(precision, Math.min(2, 2 - Math.floor(Math.log10(Math.abs(vmax - vmin) / 20))));
    this.prev_base_val = this.base_val;
    this.sample_counter = 0;
    this.nochange_counter = 0;
    this.nochange_flag = false;
    this.filter = new ExponentialFilterPrim({freq:50});
    //this.precision = Math.min(2, 2 - Math.floor(Math.log10(Math.abs(vmax - vmin) / 20)));
  }

  val2ang(val) {
    let ang = (val - this.vmin) / (this.vmax - this.vmin) * 1.5 * Math.PI;
    if (ang > 1.5 * Math.PI) ang = 1.5 * Math.PI;
    if (ang < 0) ang = 0;
    return ang;
  }

  draw_cbf(buf, w, h) {
    let sw = 1;
    this.r = w / 2 * this.rc;
    buf.noStroke(); buf.fill(190);
    //buf.circle(w / 2, w / 2, this.r * 2 + sw * 8);
    //buf.stroke(60); buf.strokeWeight(this.r/3); buf.fill(127);
    buf.stroke(0); buf.strokeWeight(1.5*sw); buf.fill(60);
    buf.circle(w / 2, w / 2, this.r * 2 - 2 * sw);
    buf.stroke(60); buf.strokeWeight(sw); 
    
    buf.fill(knob_color);
    buf.circle(w / 2, w / 2, (this.r * 2 - 2 * sw) / 1.4);
    buf.stroke(knob_color); 
    buf.strokeWeight(sw); 
    buf.fill(knob_color);
    buf.circle(w / 2, w / 2, (this.r * 2 - 2 * sw) / 2);
  }

  draw_sbf(buf, w, h) {
    this.r = w / 2 * this.rc;
    let sw = 3;
    sw = 4;
    buf.stroke(60); buf.strokeWeight(sw); buf.noFill();
    this.ang_high = this.val2ang(this.base_val.toFixed(this.precision)) + buf.HALF_PI;
    // if (this.ang_high - buf.HALF_PI > 0.05) 
    //   buf.arc(w / 2, w / 2, this.r * 2 - 2 * sw, this.r * 2 - 2 * sw, buf.HALF_PI, this.ang_high - 0.05);
    // else 
    //   buf.arc(w / 2, w / 2, this.r * 2 - 2 * sw, this.r * 2 - 2 * sw, this.ang_high - 0.05, buf.HALF_PI);
    sw = 2;
    buf.strokeWeight(sw*3);
    buf.stroke(knob_color);
    //buf.stroke([131, 183, 153])
    buf.line(w / 2 + Math.cos(this.ang_high) * (this.r - 2.8), w / 2 + Math.sin(this.ang_high) * (this.r - 2.8), 
             w / 2 + Math.cos(this.ang_high) * (this.r + 1)/2, w / 2 + Math.sin(this.ang_high) * (this.r + 1)/2);

    sw = 1;
    buf.stroke(60); buf.strokeWeight(0); buf.fill(255);
    //buf.rect(sw + w * 0.1, h / 1.5 + sw + h * 0.05, w - 2 * sw - w * 0.2, h / 3 - 2 * sw - h * 0.1, 5);

    sw = 0.1;
    buf.textSize(w / 4);

    if (white_text)
      buf.fill(245);
    else
      buf.fill(0);
    buf.textAlign(buf.CENTER, buf.CENTER);
    buf.strokeWeight(sw);
    //buf.text(this.base_val.toFixed(this.precision), w / 2, h / 3);
    buf.textSize(w / 4);
    buf.text(this.name.substring(0,4), w / 2, h * 5 / 6 + 1);
  }

  get() { 
    if (this.value_changed) {
      if ((this.changed)) {
        this.nochange_counter = 0;
        this.nochange_flag = false;
        this.c = this.sample_counter / (sample_rate / 0.1);
        this.sample_counter++;
        if (this.c <= 1)
          this.filter.in = (this.base_val * this.c + this.prev_base_val * (1 - this.c));
        else {
          this.filter.in = this.base_val;

        }
        this.filter.process();
        return this.filter.lp;
        
      }
      else {
        this.sample_counter = 0;
        if (!this.nochange_flag) this.nochange_counter++;
        if (this.nochange_counter > sample_rate * 30) {
          this.nochange_counter = 0;
          this.nochange_flag = true;
        }
        this.prev_base_val = this.base_val;
        if (!this.nochange_flag) {
          this.filter.in = this.base_val;
          this.filter.process();
          return this.filter.lp;
        }
        else {
          return this.base_val;
        }
      }
    } 
    else {
      return this.base_val;
    }
  }

  set(v) { 
    if (this.first_time) 
      this.first_time = false; 
    else
      this.value_changed = true;
    this.prev_base_val = this.base_val; this.sample_counter = 0; this.base_val = v; this.changed = true; 
  }

  mouse_pressed(x, y, dx, dy) { this.prev_base_val = this.base_val; this.sample_counter = 0; this.changed = true; }
  mouse_dragged(x, y, dx, dy) { 
    this.prev_base_val = this.base_val;
    this.sample_counter = 0;
    this.base_val -= dy / 250 * (this.vmax - this.vmin); 
    if (this.base_val > this.vmax) this.base_val = this.vmax;
    if (this.base_val < this.vmin) this.base_val = this.vmin + 0.0001;
    this.changed=true;
    this.value_changed = true;
  }
  mouse_released(x, y, dx, dy) { this.prev_base_val = this.base_val; this.sample_counter = 0; this.changed = true; engine.undo_checkpoint();}
  double_clicked(x, y, dx, dy) { this.value_changed = true; this.prev_base_val = this.base_val; this.sample_counter = 0; this.base_val = this.def_val; this.mod = this.def_mod; this.changed = true; engine.undo_checkpoint();}

  save() { return this.base_val.toFixed(6); }
  load(s) { 
    this.base_val = parseFloat(s); 
    if (this.base_val > this.vmax) this.base_val = this.vmax;
    if (this.base_val < this.vmin) this.base_val = this.vmin;
    this.changed = true; 
  }
}

class StepEncoder extends Encoder {
  constructor({x=0, y=0, r=10, name='?', val=5, vmin=-10, vmax=10, mod=0.1, step=1, nonzero=true}={}) {
    if (nonzero)
      super({x:x, y:y, r:r, name:name, val:val, vmin:(vmin+step), vmax:vmax, mod:mod});
    else
      super({x:x, y:y, r:r, name:name, val:val, vmin:vmin, vmax:vmax, mod:mod});
    this.nonzero = nonzero;
    this.step = step;
    this.y0 = 0;
    this.dval = val;
  }

  mouse_pressed(x, y, dx, dy) { super.mouse_pressed(x, y, dx, dy); this.y0 = y; }

  mouse_dragged(x, y, dx, dy) { 
    this.dval -= dy / 250 * (this.vmax - this.vmin);
    if (Math.abs(this.dval) > this.step) {
      this.base_val += Math.sign(this.dval) * this.step;
      this.dval -= Math.sign(this.dval) * this.step;
    }
    if (this.base_val > this.vmax) this.base_val = this.vmax;
    if (this.base_val < this.vmin) this.base_val = this.vmin + 0.0001;
    this.changed=true;
  }

  // draw_sbf(buf, w, h) {
  //   this.r = w / 2 * this.rc;
  //   let sw = 3;
  //   sw = 4;
  //   buf.stroke(60); buf.strokeWeight(sw); buf.noFill();
  //   this.ang_high = this.val2ang(this.base_val) + buf.HALF_PI;
  //   if (this.ang_high - buf.HALF_PI > 0.05) 
  //     buf.arc(w / 2, w / 2, this.r * 2 - 2 * sw, this.r * 2 - 2 * sw, buf.HALF_PI, this.ang_high - 0.05);
  //   else 
  //     buf.arc(w / 2, w / 2, this.r * 2 - 2 * sw, this.r * 2 - 2 * sw, this.ang_high - 0.05, buf.HALF_PI);
  //   sw = 2;
  //   buf.strokeWeight(sw);
  //   buf.line(w / 2 + Math.cos(this.ang_high) * (this.r - 5), w / 2 + Math.sin(this.ang_high) * (this.r - 5), 
  //            w / 2 + Math.cos(this.ang_high) * (this.r + 1), w / 2 + Math.sin(this.ang_high) * (this.r + 1));

  //   sw = 1;
  //   buf.stroke(60); buf.strokeWeight(sw); buf.fill(255);
  //   buf.rect(sw + w * 0.1, h / 1.5 + sw + h * 0.05, w - 2 * sw - w * 0.2, h / 3 - 2 * sw - h * 0.1);

  //   sw = 0.1;
  //   buf.textSize(w / 4);
  //   buf.fill(60);
  //   buf.textAlign(buf.CENTER, buf.CENTER);
  //   buf.strokeWeight(sw);
  //   // if ((this.base_val <= 0) && (this.nonzero)) 
  //   //   //buf.text((this.base_val - this.step).toFixed(this.precision), w / 2, h / 3);
  //   // else
  //   //   buf.text(this.base_val.toFixed(this.precision), w / 2, h / 3);
  //   buf.text(this.name.substring(0,4), w / 2, h * 5 / 6 + 1);
  // }

  get(){ 
    if ((this.base_val <= 0) && (this.nonzero)) {
      return (this.base_val - this.step);
    }
    else {
      return this.base_val; 
    }
  }

  save() { 
    if ((this.base_val <= 0) && (this.nonzero)) {
      return (this.base_val - this.step).toFixed(6);
    }
    else {
      return this.base_val.toFixed(6); 
    }
  }
}



class InputEncoder extends Encoder {
  constructor(...args) {
    super(...args);
    this.port = new ProtoPort({x:this.w / 2 + this.w / 8 / 1.5, y: this.h / 3 + this.h / 8 / 1.5, r: this.w / 4 - this.w / 16, name:this.name});
    this.attach(this.port);
    this.mod_coef = 0.1 * this.mod * (this.vmax - this.vmin);
    this.val = this.base_val;
    this.port.isinput = true;

    this.flag = true;    
  }

  preload() {
    if (this.flag) {
      this.img = loadImage('./knob.png');
      this.flag = false;
    }
  }

  draw_sbf(buf, w, h) {
    super.draw_sbf(buf, w, h);

    if (this.port.isinput && this.port.wires.length > 0) {
      let sw = 1.5;
      let dv = this.mod * (this.vmax - this.vmin);
      this.ang_low = this.val2ang(this.base_val - dv) + buf.HALF_PI;
      buf.stroke(0); buf.strokeWeight(2*sw); buf.noFill();
      this.ang_high = this.val2ang(this.base_val + dv) + buf.HALF_PI;
      buf.line(w / 2 + Math.cos(this.ang_high) * (this.r - 1), w / 2 + Math.sin(this.ang_high) * (this.r - 1), 
           w / 2 + Math.cos(this.ang_high) * (this.r + 3), w / 2 + Math.sin(this.ang_high) * (this.r + 3));

      if (this.ang_low < this.ang_high) {
        if (Math.abs(this.ang_low - this.ang_high) > 0.001) 
          buf.arc(w / 2, w / 2, this.r * 2 + 4 * sw, this.r * 2 + 4 * sw, this.ang_low, this.ang_high); buf.fill(255);
        buf.strokeWeight(sw)
        buf.circle(w / 2 + Math.cos(this.ang_low) * (this.r + 2), w / 2 + Math.sin(this.ang_low) * (this.r + 2), 6);
      } else {
        if (Math.abs(this.ang_low - this.ang_high) > 0.001) 
          buf.arc(w / 2, w / 2, this.r * 2 + 4 * sw, this.r * 2 + 4 * sw, this.ang_high, this.ang_low); buf.fill(255);
        buf.strokeWeight(sw)
        buf.circle(w / 2 + Math.cos(this.ang_low) * (this.r + 2), w / 2 + Math.sin(this.ang_low) * (this.r + 2), 6);
      }
    }
  }

  draw_dbf(buf, x, y, w, h) { this.mod_coef = (this.port.wires.length > 0) * 0.1 * this.mod * (this.vmax - this.vmin); }
  
  get() { 
    if ((this.value_changed)) {
      if ((this.changed)) {
        this.nochange_counter = 0;
        this.nochange_flag = false;
        this.c = this.sample_counter / (sample_rate / fps); //here
        this.sample_counter++;
        if (this.c <= 1) {
          //this.filter.in = ((Math.sin((this.c - 0.5) * Math.PI) / 2) + 0.5) * (this.base_val - this.prev_base_val) + this.prev_base_val;
          this.filter.in = (this.base_val * this.c + this.prev_base_val * (1 - this.c));

          //return ((Math.sin((this.c - 0.5) * Math.PI) / 2) + 0.5) * (this.base_val - this.prev_base_val) + this.prev_base_val + this.mod_coef * this.port.get();
        }
        else {
          this.filter.in = this.base_val;

          //this.filter2.in = this.filter.lp;
          //return this.base_val + this.mod_coef * this.port.get(); 
        }
        //this.filter.in = (this.base_val * this.c + this.prev_base_val * (1 - this.c));
        this.filter.process();
        //this.filter2.process();
        return this.filter.lp + this.mod_coef * this.port.get();
        
      }
      else {
        this.sample_counter = 0;
        if (!this.nochange_flag) this.nochange_counter++;
        if (this.nochange_counter > sample_rate * 30) { //here (* 2)
          this.nochange_counter = 0;
          this.nochange_flag = true;
        }
        this.prev_base_val = this.base_val;
        if (!this.nochange_flag) {
          this.filter.in = this.base_val;
          this.filter.process();
          return this.filter.lp + this.mod_coef * this.port.get();
        }
        else {
          return this.base_val + this.mod_coef * this.port.get();
        }
        //return this.base_val + this.mod_coef * this.port.get(); 
      }
    }
    else {
      return this.base_val + this.mod_coef * this.port.get();
    }
  }
  set(v) { 
    if (this.first_time) 
      this.first_time = false; 
    else {
      this.value_changed = true;
    }
    this.prev_base_val = this.base_val; this.sample_counter = 0; this.base_val = v; this.changed = true;
  }
  connect(c) {
    let w = new Wire();
    w.connect(this.port, c.port);
    engine.add_wire(w);
  }

  mouse_dragged(x, y, dx, dy) {
    this.prev_base_val = this.base_val;
    this.sample_counter = 0;
    if (!this.port.isinput || (!engine.cmdpressed || this.port.wires.length == 0)) {
      this.base_val -= dy / 250 * (this.vmax - this.vmin); 
      if (this.base_val > this.vmax) this.base_val = this.vmax;
      if (this.base_val < this.vmin) this.base_val = this.vmin + 0.0001;
    } else {
      this.mod -= dy / 500; 
      if (this.mod > 1) this.mod = 1;
      if (this.mod < -1) this.mod = -1;
    }
    this.changed=true;
    this.value_changed = true;
  }

  save() { return { 'val': this.base_val.toFixed(6), 'mod': this.mod.toFixed(6) } }
  load(s) { 
    this.base_val = parseFloat(s['val']); 
    if (this.base_val > this.vmax) this.base_val = this.vmax;
    if (this.base_val < this.vmin) this.base_val = this.vmin;
    this.mod = parseFloat(s['mod']); 
    this.changed = true; 
  }
}

// WIRE

class Wire extends GraphicObject {
  constructor({a=null, b=null, style=new WireStyle()}={}) {
    super();
    this.a = a;
    this.b = b;
    this.style = style;
  }

  process() {
    if (!this.a || !this.b) return;
    if (this.b.isinput) this.b.value = this.a.value;
    if (this.a.isinput) this.a.value = this.b.value;
  }

  draw_wire(buf, p1, p2) {

    let maxy = 1000;
    let midx = (p1[0] + p2[0]) / 2;
    let midy = Math.max(p1[1], p2[1]);
    let c = 0;
    let midx1 = (midx + p1[0]) / 2 + this.a.get() * c;
    let midy1 = midy + Math.min(Math.abs(p1[0] - p2[0]) * Math.abs(p1[0] - p2[0]) / 1e2, 20) + this.a.get() * c;
    let midx2 = (midx + p2[0]) / 2 + this.a.get() * c;
    let midy2 = midy + Math.min(Math.abs(p1[0] - p2[0]) * Math.abs(p1[0] - p2[0]) / 1e2, 20) + this.a.get() * c;

    while (midy1 > maxy) midy1 -= 10;
    while (midy2 > maxy) midy2 -= 10;

    buf.stroke(this.style.edge);
    buf.fill(this.style.core);

    // buf.strokeWeight(0);
    // buf.fill(60)
    // if (this.a) buf.circle(p1[0], p1[1], this.a.w * 0.7 / 1);
    // else buf.circle(p1[0], p1[1], 3.5);

    // if (!this.b || this.b.visible) {
    //   if (this.b) buf.circle(p2[0], p2[1], this.b.w * 0.7 / 1);
    //   else buf.circle(p2[0], p2[1], 3.5);
    // }

    if ((this.a != null) && (this.b != null)) {
      this.dest = null;
      if (this.a.isinput) {
        this.dest = this.a;
      } else {
        this.dest = this.b;
      }
      if (this.dest.value[0] === undefined) {
        if (this.dest.value > 0) {
          buf.fill([0, 255 * this.dest.value * 2, 0]);
        } else {
          buf.fill([255 * Math.abs(this.dest.value * 2), 0, 0]);
        } 
      } else buf.fill(this.style.core[0], this.style.core[1], this.style.core[2]);
    } else
      buf.fill(this.style.core[0], this.style.core[1], this.style.core[2]);

    buf.strokeWeight(0.5);
    buf.stroke(0);
    if (this.a) buf.circle(p1[0], p1[1], this.a.w * 0.7 / 1.4);
    else buf.circle(p1[0], p1[1], 3.5);

    if (!this.b || this.b.visible) {
      if (this.b) buf.circle(p2[0], p2[1], this.b.w * 0.7 / 1.4);
      else buf.circle(p2[0], p2[1], 3.5);
      
      buf.stroke(0);
      buf.strokeWeight(2);
      buf.noFill();
      buf.bezier(p1[0], p1[1], midx1, midy1, midx2, midy2, p2[0], p2[1]);

      buf.stroke(this.style.core);
      buf.strokeWeight(1);
      buf.noFill();
      buf.bezier(p1[0], p1[1], midx1, midy1, midx2, midy2, p2[0], p2[1]);
    }
  }

  draw(buf, x, y) { 
    if (this.a) {
      if (this.b) this.draw_wire(buf, this.a.get_center(), this.b.get_center()); 
      else this.draw_wire(buf, this.a.get_center(), [x + this.x, y + this.y]); 
    }
  }

  connect(a, b) {
    if ((!a || !b) || (!a.port || !b.port) || 
        (a.port.isinput == b.port.isinput) || 
        (a.port.isinput && a.port.wires.length > 0) || 
        (b.port.isinput && b.port.wires.length > 0)) 
        return false;
    if (this.a) this.a.unplug_wire(this);
    if (this.b) this.b.unplug_wire(this);
    this.a = a.port; this.b = b.port;
    this.a.plug_wire(this);
    this.b.plug_wire(this);
    return true;
  }

  disconnect() {
    if (this.a) this.a.unplug_wire(this);
    if (this.b) this.b.unplug_wire(this);
  }

  save() {
    if (this.a != null) {
      if (!this.a.isinput) 
        return {
          'a': {
            'mid': this.a.module.id,
            'pid': this.a.name,
          },
          'b': {
            'mid': this.b.module.id,
            'pid': this.b.name
          }
        }
      return {
        'b': {
          'mid': this.a.module.id,
          'pid': this.a.name,
        },
        'a': {
          'mid': this.b.module.id,
          'pid': this.b.name
        }
      }
    }
  }
}

// MODULE

class Module extends GraphicObject {
  constructor({name='', x=0, y=0, w=0, h=128.5, style = new ModuleStyle()}) {
    super({x:x, y:y, w:w, h:h});
    this.name = this.constructor.name
    this.i = {};
    this.o = {};
    this.c = {};
    this.style = style;

    this.id = 0;
    if (engine) engine.add_module(this);
  }

  draw_cbf(buf, w, h) {
    let sw = 1.5;
    let rounding = 5;
    buf.background(0,0,0,0);

    buf.stroke(this.style.shadow); buf.strokeWeight(sw * 3); buf.strokeJoin(buf.ROUND); buf.fill(this.style.panel);
    buf.rect(sw / 2, sw / 2, w - sw, h - sw, rounding, rounding, rounding, rounding);

    // buf.stroke(this.style.lining); buf.strokeWeight(sw / 3);
    // let line_step = 5;// + rackrand() * 3;
    // let x1 = 0;
    // while (x1 < w + h) {
    //   x1 += line_step;
    //   buf.line(x1, 0, 0, x1);
    // }
    // buf.stroke(255); buf.strokeWeight(10 * buf.scale); buf.noFill();
    // buf.arc(rounding, h - rounding, rounding*2.5, rounding*2.5, buf.HALF_PI - 0.01, buf.PI + 0.01);

    buf.fill(50);
    let displ = 0.5;

    let angle;
    buf.circle(2*rounding - displ, 2*rounding + displ, rounding * 1.4);
    buf.circle(w - 2*rounding - displ, 2*rounding + displ, rounding * 1.4);
    buf.circle(w - 2*rounding - displ, h - 2*rounding + displ, rounding * 1.4);
    buf.circle(2*rounding - displ, h - 2*rounding + displ, rounding * 1.4);

    buf.fill(100); buf.strokeWeight(0.8); buf.stroke(10);
    buf.circle(2*rounding, 2*rounding, rounding * 1.5);
    buf.circle(w - 2*rounding, 2*rounding, rounding * 1.5);
    buf.circle(w - 2*rounding, h - 2*rounding, rounding * 1.5);
    buf.circle(2*rounding, h - 2*rounding, rounding * 1.5);

    buf.stroke(30); buf.strokeWeight(0.8);
    angle = rackrand() * 2 * Math.PI;
    buf.line(2*rounding - Math.cos(angle) * rounding * 0.75, 2*rounding + Math.sin(angle) * rounding * 0.75, 
             2*rounding + Math.cos(angle) * rounding * 0.75, 2*rounding - Math.sin(angle) * rounding * 0.75);
    angle = rackrand() * 2 * Math.PI;
    buf.line(w - 2*rounding - Math.cos(angle) * rounding * 0.75, 2*rounding + Math.sin(angle) * rounding * 0.75, 
             w - 2*rounding + Math.cos(angle) * rounding * 0.75, 2*rounding - Math.sin(angle) * rounding * 0.75);
    angle = rackrand() * 2 * Math.PI;
    buf.line(w - 2*rounding - Math.cos(angle) * rounding * 0.75, h - 2*rounding + Math.sin(angle) * rounding * 0.75, 
             w - 2*rounding + Math.cos(angle) * rounding * 0.75, h - 2*rounding - Math.sin(angle) * rounding * 0.75);
    angle = rackrand() * 2 * Math.PI;
    buf.line(2*rounding - Math.cos(angle) * rounding * 0.75, h - 2*rounding + Math.sin(angle) * rounding * 0.75, 
             2*rounding + Math.cos(angle) * rounding * 0.75, h - 2*rounding - Math.sin(angle) * rounding * 0.75);

    if (this.name.length > 0) {
      sw = 1;
      buf.stroke(30); buf.strokeWeight(sw); buf.noFill();
      //buf.rect(w / 6, 5, w - w / 3, 20, 10);

      sw = 0.1;
      buf.textSize(15 * engine.scale / 2.922569722890493);
      buf.fill(60);
      buf.textAlign(buf.CENTER, buf.CENTER);
      buf.strokeWeight(sw);
      buf.text(this.name.substring(0, Math.floor((w - w / 3) / buf.textWidth(this.name) * this.name.length * 0.7)), w / 2, 15);
    }

    sw = 1.5;
    buf.stroke(this.style.frame); buf.strokeWeight(sw); buf.noFill();
    buf.rect(sw / 2, sw / 2, w - sw, h - sw, rounding, rounding, rounding, rounding);
  }

  add_input(i) {
    this.i[i.name] = i;
    this.attach(i);
    i.port.isinput = true;
    i.port.module = this;
  }

  add_output(o) {
    this.o[o.name] = o;
    this.attach(o);
    o.port.isinput = false;
    o.port.module = this;
  }

  add_control(c) {
    this.c[c.name] = c;
    this.attach(c);
  }

  connect(oport, iport, scale=1, offset=0) {
    engine.add_wire(oport, iport, scale, offset);
  }

  mouse_pressed(x, y, dx, dy) { 
    this._x = this.x;
    this._y = this.y;
    this._xd = x - this.x;
  }

  mouse_dragged(x, y, dx, dy) {
    this._x = Math.floor((x - engine.x / engine.scale - engine.spacing - this._xd) / 5.08);
    this._x = this._x * 5.08 + engine.x / engine.scale + engine.spacing;
    this._y = Math.floor((y - engine.y / engine.scale - engine.module0.h - 2*engine.spacing) / engine.row_height);
    this._y = this._y * engine.row_height + engine.y / engine.scale + engine.module0.h + 2*engine.spacing;

    this._xy = engine.closest_place(this, this._x, this._y, engine.modules);
    if (this._xy != null) {
      this.x = this._xy[0];
      this.y = this._xy[1];
      engine.update_width();
      engine.changed=true;
    }
  }

  mouse_released(x, y, dx, dy) { 
    engine.undo_checkpoint();
  }

  save() {
    let s = {
      'name': this.constructor.name,
      'i': {},
      'c': {},
      'pos': [Math.round(engine.x2hp(this.x)), Math.round(engine.y2hp(this.y))]
    };
    for (var name in this.i) { if (this.i[name].save) { s['i'][name] = this.i[name].save(); } }
    for (var name in this.c) { if (this.c[name].save) { s['c'][name] = this.c[name].save(); } }
    return s;
  }

  load(s) {
    for (var name in s['i']) if (this.i[name]) this.i[name].load(s['i'][name]);
    for (var name in s['c']) if (this.c[name]) this.c[name].load(s['c'][name]);
    engine.place_module(this, s['pos']);
    engine.changed = true;
  }
}

// AUDIO

class Module0 extends Module {

  constructor() {
    super({w:hp2x(4)});
    this.name = '';
    this.add_input(new Port({x:hp2x(0.8), y:88, r:5, name:'LEFT'}));
    this.add_input(new Port({x:hp2x(0.8), y:108, r:5, name:'RIGHT'}));

    this.L = 0;
    this.R = 0;

    this.hash = ''
  }

  draw_cbf(buf, w, h) {
    super.draw_cbf(buf, w, h);
    // let sw = 1;
    // buf.stroke(60); buf.strokeWeight(sw); buf.fill(255);
    // buf.rect(sw + w * 0.2, sw + h * 0.63, w * 0.6 - 2 * sw, h * 0.038 - 2 * sw);

    let sw = 0.1;
    buf.textSize(h / 2);
    buf.fill(60);
    buf.textAlign(buf.LEFT, buf.CENTER);
    buf.strokeWeight(sw);
    buf.text('MetaRack Genesis', w * 0.015, h / 2);
  }

  draw_dbf(buf, x, y, w, h) {
    // buf.stroke(60);
    // buf.strokeWeight(0.4);
    // for (var i = 0; i < 10; i ++) {
    //   if (Math.abs(this.L) > i) buf.fill(120);
    //   else buf.fill(250);
    //   buf.circle(x + w * 0.3, y + h * 0.6 - h * i * 0.057, w * (0.1 + 0.005 * i));
    //   if (Math.abs(this.R) > i) buf.fill(120);
    //   else buf.fill(250);
    //   buf.circle(x + w * 0.7, y + h * 0.6 - h * i * 0.057, w * (0.1 + 0.005 * i));
    // }
  }

  set_size(w, h) {
    super.set_size(w, h);
    if (this.i) {
      this.i['LEFT'].set_position(this.w - 30, this.h / 12);
      this.i['RIGHT'].set_position(this.w - 17.5, this.h / 12);
    }
  }

  process() {
    if (this.i['RIGHT'].port.wires.length == 0) {
      this.L = this.i['LEFT'].get();
      this.R = this.L;
    } else {
      this.L = this.i['LEFT'].get();
      this.R = this.i['RIGHT'].get();
    }
  }

  mouse_dragged(x, y, dx, dy) {}
}

// ENGINE

class Engine extends GraphicObject {
  constructor({w=rackwidth, h=rackheight, visible=true}={}) {
    super({w:w, h:h, visible:visible});
    this.module_registry = {};
    this.module_keys = [];

    this.module_style = new ModuleStyle();
    this.port_style = new PortStyle();
    this.wire_style = new WireStyle();
    this.background_color = 255;

    this.undo_size = 20;
    this.actions_buffer = new Array(this.undo_size);
    this.current_time = 0;
    for (let i = 0; i < this.undo_size; i++) this.actions_buffer[i] = [0, {}];

    this.spacing = 1;
    this.row_height = 130.5;
    this.drag_enabled = false;
    this.scale_enabled = false;

    this.stop = false;

    this.module0_height = 0.15;
    this.module0 = new Module0();
    this.module0.set_position(this.spacing, this.spacing);
    this.attach(this.module0);

    this.save_endpoint = null;

    this.reinit();
  }

  reinit() {
    this.reinit_patch();
    this.reinit_view();
    this.reinit_iterators();
  }

  reinit_patch() {
    this.modules = [];
    this.module_index = {0: this.module0};
    this.wires = [];
    this.rows = 2;
    this.rack_max_width = 0;
    this.active_module = null;
    this.state = null;
  }

  reinit_view() {
    this.res_multiplier = 1.5;
    this.scale = this.h / (this.row_height * (this.rows + this.module0_height));
    this.control_focus = null;
    this.active_wire = null;

    this.cbf = null;
    this.sbf = null;
    this.dbf = null;
    this.wbf = null;

    this.wbf_changed = true;
    this.changed = true;
  }

  reinit_iterators() {
    this.i_process = 0;
    this.i_draw = 0;
    this.i_mouse = 0;
    this.i_width = 0;
    this.i_save = 0;
    this.id_module = null;
  }

  draw(x, y) {
    if (!this.visible) return;
    this.ax = x; this.ay = y;
    if (!this.cbf) this.cbf = createGraphics(this.w, this.h);
    if (!this.sbf) this.sbf = createGraphics(this.w, this.h);
    if (!this.dbf) this.dbf = createGraphics(this.w, this.h);
    if (!this.wbf) this.wbf = createGraphics(this.w, this.h);
    
    if (this.changed || this.wbf_changed) { this.wbf.clear(); }
    
    if (this.changed) { this.sbf.clear(); }
    
    this.dbf.clear();

    this.cbf.push(); this.sbf.push(); this.dbf.push(); this.wbf.push();
    this.cbf.scale(this.scale); this.sbf.scale(this.scale); this.dbf.scale(this.scale); this.wbf.scale(this.scale);

    if (this.changed) {
      this.cbf.background(100);
      this.cbf.fill(60);
      this.cbf.strokeWeight(0.3);
      this.cbf.rect(0, this.spacing, this.w, 3);
      for (let h = hp2y(this.module0_height); h <= this.h; h += this.row_height) {
        this.cbf.rect(0, h + this.spacing, this.w, 3);
        this.cbf.rect(0, h + this.row_height / 2 - 10, this.w, 20);
        this.cbf.rect(0, h - 3 - this.spacing, this.w, 3);
      }
    }

    if (this.module0) {
      if (this.changed) this.module0.changed = true;
      this.module0.proxy_draw(this.cbf, this.sbf, this.dbf, 0, 0);
    }

    for (this.i_draw = 0; this.i_draw < this.modules.length; this.i_draw ++) {
      if (this.changed) this.modules[this.i_draw].changed = true;
      this.modules[this.i_draw].proxy_draw(this.cbf, this.sbf, this.dbf, this.x / this.scale, this.y / this.scale);
    }

    if (this.changed || this.wbf_changed) 
      for (this.i_draw = 0; this.i_draw < this.wires.length; this.i_draw ++) 
        this.wires[this.i_draw].draw(this.wbf, this.x / this.scale, this.y / this.scale);
    this.cbf.pop(); this.sbf.pop(); this.dbf.pop(); this.wbf.pop();
    image(this.cbf, x, y, this.w, this.h);
    image(this.sbf, x, y, this.w, this.h);
    image(this.dbf, x, y, this.w, this.h);
    image(this.wbf, x, y, this.w, this.h);
    const sw = 3; stroke(60); strokeWeight(sw); noFill(); rect(x + sw / 2, y + sw / 2, this.w - sw, this.h - sw);
    this.changed = false;
    //this.wbf_changed = false;
  }

  update_width() {
    this.rack_max_width = 0;
    for (this.i_width = 0; this.i_width < this.modules.length; this.i_width ++)
      if (this.rack_max_width < this.x2hp(this.modules[this.i_width].x + this.modules[this.i_width].w)) 
        this.rack_max_width = this.x2hp(this.modules[this.i_width].x + this.modules[this.i_width].w);
  }

  add_module_class(mc) { this.module_registry[mc.name] = mc; this.module_keys.push(mc.name) }

  add_module(m) { 
    this.modules.push(m);
    if (this.id_module) m.id = this.id_module;
    else m.id = parseInt(Object.keys(this.module_index).reduce((a, b) => parseInt(a) > parseInt(b) ? a : b)) + 1;
    this.module_index[m.id] = m;
    this.attach(m);
    this.place_module(m);
    this.update_width();
    this.undo_checkpoint();
  }


  add_wire(w) { 
    //w.style.core=[198, 70, 15, 255];
    this.wires.push(w); 
    this.wbf_changed = true;
  }

  undo_checkpoint() {
    if (this.disable_log) return;
    this.current_time = performance.now() / 1000;
    this.state = this.save_state();
    if (this.current_time - this.actions_buffer[this.undo_size-1][0] > 1) {
      if (JSON.stringify(this.state) === JSON.stringify(this.actions_buffer[this.undo_size-1][1])) return;
      this.actions_buffer.shift();
      this.actions_buffer.push([this.current_time, this.state]);
    } else {
      this.actions_buffer[this.undo_size-1][1] = this.state;
    }
  }

  undo_last_action() {
    this.disable_log = true;
    let s0 = this.actions_buffer.pop()[1];
    this.actions_buffer.unshift([0,'']);
    let s1 = this.actions_buffer[this.undo_size - 1][1];
    if (Object.keys(s1).length === 0) {
      this.undo_checkpoint();
      this.disable_log = false;
      return;
    }
    for (const m in this.module_index) if (!s1['modules'][m] && m != 0) {
      this.remove_module(this.module_index[m]);
    }
    for (const m in s1['modules']) {
      if (!this.module_index[m]) {
        this.id_module = m;
        new this.module_registry[s1['modules'][m]['name']]();
        this.id_module = null;
      }
      this.module_index[m].load(s1['modules'][m]);
    }
    for (const w of this.wires) {
      if (!this.find_wire(w.save(), s1['wires'])) {
        this.remove_wire(w);
      }
    }
    this.state = this.save_state();
    for (const w of s1['wires']) { 
      if (!this.find_wire(w, this.state['wires'])) {
        this.module_index[w.a.mid].o[w.a.pid].connect(this.module_index[w.b.mid].i[w.b.pid]); 
      }
    } 
    this.disable_log = false;
    // this.undo_checkpoint();
  }

  remove_module(m) {
    for (const inp in m.i) m.i[inp].port.remove_all_wires();
    for (const out in m.o) m.o[out].port.remove_all_wires();
    let i = this.modules.indexOf(m); 
    if (i !== -1) this.modules.splice(i, 1);
    this.detach(m);
    delete this.module_index[m.id];
    this.changed = true;
    this.undo_checkpoint();
  }

  delete_last_module() {
    if (this.active_module != 0) 
      this.remove_module(this.active_module);
    this.active_module = 0;
  }

  find_wire(w, wires=this.wires) {
    let i = 0;
    while (i < wires.length) {
      if (wires[i].a.mid === w.a.mid && wires[i].b.mid === w.b.mid && 
          wires[i].a.pid === w.a.pid && wires[i].b.pid === w.b.pid){
        return wires[i];
      }
      i++;
    }
    return null;
  }

  remove_wire(w) {
    let i = this.wires.indexOf(w);
    if (i !== -1) this.wires.splice(i, 1);
    w.disconnect();
    this.undo_checkpoint();
  }

  set_size(w, h) {
    super.set_size(w, h);
    if (this.modules) this.replace_modules();
    this.reinit_view();
    if (this.module0) 
      this.module0.set_size(
        this.w / this.scale - this.spacing * 2, 
        hp2y(this.module0_height) - this.spacing * 2
      );
  }

  set_module_style(ms) { this.module_style = ms; }

  set_port_style(ps) { this.port_style = ps; }

  set_wire_style(ws) { this.wire_style = ws; }

  set_offset(x, y) { 
    if (x > 0) x = 0;
    if (x < this.x && this.hp2x(this.rack_max_width) + this.spacing < (this.w - x) / this.scale) return;
    if (this.x != x || this.y != y) {
      this.x = x; this.y = y; 
      this.changed = true;
    }
  }

  start_wire(x, y, w) {
    this.active_wire = w;
    let i = this.wires.indexOf(w);
    if (i == -1) this.add_wire(w);
    [w.x, w.y] = [x, y];
    this.wbf_changed = true;
  }

  move_wire(x, y) { [this.active_wire.x, this.active_wire.y] = [x, y]; this.wbf_changed = true; }

  end_wire(x, y) {
    let b = this.find_focus(x, y);
    let res = this.active_wire.connect(this.active_wire.a, b);
    if (res) this.undo_checkpoint();
    else this.remove_wire(this.active_wire);
    this.active_wire = null;
    this.wbf_changed = true;
  }

  find_focus(x, y) {
    this.focus = this.module0.find_focus(x + this.x / this.scale, y + this.y / this.scale);
    if (this.focus != null) return this.focus;
    for (this.i_mouse = 0; this.i_mouse < this.modules.length; this.i_mouse++) {
      this.focus = this.modules[this.i_mouse].find_focus(x, y);
      if (this.focus != null) { 
        this.active_module = this.modules[this.i_mouse];
        return this.focus;
      }
    }
    return null;
  }

  mouse_pressed(x, y, dx, dy) {
    this.find_focus((x - this.x) / this.scale, (y - this.y) / this.scale);
    if (this.focus != null) {
      this.focus.mouse_pressed((x - this.x) / this.scale, (y - this.y) / this.scale, dx / this.scale, dy / this.scale);
    }
  }

  mouse_dragged(x, y, dx, dy) {
    if (this.focus != null) this.focus.mouse_dragged((x - this.x) / this.scale, (y - this.y) / this.scale, dx / this.scale, dy / this.scale);
    else if (this.drag_enabled) {
      this.x += dx;
      this.y += dy;
      this.changed = true;
    }
  }

  mouse_released(x, y, dx, dy) {
    if (this.focus != null) this.focus.mouse_released((x - this.x) / this.scale, (y - this.y) / this.scale, dx / this.scale, dy / this.scale);
    this.focus = null;
  }

  double_clicked(x, y, dx, dy) {
    this.find_focus((x - this.x) / this.scale, (y - this.y) / this.scale);
    if (this.focus != null) {
      this.focus.double_clicked((x - this.x) / this.scale, (y - this.y) / this.scale, dx / this.scale, dy / this.scale);
    }
  }

  x2hp(x) { return x2hp(x - this.spacing, true); }
  y2hp(y) { return y2hp(y - this.spacing - this.module0.h, true); }
  hp2x(xhp){ return hp2x(xhp) + this.spacing; }
  hp2y(yhp){ return hp2y(yhp) + this.module0.h + (yhp + 1) * 2 * this.spacing + this.spacing; }

  closest_place(m, x, y, modules=null) {
    if (!modules) modules = this.modules;
    let mxhp = this.x2hp(x);
    let myhp = this.y2hp(y);

    if (mxhp < 0) mxhp = 0;
    if (myhp < 0) myhp = 0;
    if (myhp > this.rows - 1) myhp = this.rows - 1;

    for (let i = 0; i < modules.length; i++) {
      if (modules[i] == m) continue;
      let ixhp = this.x2hp(modules[i].x);
      let iyhp = this.y2hp(modules[i].y);
      if (((ixhp >= mxhp && ixhp < mxhp + x2hp(m.w, true)) ||
           (mxhp >= ixhp && mxhp < ixhp + x2hp(modules[i].w, true))) && 
           (iyhp == myhp)) {
        return null;
      }
    }

    return [this.hp2x(mxhp), this.hp2y(myhp)];
  }

  place_module(m, pos=null, modules=null) {
    if (pos) {
      let xy = this.closest_place(m, this.hp2x(pos[0]), this.hp2y(pos[1]), modules);
      if (xy != null) { m.set_position(xy[0], xy[1]); return; }
    }
    for (let x = 0; ; x++) {
      for (let y = 0; y < this.rows; y ++) {
        let x_px = this.hp2x(x);
        let y_px = this.hp2y(y);
        let xy = this.closest_place(m, x_px, y_px, modules);
        if (xy != null) { m.set_position(xy[0], xy[1]); return; }
      }
    }
  }

  replace_modules() {
    let modules = [];
    for (let i = 0; i < this.modules.length; i ++) {
      this.place_module(this.modules[i], null, modules);
      modules.push(this.modules[i]);
    }
  }

  process() {
    // if (this.stop) return;
    this.module0.process();
    for (this.i_process = 0; this.i_process < this.wires.length; this.i_process ++) this.wires[this.i_process].process();
    for (this.i_process = 0; this.i_process < this.modules.length; this.i_process ++) this.modules[this.i_process].process();
  }

  clear_state() {
    while (this.wires.length > 0) this.remove_wire(this.wires[0]);
    this.reinit();
  }

  save_state() {
    let s = {
      'modules': {},
      'wires': []
    };
    for (this.i_save = 0; this.i_save < this.modules.length; this.i_save ++) {
      s['modules'][this.modules[this.i_save].id] = this.modules[this.i_save].save();
    }
    for (this.i_save = 0; this.i_save < this.wires.length; this.i_save ++) s.wires.push(this.wires[this.i_save].save());
    
    if (this.save_endpoint) {
      try {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", this.save_endpoint, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
          'state': s
        }));
      } catch {
        console.log('unable to sync with server');
      }
    }

    return s;
  }

  load_state(s) {
    let module_index = {'0': this.module0};

    for (const m in s['modules']) {
      try {
        module_index[m] = new this.module_registry[s['modules'][m]['name']]();
        module_index[m].load(s['modules'][m]); 
      } catch (error) {
        console.log(m);
        console.error(error);
      }
    } 
    for (const w of s['wires']) { 
      try {
        module_index[w.a.mid].o[w.a.pid].connect(module_index[w.b.mid].i[w.b.pid]); 
      } catch (error) {
        console.log(w);
        console.error(error);
      }
    }
    this.undo_checkpoint();
  }

  set_save_endpoint(url) {
    this.save_endpoint = url;
  }
}

function metamodule(m) {
  return function() {
    const result = m();
    engine.add_module_class(m);
    return result;
  }
}

// ADDITIONAL_METHODS

let audioContext;
engine = new Engine({w:10, h:10, visible:false});

function mousePressed() {
  if (mouseX > engine.ax && mouseX < engine.ax + engine.w && mouseY > engine.ay && mouseY < engine.ay + engine.h) {
    if (mouseButton == LEFT) engine.mouse_pressed(mouseX - engine.ax, mouseY - engine.ay, movedX, movedY);
    if (mouseButton == RIGHT) console.log('prop');
  }
}

function mouseDragged() {
  engine.mouse_dragged(mouseX - engine.ax, mouseY - engine.ay, movedX, movedY);
}

function mouseReleased() {
  engine.mouse_released(mouseX - engine.ax, mouseY - engine.ay, movedX, movedY);
}

function doubleClicked() {
  engine.double_clicked(mouseX - engine.ax, mouseY - engine.ay, movedX, movedY);
}

function mouseWheel() {
  engine.set_offset(engine.x - event.deltaX / 5, 0);
}

function keyPressed() {
  if (keyCode === 16) {
    engine.cmdpressed = true;
  }
  if (keyCode === 83) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(engine.save_state())], {
      type: "text/plain"
    }));
    a.setAttribute("download", "state.mrs");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // engine.save_state();
  }

  if (keyCode === 76) {
    var input = document.createElement('input');
    input.type = 'file';
    input.onchange = e => { 
       // getting a hold of the file reference
       var file = e.target.files[0]; 

       // setting up the reader
       var reader = new FileReader();
       reader.readAsText(file,'UTF-8');

       // here we tell the reader what to do when it's done reading...
       reader.onload = readerEvent => {
          var content = readerEvent.target.result; // this is the content!
          engine.load_state( JSON.parse(content) );
       }
    }
    input.click();
  }

  if (keyCode === 67) {
    engine.clear_state();
  }

  if (keyCode === 85) {
    engine.undo_last_action();
  }

  if (keyCode === 8) {
    engine.delete_last_module();
  }

  if (keyCode === 70) {
    document.body.requestFullscreen();
  }
}

document.addEventListener('fullscreenchange', (event) => { 

  setTimeout(function () {
    rackwidth = document.documentElement.clientWidth;
    rackheight = document.documentElement.clientHeight;
    resizeCanvas(rackwidth, rackheight);
    // canvas.position(0, 0)
    engine.set_size(rackwidth, rackheight);
    // //engine.replace_modules();

    // let max = 0;

    // engine.gchildren.forEach(element => {
    //   if (element.name.length > 0) {
    //     if ((element.x + element.w) > max) {
    //       max = element.x + element.w;
    //     }
    //   }
    // });

    // engine.gchildren[0].set_size(max - 1, engine.gchildren[0].h)
    // engine.w = (max + 1) * engine.scale;

    // // console.log(engine.gchildren[0].x, engine.gchildren[0].y)

    // aspect = engine.w / rackwidth;

    // if (aspect > 1) {
    //   engine.set_size(pw, engine.h / aspect);
    //   engine.replace_modules();
    // }
  }, 50);
  
});

function keyReleased() {
  if (keyCode === 91) {
    engine.cmdpressed = false;
  }
}

// function windowResized() {
//   engine.stop = true;
//   rackwidth = document.documentElement.clientWidth;
//   rackheight = document.documentElement.clientHeight;
//   resizeCanvas(rackwidth, rackheight);
//   //engine.set_size(rackwidth * 0.8, rackheight * 0.8);
//   engine.set_size((pw - engine.w)/2, ph);
//   engine.stop = false;
// }

function engine_run() {
  audioContext = new AudioContext();
  let scriptNode = audioContext.createScriptProcessor(2048, 0, 2);

  scriptNode.onaudioprocess = function(audioProcessingEvent) {
    let outputBuffer = audioProcessingEvent.outputBuffer;

    let outputL = outputBuffer.getChannelData(0);
    let outputR = outputBuffer.getChannelData(1);
    for (let sample = 0; sample < outputL.length; sample++) {
      engine.process();
      outputL[sample] = engine.module0.L;
      outputR[sample] = engine.module0.R;
    }
  }

  scriptNode.connect(audioContext.destination);
}