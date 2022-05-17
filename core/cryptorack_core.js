let engine;

function hp2px(hp) {return hp * 5.08;}

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
  constructor(hole=45, ring=120, text=60, hastext=true){
    this.hole = hole;
    this.ring = ring;
    this.text = text;
    this.hastext = hastext;
  }
}

class WireStyle {
  constructor (core=[100, 100, 180, 255], edge=40) {
    this.core = core;
    this.edge = edge;
  }
}

class ModuleStyle {
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

// GRAPHICOBJECT

class GraphicObject {
  constructor({x=0, y=0, w=0, h=0, name='name undefined', visible=true}={}) {
    this.set_position(x, y);
    this.set_size(w, h);
    this.gparent = null;
    this.gchildren = [];
    this.visible = visible;
    this.cbf = null;
    this.sbf = null;
    this.dbf = null;
    this.changed = true;
    this.focus = null;
    this.name = name;
    this.ax = 0;
    this.ay = 0;
  }

  contains(x, y) { if (x < this.x || y < this.y || x > this.x + this.w || y > this.y + this.h) return false; return true; }
  set_position(x, y) { this.x = x; this.y = y; }
  set_size(w, h) { this.w = w; this.h = h; }
  attach(go) { this.gchildren.push(go); go.gparent = this; }
  detach(go) { let i = this.gchildren.indexOf(go); if (i !== -1) this.gchildren.splice(i, 1); }

  proxy_draw(cbf, sbf, dbf, x, y) {
    if (!this.visible) return;

    this.ax = x; this.ay = y;

    if (!this.cbf && this.draw_cbf) { this.cbf = createGraphics(this.w * engine.MAX_SCALE, this.h * engine.MAX_SCALE); this.draw_cbf(this.cbf, this.cbf.width, this.cbf.height); }
    if (!this.sbf && this.draw_sbf) { this.sbf = createGraphics(this.w * engine.MAX_SCALE, this.h * engine.MAX_SCALE); }
    
    if (this.changed && this.draw_sbf) {
      sbf.erase(); sbf.noStroke(); sbf.rect(x + this.x, y + this.y, this.w, this.h); sbf.noErase();
      this.sbf.clear(); this.draw_sbf(this.sbf, this.sbf.width, this.sbf.height);
    }

    if ((this.changed || this.gparent.changed) && this.cbf) {
      cbf.image(this.cbf, x + this.x, y + this.y, this.w, this.h);
    }
    if ((this.changed || this.gparent.changed) && this.sbf) sbf.image(this.sbf, x + this.x, y + this.y, this.w, this.h);
    if (this.draw_dbf) { this.draw_dbf(dbf, x + this.x, y + this.y, this.w, this.h); }
    
    if (this.gparent.changed) this.changed = true;

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
    this.modname = '';
  }

  draw_cbf(buf, w, h) {
    let sw = 1.5;
    buf.background(0,0,0,0);

    buf.stroke(this.style.ring); buf.strokeWeight(sw); buf.fill(this.style.hole);
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
  constructor({x=0, y=0, r=10, name='', style=new PortStyle(), default_value=0, visible=true, isinput=false}={}) {
    super({x:x, y:y, w:2*r, h:r*3, name:name, visible:visible});
    let pr = r * Math.pow(7 / this.w, 0.8);
    let px = this.w / 2 - pr;
    let py = this.h / 1.5 / 2 - pr;
    this.port = new ProtoPort({x:px, y:py, r:pr, name:name, default_value: default_value});
    this.attach(this.port);
  }

  draw_cbf(buf, w, h) {
    let sw = 1;
    buf.stroke(60); buf.strokeWeight(sw); buf.fill(255);
    buf.rect(sw + w * 0.05, h / 1.5 + sw + h * 0.05, w - 2 * sw - w * 0.1, h / 3 - 2 * sw - h * 0.1);

    buf.textSize(w / 4);
    buf.fill(60);
    buf.textAlign(CENTER, CENTER);
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
    buf.noStroke(); buf.fill(255);
    buf.circle(w / 2, w / 2, this.r * 2 + sw * 8);
    buf.stroke(60); buf.strokeWeight(sw); buf.fill(255);
    buf.circle(w / 2, w / 2, this.r * 2 - 2 * sw);
  }

  draw_sbf(buf, w, h) {
    this.r = w / 2 * this.rc;
    let sw = 3;
    sw = 4;
    buf.stroke(60); buf.strokeWeight(sw); buf.noFill();
    this.ang_high = this.val2ang(this.base_val.toFixed(this.precision)) + HALF_PI;
    if (this.ang_high - HALF_PI > 0.05) 
      buf.arc(w / 2, w / 2, this.r * 2 - 2 * sw, this.r * 2 - 2 * sw, HALF_PI, this.ang_high - 0.05);
    else 
      buf.arc(w / 2, w / 2, this.r * 2 - 2 * sw, this.r * 2 - 2 * sw, this.ang_high - 0.05, HALF_PI);
    sw = 2;
    buf.strokeWeight(sw);
    buf.line(w / 2 + Math.cos(this.ang_high) * (this.r - 5), w / 2 + Math.sin(this.ang_high) * (this.r - 5), 
             w / 2 + Math.cos(this.ang_high) * (this.r + 1), w / 2 + Math.sin(this.ang_high) * (this.r + 1));

    sw = 1;
    buf.stroke(60); buf.strokeWeight(sw); buf.fill(255);
    buf.rect(sw + w * 0.1, h / 1.5 + sw + h * 0.05, w - 2 * sw - w * 0.2, h / 3 - 2 * sw - h * 0.1);

    sw = 0.1;
    buf.textSize(w / 4);
    buf.fill(60);
    buf.textAlign(CENTER, CENTER);
    buf.strokeWeight(sw);
    buf.text(this.base_val.toFixed(this.precision), w / 2, h / 3);
    buf.text(this.name.substring(0,4), w / 2, h * 5 / 6 + 1);
  }

  //get() { return this.base_val; }

  get() { 
    if (this.changed) {
      this.nochange_counter = 0;
      this.nochange_flag = false;
      this.c = this.sample_counter / (sample_rate / fps);
      this.sample_counter++;
      if (this.c <= 1)
        this.filter.in = (this.base_val * this.c + this.prev_base_val * (1 - this.c));
      else {
        this.filter.in = this.base_val;
      }
      this.filter.process();
      //console.log((this.base_val * this.c + this.prev_base_val * (1 - this.c)) + this.mod_coef * this.port.get());
      return this.filter.lp;
      
    }
    else {
      // this.sample_counter = 0;
      // this.prev_base_val = this.base_val;
      // this.filter.in = this.base_val;
      // this.filter.process();
      // return this.filter.lp;
      //return this.base_val; 

      this.sample_counter = 0;
      if (!this.nochange_flag) this.nochange_counter++;
      if (this.nochange_counter > sample_rate / 2) {
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
      //return this.base_val + this.mod_coef * this.port.get(); 
    }
    
  }

  set(v) { this.base_val = v; }

  mouse_pressed(x, y, dx, dy) { this.prev_base_val = this.base_val; this.sample_counter = 0; this.changed = true; }
  mouse_dragged(x, y, dx, dy) { 
    this.prev_base_val = this.base_val;
    this.sample_counter = 0;
    this.base_val -= dy / 500 * (this.vmax - this.vmin); 
    if (this.base_val > this.vmax) this.base_val = this.vmax;
    if (this.base_val < this.vmin) this.base_val = this.vmin + 0.0001;
    this.changed=true;
  }
  mouse_released(x, y, dx, dy) { this.prev_base_val = this.base_val; this.sample_counter = 0; this.changed = true; }
  double_clicked(x, y, dx, dy) { this.prev_base_val = this.base_val; this.sample_counter = 0; this.base_val = this.def_val; this.mod = this.def_mod; this.changed = true; }

  save() { return this.base_val.toFixed(6); }
  load(s) { this.base_val = parseFloat(s); this.changed = true; }
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

  mouse_dragged(x, y, dx, dy) { 
    this.dval -= dy / 500 * (this.vmax - this.vmin);
    if (Math.abs(this.dval) > this.step) {
      this.base_val += Math.sign(this.dval) * this.step;
      this.dval -= Math.sign(this.dval) * this.step;
    }
    if (this.base_val > this.vmax) this.base_val = this.vmax;
    if (this.base_val < this.vmin) this.base_val = this.vmin + 0.0001;
    this.changed=true;
  }

  mouse_pressed(x, y, dx, dy) { super.mouse_pressed(x, y, dx, dy); this.y0 = y; }

  draw_sbf(buf, w, h) {
    this.r = w / 2 * this.rc;
    let sw = 3;
    sw = 4;
    buf.stroke(60); buf.strokeWeight(sw); buf.noFill();
    this.ang_high = this.val2ang(this.base_val) + HALF_PI;
    if (this.ang_high - HALF_PI > 0.05) 
      buf.arc(w / 2, w / 2, this.r * 2 - 2 * sw, this.r * 2 - 2 * sw, HALF_PI, this.ang_high - 0.05);
    else 
      buf.arc(w / 2, w / 2, this.r * 2 - 2 * sw, this.r * 2 - 2 * sw, this.ang_high - 0.05, HALF_PI);
    sw = 2;
    buf.strokeWeight(sw);
    buf.line(w / 2 + Math.cos(this.ang_high) * (this.r - 5), w / 2 + Math.sin(this.ang_high) * (this.r - 5), 
             w / 2 + Math.cos(this.ang_high) * (this.r + 1), w / 2 + Math.sin(this.ang_high) * (this.r + 1));

    sw = 1;
    buf.stroke(60); buf.strokeWeight(sw); buf.fill(255);
    buf.rect(sw + w * 0.1, h / 1.5 + sw + h * 0.05, w - 2 * sw - w * 0.2, h / 3 - 2 * sw - h * 0.1);

    sw = 0.1;
    buf.textSize(w / 4);
    buf.fill(60);
    buf.textAlign(CENTER, CENTER);
    buf.strokeWeight(sw);
    if ((this.base_val <= 0) && (this.nonzero)) 
      buf.text((this.base_val - this.step).toFixed(this.precision), w / 2, h / 3);
    else
      buf.text(this.base_val.toFixed(this.precision), w / 2, h / 3);
    buf.text(this.name.substring(0,4), w / 2, h * 5 / 6 + 1);
  }

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
  }

  draw_sbf(buf, w, h) {
    super.draw_sbf(buf, w, h);

    if (this.port.isinput && this.port.wires.length > 0) {
      let sw = 1.5;
      let dv = this.mod * (this.vmax - this.vmin);
      this.ang_low = this.val2ang(this.base_val - dv) + HALF_PI;
      buf.stroke(60); buf.strokeWeight(sw); buf.noFill();
      this.ang_high = this.val2ang(this.base_val + dv) + HALF_PI;
      buf.line(w / 2 + Math.cos(this.ang_high) * (this.r - 1), w / 2 + Math.sin(this.ang_high) * (this.r - 1), 
           w / 2 + Math.cos(this.ang_high) * (this.r + 3), w / 2 + Math.sin(this.ang_high) * (this.r + 3));

      if (this.ang_low < this.ang_high) {
        if (Math.abs(this.ang_low - this.ang_high) > 0.001) 
          buf.arc(w / 2, w / 2, this.r * 2 + 2 * sw, this.r * 2 + 2 * sw, this.ang_low, this.ang_high); buf.fill(255);
        buf.circle(w / 2 + Math.cos(this.ang_low) * (this.r + 2), w / 2 + Math.sin(this.ang_low) * (this.r + 2), 6);
      } else {
        if (Math.abs(this.ang_low - this.ang_high) > 0.001) 
          buf.arc(w / 2, w / 2, this.r * 2 + 2 * sw, this.r * 2 + 2 * sw, this.ang_high, this.ang_low); buf.fill(255);
        buf.circle(w / 2 + Math.cos(this.ang_low) * (this.r + 2), w / 2 + Math.sin(this.ang_low) * (this.r + 2), 6);
      }
    }
  }

  draw_dbf(buf, x, y, w, h) { this.mod_coef = (this.port.wires.length > 0) * 0.1 * this.mod * (this.vmax - this.vmin); }
  
  get() { 
    if (this.changed) {
      this.nochange_counter = 0;
      this.nochange_flag = false;
      this.c = this.sample_counter / (sample_rate / fps);
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
      if (this.nochange_counter > sample_rate * 2) {
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
  set(v) { this.base_val = v; }
  connect(c) {
    let w = new Wire();
    w.connect(this.port, c.port);
    engine.add_wire(w);
  }

  mouse_dragged(x, y, dx, dy) {
    this.prev_base_val = this.base_val;
    this.sample_counter = 0;
    if (!this.port.isinput || (!engine.cmdpressed || this.port.wires.length == 0)) {
      this.base_val -= dy / 500 * (this.vmax - this.vmin); 
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
  load(s) { this.base_val = parseFloat(s['val']); this.mod = parseFloat(s['mod']); this.changed = true; }
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
    buf.strokeWeight(0.5);
    if (this.a) buf.circle(p1[0], p1[1], this.a.w * 0.7);
    else buf.circle(p1[0], p1[1], 3.5);

    if (!this.b || this.b.visible) {
      if (this.b) buf.circle(p2[0], p2[1], this.b.w * 0.7);
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
    if (!this.a.isinput) 
      return {
        'ma': this.a.modname,
        'pa': this.a.name,
        'mb': this.b.modname,
        'pb': this.b.name
      }
    return {
      'ma': this.b.modname,
      'pa': this.b.name,
      'mb': this.a.modname,
      'pb': this.a.name
    }
  }
}

// MODULE

class Module extends GraphicObject {
  constructor({name='', x=0, y=0, w=0, h=128.5, style = new ModuleStyle()}) {
    super({x:x, y:y, w:w, h:h, name:name})
    this.i = {};
    this.o = {};
    this.c = {};
    this.style = style;
    if (engine) engine.add_module(this);
  }

  draw_cbf(buf, w, h) {
    let sw = 1.5;
    let rounding = 5;
    buf.background(0,0,0,0);

    buf.stroke(this.style.shadow); buf.strokeWeight(sw); buf.strokeJoin(ROUND); buf.fill(this.style.panel);
    buf.rect(sw / 2, sw / 2, w - sw, h - sw, rounding, rounding, rounding, rounding);

    buf.stroke(this.style.lining); buf.strokeWeight(sw / 3);
    let line_step = 5;// + rackrand() * 3;
    let x1 = 0;
    while (x1 < w + h) {
      x1 += line_step;
      buf.line(x1, 0, 0, x1);
    }
    buf.stroke(255); buf.strokeWeight(10 * scale); buf.noFill();
    buf.arc(rounding, h - rounding, rounding*2.5, rounding*2.5, HALF_PI - 0.01, PI + 0.01);

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

    sw = 1;
    buf.stroke(30); buf.strokeWeight(sw); buf.fill(255);
    buf.rect(w / 6, 5, w - w / 3, 20);

    sw = 0.1;
    buf.textSize(15);
    buf.fill(60);
    buf.textAlign(CENTER, CENTER);
    buf.strokeWeight(sw);
    buf.text(this.name.substring(0, Math.floor((w - w / 3) / textWidth(this.name) * this.name.length * 0.7)), w / 2, 15);

    sw = 1.5;
    buf.stroke(this.style.frame); buf.strokeWeight(sw); buf.noFill();
    buf.rect(sw / 2, sw / 2, w - sw, h - sw, rounding, rounding, rounding, rounding);
  }

  add_input(i) {
    this.i[i.name] = i;
    this.attach(i);
    i.port.isinput = true;
    i.port.modname = this.name;
  }

  add_output(o) {
    this.o[o.name] = o;
    this.attach(o);
    o.port.isinput = false;
    o.port.modname = this.name;
  }

  add_control(c) {
    this.c[c.name] = c;
    this.attach(c);
  }

  refresh_io_names() {
    for (var name in this.i) this.i[name].port.modname = this.name;
    for (var name in this.o) this.o[name].port.modname = this.name;
  }

  connect(oport, iport, scale=1, offset=0) {
    engine.add_wire(oport, iport, scale, offset);
  }

  save() {
    let s = {
      'name': this.constructor.name,
      'i': {},
      'c': {}
    };
    for (var name in this.i) { if (this.i[name].save) { s['i'][name] = this.i[name].save(); } }
    for (var name in this.c) { if (this.c[name].save) { s['c'][name] = this.c[name].save(); } }
    return s;
  }

  load(s) {
    this.name = s['name'];
    for (var name in s['i']) if (this.i[name]) this.i[name].load(s['i'][name]);
    for (var name in s['c']) if (this.c[name]) this.c[name].load(s['c'][name]);
    this.changed = true;
  }
}

// AUDIO

class Audio extends Module {

  constructor() {
    super({w:hp2px(4)});

    this.add_input(new Port({x:hp2px(0.8), y:88, r:6, name:'LEFT'}));
    this.add_input(new Port({x:hp2px(0.8), y:108, r:6, name:'RIGHT'}));

    this.L = 0;
    this.R = 0;
  }

  draw_cbf(buf, w, h) {
    super.draw_cbf(buf, w, h);
    let sw = 1;
    buf.stroke(60); buf.strokeWeight(sw); buf.fill(255);
    buf.rect(sw + w * 0.2, sw + h * 0.63, w * 0.6 - 2 * sw, h * 0.038 - 2 * sw);

    sw = 0.1;
    buf.textSize(w * 0.18);
    buf.fill(60);
    buf.textAlign(CENTER, CENTER);
    buf.strokeWeight(sw);
    buf.text('LVLS', w / 2, sw*2 + h * 0.63 + h * 0.04 / 2);
  }

  draw_dbf(buf, x, y, w, h) {
    buf.stroke(60);
    buf.strokeWeight(0.4);
    for (var i = 0; i < 10; i ++) {
      if (Math.abs(this.L) > i) buf.fill(120);
      else buf.fill(250);
      buf.circle(x + w * 0.3, y + h * 0.6 - h * i * 0.057, w * (0.1 + 0.005 * i));
      if (Math.abs(this.R) > i) buf.fill(120);
      else buf.fill(250);
      buf.circle(x + w * 0.7, y + h * 0.6 - h * i * 0.057, w * (0.1 + 0.005 * i));
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
}

// ENGINE

class Engine extends GraphicObject {
  constructor({w=rackwidth, h=rackheight, visible=true}={}) {
    super({w:w, h:h, visible:visible});
    this.clean();
    this.controls = {};
    this.module_registry = {};
  
    this.module_style = new ModuleStyle();
    this.port_style = new PortStyle();
    this.wire_style = new WireStyle();
    this.background_color = 255;

    this.cmdpressed = false;

    this.spacing = 1;
    this.x_grid_size = hp2px(1);
    this.y_grid_size = 128.5;
    this.drag_enabled = false;
    this.scale_enabled = false;

    this.rows = 2;

    this.stop = false;
  }

  draw(x, y) {
    if (!this.visible) return;
    this.ax = x; 
    this.ay = y;
    if (!this.cbf) {
      this.cbf = createGraphics(this.w, this.h);
      this.cbf.background(100);
      this.cbf.fill(60);
      for (var i = 0; i <= this.rows; i ++) {
        this.cbf.rect(0, (i * 130.5 + 2) * this.scale, this.w, 3*this.scale);
        this.cbf.rect(0, ((i + 0.5) * 130.5 - 10) * this.scale, this.w, 20*this.scale);
        this.cbf.rect(0, (i * 130.5 - 5) * this.scale, this.w, 3*this.scale);
      }
    }
    if (!this.sbf) this.sbf = createGraphics(this.w, this.h);
    if (!this.dbf) this.dbf = createGraphics(this.w, this.h);
    if (!this.wbf) this.wbf = createGraphics(this.w, this.h);
    
    if (this.changed || this.wbf_changed) { 
      this.wbf.clear(); 
    }
    
    if (this.changed) {  
      this.sbf.clear(); 
    }
    
    this.dbf.clear();

    this.cbf.push(); this.sbf.push(); this.dbf.push(); this.wbf.push();
    this.cbf.scale(this.scale); this.sbf.scale(this.scale); this.dbf.scale(this.scale); this.wbf.scale(this.scale);

    // this.AUDIO.proxy_draw(this.cbf, this.sbf, this.dbf, this.x / this.scale, this.y / this.scale);

    for (var name in this.modules) {
      if (this.changed) this.modules[name].changed = true;
      this.modules[name].proxy_draw(this.cbf, this.sbf, this.dbf, this.x / this.scale, this.y / this.scale);
    }

    if (this.changed || this.wbf_changed) for (const w of engine.wires) w.draw(this.wbf, this.x / this.scale, this.y / this.scale);
    this.cbf.pop(); this.sbf.pop(); this.dbf.pop(); this.wbf.pop();
    image(this.cbf, x, y, this.w, this.h);
    image(this.sbf, x, y, this.w, this.h);
    image(this.dbf, x, y, this.w, this.h);
    image(this.wbf, x, y, this.w, this.h);
    let sw = 3; stroke(60); strokeWeight(sw); noFill(); rect(x + sw / 2, y + sw / 2, this.w - sw, this.h - sw);
    this.changed = false;
    this.wbf_changed = false;
  }

  add_module_class(mc) { this.module_registry[mc.name] = mc; }

  add_module(m) { 
    if (!this.modules_count[m.constructor.name]) this.modules_count[m.constructor.name] = 0;
    this.modules_count[m.constructor.name] ++;
    let mname = m.constructor.name + this.modules_count[m.constructor.name].toString();
    this.modules[mname] = m;
    m.name = mname;
    this.attach(m);
    m.changed = true;
  }

  add_wire(w) { this.wires.push(w); this.wbf_changed = true; }

  clean() {
    this.modules = {};
    this.modules_count = {};
    this.wires = [];

    this.MIN_SCALE = 2;
    this.MAX_SCALE = 5;
    this.scale = this.MAX_SCALE;

    this.control_focus = null;
    this.redraw = true;

    this.active_wire = null;

    this.cbf = null;
    this.sbf = null;
    this.dbf = null;
    this.wbf = null;
    this.wbf_changed = true;

    if (!this.AUDIO) this.AUDIO = new Audio();
    this.add_module(this.AUDIO);
  }

  remove_wire(w) {
    let i = this.wires.indexOf(w);
    if (i !== -1) this.wires.splice(i, 1);
    w.disconnect();
  }

  set_module_style(ms) { this.module_style = ms; }

  set_port_style(ps) { this.port_style = ps; }

  set_wire_style(ws) { this.wire_style = ws; }

  set_offset(x, y) { this.x = x; this.y = y; }

  set_scale(s) { this.scale = s; }

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
    if (!this.active_wire.connect(this.active_wire.a, b)) this.remove_wire(this.active_wire);
    this.active_wire = null;
    this.wbf_changed = true;
  }

  find_focus(x, y) {
    for (var name in this.modules) {
      this.focus = this.modules[name].find_focus(x, y);
      if (this.focus != null) return this.focus;
    }
    return null;
  }

  mouse_pressed(x, y, dx, dy) {
    this.find_focus((x - this.x) / this.scale, (y - this.y) / this.scale);
    if (this.focus != null) {
      this.focus.mouse_pressed((x - this.x) / this.scale, (y - this.y) / this.scale, dx, dy);
    }
  }

  mouse_dragged(x, y, dx, dy) {
    if (this.focus != null) this.focus.mouse_dragged((x - this.x) / this.scale, (y - this.y) / this.scale, dx, dy);
    else if (this.drag_enabled) {
      this.x += dx;
      this.y += dy;
      this.changed = true;
    }
  }

  mouse_released(x, y, dx, dy) {
    if (this.focus != null) this.focus.mouse_released((x - this.x) / this.scale, (y - this.y) / this.scale, dx, dy);
    this.focus = null;
  }

  double_clicked(x, y, dx, dy) {
    this.find_focus((x - this.x) / this.scale, (y - this.y) / this.scale);
    if (this.focus != null) {
      this.focus.double_clicked((x - this.x) / this.scale, (y - this.y) / this.scale, dx, dy);
    }
  }

  sequential_place_modules() {
    let x = this.spacing;
    let y = this.spacing;
    this.scale = this.h / (130.5 * this.rows);

    // console.log(this.w)
    this.AUDIO.set_position(this.w / this.scale  - this.spacing - this.AUDIO.w, this.spacing);
    let modlist = Object.entries(this.modules);
    // console.log(modlist);
    for(var i = 1; i < modlist.length; i ++) { 
      if ((x + modlist[i][1].w + this.spacing > this.w / this.scale) || ((y == this.spacing) &&
          (x + modlist[i][1].w + this.spacing > this.w / this.scale - this.spacing - this.AUDIO.w))) 
        { x = this.spacing; y += this.y_grid_size + this.spacing; }
      modlist[i][1].set_position(x, y);
      x += modlist[i][1].w + this.spacing;
    }
  }

  process() {
    if (this.stop) return;
    for (const w of this.wires) w.process();
    for (var name in this.modules) this.modules[name].process();
    // return this.OUT.get();
  }

  save_state() {
    let s = {
      'modules': [],
      'wires': []
    };
    for (var name in this.modules) {
      this.modules[name].refresh_io_names();
      s['modules'].push(this.modules[name].save());
    }
    for (const w of this.wires) s.wires.push(w.save());
    console.log(JSON.stringify(s));
    return JSON.stringify(s);
  }

  load_state(s) {
    this.clean();
    s = JSON.parse(s);
    while (this.wires.length > 0) this.remove_wire(this.wires[0]); 
    for (const m of s['modules']) { 
      try {
        if (m['name'] == 'Audio') continue;
        let mod = new this.module_registry[m['name']]();
        mod.refresh_io_names();
        mod.load(m); 
      } catch (error) {
        console.log(m);
        console.error(error);
      }
    } 
    for (const w of s['wires']) { 
      try {
        this.modules[w['ma']].o[w['pa']].connect(this.modules[w['mb']].i[w['pb']]); 
      } catch (error) {
        console.log(w);
        console.error(error);
      }
    } 
    this.sequential_place_modules();
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
engine.add_module_class(Audio);

function mousePressed(event) {
  if (mouseX > engine.ax && mouseX < engine.ax + engine.w && mouseY > engine.ay && mouseY < engine.ay + engine.h) {
    if (event.button == 0) engine.mouse_pressed(mouseX - engine.ax, mouseY - engine.ay, movedX, movedY);
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

function mouseWheel(event) {
  if (engine.scale_enabled) {
    let prev_scale = engine.scale;
    engine.scale += event.delta / 100;
    if (engine.scale < engine.MIN_SCALE) engine.scale = engine.MIN_SCALE;
    if (engine.scale > engine.MAX_SCALE) engine.scale = engine.MAX_SCALE;
    engine.set_offset(mouseX - (mouseX - engine.x) / prev_scale * engine.scale, mouseY - (mouseY - engine.y) / prev_scale * engine.scale);
    if (engine.scale != prev_scale) engine.changed = true;
  }
}

function keyPressed() {
  if (keyCode === 91) {
    engine.cmdpressed = true;
  }
  if (keyCode === 83) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([engine.save_state()], {
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
          engine.load_state( content );
       }
    }
    input.click();
  }
}

function keyReleased() {
  if (keyCode === 91) {
    engine.cmdpressed = false;
  }
}

function windowResized() {
  engine.stop = true;
  rackwidth = document.documentElement.clientWidth;
  rackheight = document.documentElement.clientHeight;
  resizeCanvas(rackwidth, rackheight);
  engine.set_size(rackwidth, rackheight);
  engine.sequential_place_modules();
  engine.redraw=true;
  engine.changed=true;
  engine.cbf = null;
  engine.sbf = null;
  engine.dbf = null;
  engine.wbf = null;
  engine.stop = false;
}

function engine_run() {
  audioContext = new AudioContext();
  let scriptNode = audioContext.createScriptProcessor(2048, 0, 2);

  scriptNode.onaudioprocess = function(audioProcessingEvent) {
    let outputBuffer = audioProcessingEvent.outputBuffer;

    let outputL = outputBuffer.getChannelData(0);
    let outputR = outputBuffer.getChannelData(1);
    for (let sample = 0; sample < outputL.length; sample++) {
      engine.process();
      outputL[sample] = engine.AUDIO.L;
      outputR[sample] = engine.AUDIO.R;
    }
  }

  scriptNode.connect(audioContext.destination);
}