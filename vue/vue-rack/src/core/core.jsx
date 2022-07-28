import EngineVue from "../components/Engine.vue"
import ModuleVue from "../components/Module.vue"
import PortVue from "../components/Port.vue"
import ProtoPortVue from "../components/ProtoPort.vue"
import InputEncoderVue from "../components/InputEncoder.vue"

let rackrand = Math.random;

let rackwidth = document.documentElement.clientWidth;
let rackheight = document.documentElement.clientHeight;
let fps = 20;
let sample_rate = 44100;
let background_color = 255;

export function hp2x(hp, round=false) {if (round) return Math.round(hp) * 5.08; return hp * 5.08;}
export function hp2y(hp, round=false) {if (round) return Math.round(hp) * 128.5; return hp * 128.5;}
export function x2hp(x, round=false)  {if (round) return Math.round(x / 5.08); return x / 5.08;}
export function y2hp(y, round=false)  {if (round) return Math.round(y / 128.5); return y / 128.5;}

export function pow2(x, xr=0, y=1, c=1) {
  if (x < 0) { x += 20; c = 1048576; }
  xr = Math.floor(x);
  if (xr > 1) y = 2 << (xr - 1);
  if (x == 0) return 1;
  x -= xr;
  y *= 0.9999976457798443 + x * (0.6931766804601935 + x * (0.2400729486415728 + x * (0.05592817518644387 + x * (0.008966320633544 + x * 0.001853512473884202))));
  return y / c;
}

export class PortStyle {
  constructor(hole=45, ring=120, text=60, hastext=true){
    this.hole = hole;
    this.ring = ring;
    this.text = text;
    this.hastext = hastext;
  }
}

export class WireStyle {
  constructor(core=[100, 100, 180, 255], edge=40) {
    this.core = core;
    this.edge = edge;
  }
}

export class ModuleStyle {
  constructor(panel=[140, 80, 100, 255], frame=10, shadow=70, name=40, lining=180, label=255, background=255) {
    this.panel = panel;
    this.frame = frame;
    this.shadow = shadow;
    this.name = name;
    this.label = label;
    this.lining = lining;
    this.background = background;
  }
}

export class GraphicObject {
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
    this.changed = true;

    this.fps = 20;

    this.cbf = null;
    this.sbf = null;
    this.dbf = null;

    this.scale = 1;
  }

  mouse_pressed(x, y, dx, dy) { console.warn(this.name + ' press method undefined'); }
  mouse_dragged(x, y, dx, dy) { console.warn(this.name + ' drag method undefined'); }
  mouse_released(x, y, dx, dy) { console.warn(this.name + ' release method undefined'); }
  double_clicked(x, y, dx, dy) { console.warn(this.name + ' doubleclick method undefined'); }

  set_position(x, y) { this.x = x; this.y = y; }
  set_size(w, h) { 
    this.w = w; this.h = h; 
    this.changed = true;
  }

  contains(x, y) { if (x < this.x || y < this.y || x > this.x + this.w || y > this.y + this.h) return false; return true; }

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

  attach(go) { this.gchildren.push(go); go.gparent = this; go.changed = true; }
  detach(go) { let i = this.gchildren.indexOf(go); if (i !== -1) this.gchildren.splice(i, 1); }
}

export class ProtoPort extends GraphicObject {
  constructor({x=10, y=10, r=7, name='', style=new PortStyle(), default_value=0, visible=true, isinput=false, engine=null}={}) {
    super({x:x, y:y, w:r*2, h:r*2, name:name, visible:visible});
    this.channels = 1;
    this.engine = engine;
    this.isinput = isinput;
    this.in_wire = null;
    this.wires = [];
    this.default_value = default_value;
    this.value = this.default_value;
    this.style = style;
    this.port = this;

    this.component = InputEncoderVue;
  }

  mouse_pressed(engine, x, y, dx, dy) { 
    // console.log(this.name)
    if (this.engine != null) {
      this.engine.start_wire(x, y, this.spawn_or_get_wire()); 
    }
  }
  mouse_dragged(engine, x, y, dx, dy) { 
    if (this.engine != null)
      this.engine.move_wire(x, y); 
  }
  mouse_released(engine, x, y, dx, dy) { 
    if (this.engine != null)
      this.engine.end_wire(x, y); 
    // console.log(this.name)
  }

  draw_cbf(p5, w, h) {
    this.cbf = p5.createGraphics(w, h);
    let sw = 1.5;
    this.cbf.background(0,0,0,0);

    this.cbf.stroke(this.style.ring); this.cbf.strokeWeight(sw); this.cbf.fill(this.style.hole);
    this.cbf.circle(w / 2, h / 2, w - 2 * sw);
    this.cbf.circle(w / 2, h / 2, w - 6 * sw);
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

  connect(engine, port) {
    let w = new Wire();
    w.connect(this, port);
    engine.add_wire(w);
  }

  plug_wire(w) { 
    this.wires.push(w); 
    this.changed = true;
    if (this?.gparent) this.gparent.changed = true;
  }

  unplug_wire(w) {

    // if ((w.a != null) && (w.b != null)) {
    //   if (w.b.isinput) {
    //     w.a.module.node.disconnect(w.b.module.node, w.a.module.outputs[w.a.name], w.b.module.inputs[w.b.name]);
    //   }
    //   else {
    //     w.b.module.node.disconnect(w.a.module.node, w.b.module.outputs[w.b.name], w.a.module.inputs[w.a.name]);
    //   }
    // }

    let i = this.wires.indexOf(w);
    if (i !== -1) this.wires.splice(i, 1);
    if (this == w.a) w.a = null;
    if (this == w.b) w.b = null;
    this.changed = true;
    if (this?.gparent) this.gparent.changed = true;
    this.value = this.default_value;
  }

  spawn_or_get_wire() {
    if (this?.wires.length > 0) {
      let w = this.wires[this.wires.length - 1];
      this.unplug_wire(w);
      if (w.a == null) [w.a, w.b] = [w.b, w.a];
      return w;
    }
    return new Wire({a: this});
  }

  remove_all_wires(engine) {
    while (this.wires.length > 0) engine.remove_wire(this.wires[0]);
    if (this?.in_wire) engine.remove_wire(this.in_wire);
  }
}

export class Port extends GraphicObject {
  constructor({x=0, y=0, r=10, name='', style=new PortStyle(), default_value=0, visible=true, isinput=false, engine=null}={}) {
    super({x:x, y:y, w:2*r, h:r*3, name:name, visible:visible});
    let pr = r * Math.pow(7 / this.w, 0.8);
    let px = this.w / 2 - pr;
    let py = this.h / 1.5 / 2 - pr;
    this.port = new ProtoPort({x:px, y:py, r:pr, name:name, default_value: default_value, engine:engine});
    this.attach(this.port);

    this.component = InputEncoderVue;
  }

  draw_cbf(p5, w, h) {
    this.cbf = p5.createGraphics(w, h);
    let sw = 1;
    this.cbf.stroke(60); this.cbf.strokeWeight(sw); this.cbf.fill(255);
    this.cbf.rect(sw + w * 0.05, h / 1.5 + sw + h * 0.05, w - 2 * sw - w * 0.1, h / 3 - 2 * sw - h * 0.1);

    this.cbf.textSize(w / 4);
    this.cbf.fill(60);
    this.cbf.textAlign(p5.CENTER, p5.CENTER);
    this.cbf.strokeWeight(sw / 10);
    this.cbf.text(this.name.substring(0,5), w / 2, h * 5 / 6 + 1);
  }

  set(value) { this.port.value = value; }

  get() { return this.port.value; }

  connect(engine, c) {
    let w = new Wire();
    w.connect(engine, this.port, c.port);
    engine.add_wire(w);
  }
}
export class Encoder extends GraphicObject {
  constructor({x=0, y=0, r=10, name='?', val=5, vmin=-10, vmax=10, precision=6, mod=0.1}={}) {
    super({x:x, y:y, w:2*r, h:3*r, name:name});
    this.def_val = val;
    this.def_mod = mod;
    this.base_val = val;
    this.vmin = vmin;
    this.vmax = vmax;
    this.mod = mod;

    this.component = InputEncoderVue;

    this.ang_low = 0;
    this.ang_high = 0;

    this.rc = 0.8;
    this.r = 0;

    this.precision = Math.min(precision, Math.min(2, 2 - Math.floor(Math.log10(Math.abs(vmax - vmin) / 20))));
    this.prev_base_val = this.base_val;
    this.sample_counter = 0;
    this.nochange_counter = 0;
    this.nochange_flag = false;
  }

  val2ang(val) {
    let ang = (val - this.vmin) / (this.vmax - this.vmin) * 1.5 * Math.PI;
    if (ang > 1.5 * Math.PI) ang = 1.5 * Math.PI;
    if (ang < 0) ang = 0;
    return ang;
  }

  draw_cbf(p5, w, h) {
    this.cbf = p5.createGraphics(w, h);
    let sw = 1;
    this.r = w / 2 * this.rc;
    this.cbf.noStroke(); this.cbf.fill(255);
    this.cbf.circle(w / 2, w / 2, this.r * 2 + sw * 8);
    this.cbf.stroke(60); this.cbf.strokeWeight(sw); this.cbf.fill(255);
    this.cbf.circle(w / 2, w / 2, this.r * 2 - 2 * sw);
  }

  draw_sbf(p5, w, h) {
    this.sbf = p5.createGraphics(w, h);
    this.r = w / 2 * this.rc;
    let sw = 3;
    sw = 4;
    this.sbf.stroke(60); this.sbf.strokeWeight(sw); this.sbf.noFill();
    this.ang_high = this.val2ang(this.base_val.toFixed(this.precision)) + p5.HALF_PI;
    if (this.ang_high - p5.HALF_PI > 0.05) 
      this.sbf.arc(w / 2, w / 2, this.r * 2 - 2 * sw, this.r * 2 - 2 * sw, p5.HALF_PI, this.ang_high - 0.05);
    else 
      this.sbf.arc(w / 2, w / 2, this.r * 2 - 2 * sw, this.r * 2 - 2 * sw, this.ang_high - 0.05, p5.HALF_PI);
    sw = 2;
    this.sbf.strokeWeight(sw);
    this.sbf.line(w / 2 + Math.cos(this.ang_high) * (this.r - 5), w / 2 + Math.sin(this.ang_high) * (this.r - 5), 
             w / 2 + Math.cos(this.ang_high) * (this.r + 1), w / 2 + Math.sin(this.ang_high) * (this.r + 1));

    sw = 1;
    this.sbf.stroke(60); this.sbf.strokeWeight(sw); this.sbf.fill(255);
    this.sbf.rect(sw + w * 0.1, h / 1.5 + sw + h * 0.05, w - 2 * sw - w * 0.2, h / 3 - 2 * sw - h * 0.1);

    sw = 0.1;
    this.sbf.textSize(w / 4);
    this.sbf.fill(60);
    this.sbf.textAlign(p5.CENTER, p5.CENTER);
    this.sbf.strokeWeight(sw);
    this.sbf.text(this.base_val.toFixed(this.precision), w / 2, h / 3);
    this.sbf.text(this.name.substring(0,4), w / 2, h * 5 / 6 + 1);
  }

  get() { 
    return this.base_val;
  }

  set(v) { this.prev_base_val = this.base_val; this.sample_counter = 0; this.base_val = v; this.changed = true; }

  mouse_pressed(engine, x, y, dx, dy) { this.prev_base_val = this.base_val; this.sample_counter = 0; this.changed = true; }
  mouse_dragged(engine, x, y, dx, dy) { 
    this.prev_base_val = this.base_val;
    this.sample_counter = 0;
    this.base_val -= dy / 250 * (this.vmax - this.vmin); 
    if (this.base_val > this.vmax) this.base_val = this.vmax;
    if (this.base_val < this.vmin) this.base_val = this.vmin + 0.0001;
    this.changed=true;
  }
  mouse_released(engine, x, y, dx, dy) { this.prev_base_val = this.base_val; this.sample_counter = 0; this.changed = true; engine.undo_checkpoint();}
  double_clicked(engine, x, y, dx, dy) { this.prev_base_val = this.base_val; this.sample_counter = 0; this.base_val = this.def_val; this.mod = this.def_mod; this.changed = true; engine.undo_checkpoint();}

  save() { return this.base_val.toFixed(6); }
  load(s) { 
    this.base_val = parseFloat(s); 
    if (this.base_val > this.vmax) this.base_val = this.vmax;
    if (this.base_val < this.vmin) this.base_val = this.vmin;
    this.changed = true; 
  }
}

export class InputEncoder extends Encoder {
  constructor(...args) {
    super(...args);
    this.port = new ProtoPort({x:this.w / 2 + this.w / 8 / 1.5, y: this.h / 3 + this.h / 8 / 1.5, r: this.w / 4 - this.w / 16, name:this.name, engine:args[0].engine});
    this.attach(this.port);
    this.mod_coef = 0.1 * this.mod * (this.vmax - this.vmin);
    this.val = this.base_val;
    this.port.isinput = true;

    this.component = InputEncoderVue;
  }

  draw_sbf(p5, w, h) {
    super.draw_sbf(p5, w, h);

    if (this.port.isinput && this.port.wires.length > 0) {
      let sw = 1.5;
      let dv = this.mod * (this.vmax - this.vmin);
      this.ang_low = this.val2ang(this.base_val - dv) + p5.HALF_PI;
      this.sbf.stroke(60); this.sbf.strokeWeight(sw); this.sbf.noFill();
      this.ang_high = this.val2ang(this.base_val + dv) + p5.HALF_PI;
      this.sbf.line(w / 2 + Math.cos(this.ang_high) * (this.r - 1), w / 2 + Math.sin(this.ang_high) * (this.r - 1), 
           w / 2 + Math.cos(this.ang_high) * (this.r + 3), w / 2 + Math.sin(this.ang_high) * (this.r + 3));

      if (this.ang_low < this.ang_high) {
        if (Math.abs(this.ang_low - this.ang_high) > 0.001) 
          this.sbf.arc(w / 2, w / 2, this.r * 2 + 2 * sw, this.r * 2 + 2 * sw, this.ang_low, this.ang_high); this.sbf.fill(255);
        this.sbf.circle(w / 2 + Math.cos(this.ang_low) * (this.r + 2), w / 2 + Math.sin(this.ang_low) * (this.r + 2), 6);
      } else {
        if (Math.abs(this.ang_low - this.ang_high) > 0.001) 
          this.sbf.arc(w / 2, w / 2, this.r * 2 + 2 * sw, this.r * 2 + 2 * sw, this.ang_high, this.ang_low); this.sbf.fill(255);
        this.sbf.circle(w / 2 + Math.cos(this.ang_low) * (this.r + 2), w / 2 + Math.sin(this.ang_low) * (this.r + 2), 6);
      }
    }
  }

  draw_dbf(p5, buf, x, y, w, h) { this.mod_coef = (this.port.wires.length > 0) * 0.1 * this.mod * (this.vmax - this.vmin); }
  
  get() { 
    return this.base_val + this.mod_coef * this.port.get(); 
  }
  set(v) { this.prev_base_val = this.base_val; this.sample_counter = 0; this.base_val = v; this.changed = true;}
  connect(engine, c) {
    let w = new Wire();
    w.connect(engine, this.port, c.port);
    engine.add_wire(w);
  }

  mouse_dragged(engine, x, y, dx, dy) {
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

export class Wire extends GraphicObject {
  constructor({a=null, b=null, style=new WireStyle()}={}) {
    super();
    this.a = a;
    this.b = b;
    this.style = style;
  }

  process() {
    if (!this.a || !this.b) return;
    if (this?.b.isinput) this.b.value = this.a.value;
    if (this?.a.isinput) this.a.value = this.b.value;
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
    buf.strokeWeight(0.5);
    if (this?.a) buf.circle(p1[0], p1[1], this.a.w * 0.7);
    else buf.circle(p1[0], p1[1], 3.5);

    if (!this.b || this.b.visible) {
      if (this?.b) buf.circle(p2[0], p2[1], this.b.w * 0.7);
      else buf.circle(p2[0], p2[1], 3.5);
      
      buf.stroke(this.style.edge);
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
    if (this?.a) {
      let p1 = this.a.get_center();
      let iter1 = this.a;
      while (iter1?.gparent != undefined) {
        p1[0] += iter1.gparent.x;
        p1[1] += iter1.gparent.y;
        iter1 = iter1.gparent;
      }
      p1[1] -= 2*this.a.scale;
      if (this?.b) {
        let p2 = this.b.get_center();
        let iter2 = this.b;
        while (iter2?.gparent != undefined) {
          p2[0] += iter2.gparent.x;
          p2[1] += iter2.gparent.y;
          iter2 = iter2.gparent;
        }
        p2[1] -= 2*this.a.scale;
        this.draw_wire(buf, p1, p2)
      } else {
        this.draw_wire(buf, p1, [x + this.x, y + this.y - 2*this.a.scale]);
      }
    }
  }

  connect(a, b) {
    // console.log([a, b])
    if ((!a || !b) || (!a.port || !b.port) || 
        (a.port.isinput == b.port.isinput) || 
        (a.port.isinput && a.port.wires.length > 0) || 
        (b.port.isinput && b.port.wires.length > 0)) 
        return false;
    if (this?.a) this.a.unplug_wire(this);
    if (this?.b) this.b.unplug_wire(this);
    this.a = a.port; this.b = b.port;
    this.a.plug_wire(this);
    this.b.plug_wire(this);
    // if (this?.b.isinput) {
    //   this.a.module.node.connect(this.b.module.node, this.a.module.outputs[this.a.name], this.b.module.inputs[this.b.name]);
    // }
    // else {
    //   this.b.module.node.connect(this.a.module.node, this.b.module.outputs[this.b.name], this.a.module.inputs[this.a.name]);
    // }
    return true;
  }

  disconnect() {
    if (this?.a) this.a.unplug_wire(this);
    if (this?.b) this.b.unplug_wire(this);
  }

  save() {
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

export class Module extends GraphicObject {
  constructor({engine, name='', x=0, y=0, w=0, h=128.5, style = new ModuleStyle()}) {
    super({x:x, y:y, w:w, h:h});
    this.engine = engine;
    this.name = this.constructor.name
    this.i = {};
    this.o = {};
    this.c = {};
    this.style = style;
    this.id = 0;
    if (this?.engine) this.engine.add_module(this);

    //this.component = ModuleVue;
    this.component = InputEncoderVue;
  }

  draw_cbf(p5, w, h) {
    this.cbf = p5.createGraphics(w, h);
    //this.cbf.scale(this.scale)
    let sw = 1.5;
    let rounding = 5;
    this.cbf.background(0,0,0,0);

    this.cbf.stroke(this.style.shadow); this.cbf.strokeWeight(sw); this.cbf.strokeJoin(p5.ROUND); this.cbf.fill(this.style.panel);
    this.cbf.rect(sw / 2, sw / 2, w - sw, h - sw, rounding, rounding, rounding, rounding);

    this.cbf.stroke(this.style.lining); this.cbf.strokeWeight(sw / 3);
    let line_step = 5;// + Math.random() * 3;
    let x1 = 0;
    while (x1 < w + h) {
      x1 += line_step;
      this.cbf.line(x1, 0, 0, x1);
    }
    this.cbf.stroke(255); this.cbf.strokeWeight(10 * p5.scale); this.cbf.noFill();
    this.cbf.arc(rounding, h - rounding, rounding*2.5, rounding*2.5, p5.HALF_PI - 0.01, p5.PI + 0.01);

    this.cbf.fill(50);
    let displ = 0.5;

    let angle;
    this.cbf.circle(2*rounding - displ, 2*rounding + displ, rounding * 1.4);
    this.cbf.circle(w - 2*rounding - displ, 2*rounding + displ, rounding * 1.4);
    this.cbf.circle(w - 2*rounding - displ, h - 2*rounding + displ, rounding * 1.4);
    this.cbf.circle(2*rounding - displ, h - 2*rounding + displ, rounding * 1.4);

    this.cbf.fill(100); this.cbf.strokeWeight(0.8); this.cbf.stroke(10);
    this.cbf.circle(2*rounding, 2*rounding, rounding * 1.5);
    this.cbf.circle(w - 2*rounding, 2*rounding, rounding * 1.5);
    this.cbf.circle(w - 2*rounding, h - 2*rounding, rounding * 1.5);
    this.cbf.circle(2*rounding, h - 2*rounding, rounding * 1.5);

    this.cbf.stroke(30); this.cbf.strokeWeight(0.8);
    angle = Math.random() * 2 * Math.PI;
    this.cbf.line(2*rounding - Math.cos(angle) * rounding * 0.75, 2*rounding + Math.sin(angle) * rounding * 0.75, 
            2*rounding + Math.cos(angle) * rounding * 0.75, 2*rounding - Math.sin(angle) * rounding * 0.75);
    angle = Math.random() * 2 * Math.PI;
    this.cbf.line(w - 2*rounding - Math.cos(angle) * rounding * 0.75, 2*rounding + Math.sin(angle) * rounding * 0.75, 
            w - 2*rounding + Math.cos(angle) * rounding * 0.75, 2*rounding - Math.sin(angle) * rounding * 0.75);
    angle = Math.random() * 2 * Math.PI;
    this.cbf.line(w - 2*rounding - Math.cos(angle) * rounding * 0.75, h - 2*rounding + Math.sin(angle) * rounding * 0.75, 
            w - 2*rounding + Math.cos(angle) * rounding * 0.75, h - 2*rounding - Math.sin(angle) * rounding * 0.75);
    angle = Math.random() * 2 * Math.PI;
    this.cbf.line(2*rounding - Math.cos(angle) * rounding * 0.75, h - 2*rounding + Math.sin(angle) * rounding * 0.75, 
            2*rounding + Math.cos(angle) * rounding * 0.75, h - 2*rounding - Math.sin(angle) * rounding * 0.75);

    if (this.name.length > 0) {
      sw = 1;
      this.cbf.stroke(30); this.cbf.strokeWeight(sw); this.cbf.fill(255);
      this.cbf.rect(w / 6, 5, w - w / 3, 20);

      sw = 0.1;
      this.cbf.textSize(15);
      this.cbf.fill(60);
      this.cbf.textAlign(p5.CENTER, p5.CENTER);
      this.cbf.strokeWeight(sw);
      this.cbf.text(this.name.substring(0, Math.floor((w - w / 3) / p5.textWidth(this.name) * this.name.length * 0.7)), w / 2, 15);
    }

    sw = 1.5;
    this.cbf.stroke(this.style.frame); this.cbf.strokeWeight(sw); this.cbf.noFill();
    this.cbf.rect(sw / 2, sw / 2, w - sw, h - sw, rounding, rounding, rounding, rounding);
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
    if (this?.engine != undefined)
      this.engine.add_wire(oport, iport, scale, offset);
  }

  mouse_pressed(engine, x, y, dx, dy) { 
    this._x = this.x;
    this._y = this.y;
    this._xd = x - this.x;
  }

  mouse_dragged(engine, x, y, dx, dy) {
    this._x = Math.floor((x - this.engine.x / this.engine.scale - this.engine.spacing - this._xd) / 5.08);
    this._x = this._x * 5.08 + this.engine.x / this.engine.scale + this.engine.spacing;
    this._y = Math.floor((y - this.engine.y / this.engine.scale - 2*this.engine.spacing) / this.engine.row_height);
    this._y = this._y * this.engine.row_height + this.engine.y / this.engine.scale + 2*this.engine.spacing;
    this._xy = this.engine.closest_place(this, this._x, this._y, this.engine.modules);
    if (this?._xy != null) {
      this.x = this._xy[0];
      this.y = this._xy[1];
      this.engine.update_width();
      //this.engine.changed=true;
    }
    //this.changed = true;
  }

  mouse_released(engine, x, y, dx, dy) { 
    engine.undo_checkpoint();
  }

  save() {
    let s = {
      'name': this.constructor.name,
      'i': {},
      'c': {},
      'pos': [Math.round(this.engine.x2hp(this.x)), Math.round(this.engine.y2hp(this.y))]
    };
    for (var name in this.i) { if (this?.i[name].save) { s['i'][name] = this.i[name].save(); } }
    for (var name in this.c) { if (this?.c[name].save) { s['c'][name] = this.c[name].save(); } }
    return s;
  }

  load(s) {
    for (var name in s['i']) if (this?.i[name]) this.i[name].load(s['i'][name]);
    for (var name in s['c']) if (this?.c[name]) this.c[name].load(s['c'][name]);
    this.engine.place_module(this, s['pos']);
    this.engine.changed = true;
  }
}

export class Engine extends GraphicObject {
  constructor({w=rackwidth, h=rackheight, visible=true}={}) {
    super({w:w, h:h, visible:visible});

    this.module_registry = {};
    this.module_keys = [];

    this.component = EngineVue;

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

    this.save_endpoint = null;

    this.reinit();
  }

  draw_cbf(p5) {
    this.cbf = p5.createGraphics(this.w, this.h);

    this.cbf.scale(this.scale);
    this.cbf.background(100);
    this.cbf.fill(60);
    this.cbf.strokeWeight(0.3);
    this.cbf.rect(0, this.spacing, this.w, 3);
    for (let h = hp2y(0); h <= this.h; h += this.row_height) {
      this.cbf.rect(0, h + this.spacing, this.w, 3);
      this.cbf.rect(0, h + this.row_height / 2 - 10, this.w, 20);
      this.cbf.rect(0, h - 3 - this.spacing, this.w, 3);
    }

    const sw = 3; this.cbf.stroke(60); this.cbf.strokeWeight(sw); this.cbf.noFill(); this.cbf.rect(this.x + sw / 2, this.y + sw / 2, this.w - sw, this.h - sw);
  }

  find_focus(x, y) {
    for (this.i_mouse = 0; this.i_mouse < this.modules.length; this.i_mouse++) {
      this.focus = this.modules[this.i_mouse].find_focus(x, y);
      if (this.focus != null) { 
        this.active_module = this.modules[this.i_mouse];
        return this.focus;
      }
    }
    return null;
  }

  set_module_style(ms) { this.module_style = ms; }

  set_port_style(ps) { this.port_style = ps; }

  set_wire_style(ws) { this.wire_style = ws; }

  reinit() {
    this.reinit_patch();
    this.reinit_view();
    this.reinit_iterators();
  }

  reinit_patch() {
    this.modules = [];
    this.module_index = {'0' : {}};
    this.wires = [];
    this.rows = 2;
    this.rack_max_width = 0;
    this.active_module = null;
    this.state = null;
  }

  reinit_view() {
    this.res_multiplier = 1.5;
    this.scale = this.h / (this.row_height * (this.rows));
    this.control_focus = null;
    this.active_wire = null;

    this.cbf = null;
    this.sbf = null;
    this.dbf = null;
    this.wbf = null;

    this.wbf_changed = true;
    this.changed = true;
  }

  set_size(w, h) {
    this.w = w;
    this.h = h;
    this.cbf = null;
    this.dbf = null;
    this.sbf = null;
    this.rows = Math.round(h / window.devicePixelRatio / 200);
    if (this.engine?.rows < 1) this.engine.rows = 1;
    if (this?.modules) this.replace_modules();
    this.reinit_view();
  }

  reinit_iterators() {
    this.i_process = 0;
    this.i_draw = 0;
    this.i_mouse = 0;
    this.i_width = 0;
    this.i_save = 0;
    this.id_module = null;
  }

  update_width() {
    this.rack_max_width = 0;
    for (this.i_width = 0; this.i_width < this.modules.length; this.i_width ++)
      if (this?.rack_max_width < this.x2hp(this.modules[this.i_width].x + this.modules[this.i_width].w)) 
        this.rack_max_width = this.x2hp(this.modules[this.i_width].x + this.modules[this.i_width].w);
  }

  add_module_class(mc) { this.module_registry[mc.name] = mc; this.module_keys.push(mc.name);}

  add_module(m) { 
    this.modules.push(m);
    if (this?.id_module) m.id = this.id_module;
    else m.id = parseInt(Object.keys(this.module_index).reduce((a, b) => parseInt(a) > parseInt(b) ? a : b)) + 1;
    this.module_index[m.id] = m;
    this.attach(m);
    this.place_module(m);
    this.update_width();
    // this.undo_checkpoint();
  }

  add_wire(w) { 
    // console.log('add')
    this.wires.push(w); 
    this.wbf_changed = true;
  }

  undo_checkpoint() {
    if (this?.disable_log) return;
    this.current_time = performance.now() / 1000;
    this.state = this.save_state();
    if (this?.current_time - this.actions_buffer[this.undo_size-1][0] > 1) {
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

    if (m?.node != null) {
      m.node.disconnect();
      m.node.parameters.get("isPresent").value = 0;
    }

    delete this.module_index[m.id];
    this.changed = true;
    this.undo_checkpoint();
  }

  delete_last_module() {
    if (this?.active_module != 0) 
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
    // console.log('ke')
    let i = this.wires.indexOf(w);
    if (i !== -1) this.wires.splice(i, 1);
    if (w != null)
      w.disconnect();
    this.undo_checkpoint();
  }

  // set_size(w, h) {
  //   super.set_size(w, h);
  //   this.rows = Math.floor(h / window.devicePixelRatio / 200);
  //   if (this?.rows < 1) this.rows = 1;
  //   if (this?.modules) this.replace_modules();
  //   this.reinit_view();
  // }

  set_module_style(ms) { this.module_style = ms; }

  set_port_style(ps) { this.port_style = ps; }

  set_wire_style(ws) { this.wire_style = ws; }

  set_offset(x, y) { 
    if (x > 0) x = 0;
    if (x < this.x && this.hp2x(this.rack_max_width) + this.spacing < (this.w - x) / this.scale) return;
    if (this?.x != x || this.y != y) {
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
    // console.log('kek');
    let b = this.find_focus(x, y);
    let res;
    if (this?.active_wire != null) {
      // console.log([this.active_wire.a, b])
      res = this.active_wire.connect(this.active_wire.a, b);
    }
    
    if (res) this.undo_checkpoint();
    else this.remove_wire(this.active_wire);
    this.active_wire = null;
    this.wbf_changed = true;
  }

  mouse_pressed(x, y, dx, dy) {
    this.find_focus((x - this.x) / this.scale, (y - this.y) / this.scale);
    if (this?.focus != null) {
      this.focus.mouse_pressed(this, (x - this.x) / this.scale, (y - this.y) / this.scale, dx / this.scale, dy / this.scale);
    }
  }

  mouse_dragged(x, y, dx, dy) {
    if (this?.focus != null) this.focus.mouse_dragged(this, (x - this.x) / this.scale, (y - this.y) / this.scale, dx / this.scale, dy / this.scale);
    else if (this?.drag_enabled) {
      this.x += dx;
      this.y += dy;
      //this.changed = true;
    }
  }

  mouse_released(x, y, dx, dy) {
    // this.find_focus((x - this.x) / this.scale, (y - this.y) / this.scale);
    if (this?.focus != null) this.focus.mouse_released(this, (x - this.x) / this.scale, (y - this.y) / this.scale, dx / this.scale, dy / this.scale);
    this.focus = null;
  }

  double_clicked(x, y, dx, dy) {
    this.find_focus((x - this.x) / this.scale, (y - this.y) / this.scale);
    if (this?.focus != null) {
      this.focus.double_clicked(this, (x - this.x) / this.scale, (y - this.y) / this.scale, dx / this.scale, dy / this.scale);
    }
  }

  x2hp(x) { return x2hp(x - this.spacing, true); }
  y2hp(y) { return y2hp(y - this.spacing , true); }
  hp2x(xhp){ return hp2x(xhp) + this.spacing; }
  hp2y(yhp){ return hp2y(yhp) + (yhp + 1) * 2 * this.spacing + this.spacing; }

  closest_place(m, x, y, modules=null) {
    if (!modules) modules = this.modules;
    let mxhp = this.x2hp(x);
    let myhp = this.y2hp(y);

    if (mxhp < 0) mxhp = 0;
    if (myhp < 0) myhp = 0;
    if (myhp > this.rows - 1) myhp = this.rows - 1;

    for (let i = 0; i < modules.length; i++) {
      if (modules[i].id == m.id) continue;
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
      if (xy != null) { m.set_position(xy[0] + 0, xy[1] - 0); return; }
    }
    for (let x = 0; ; x++) {
      for (let y = 0; y < this.rows; y ++) {
        let x_px = this.hp2x(x);
        let y_px = this.hp2y(y);
        let xy = this.closest_place(m, x_px, y_px, modules);
        if (xy != null) { m.set_position(xy[0] + 0, xy[1] - 0); return; }
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
    
    if (this?.save_endpoint) {
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
    let module_index = {'0' : {}};

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



export default Engine;

