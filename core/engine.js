window.AudioContext = window.AudioContext || window.webkitAudioContext;

let audioContext;

class Engine {
  constructor(width, height) {
    this.modules = {};
    this.wires = [];
    this.scale = 5;
    this.x = 0;
    this.y = 0;
    this.OUT = new InvisibleProtoPort(0, 0, 0, 'IN');
    this.width = width;
    this.height = height;
    this.module_style = new ModuleStyle();
    this.port_style = new PortStyle();
    this.wire_style = new WireStyle();
    this.background_color = 255;
    this.background_drawer;

    this.visuals = [];
    this.visuals_process_divider = 16;
    this.visuals_drawer;

    this.patch_visible = true;
    this.vh = 0.5;

    this.mx = 0;
    this.my = 0;

    this.controls = {};
    this.control_focus;

    this.sbf;
    this.label_width = 0.35 / Math.pow(this.width / this.height, 0.9);

    this.patch_name = '';
    this.patch_description = '';
    this.patch_parameters = '';
    this.controls_description = '';
    this.copyright = '';

    this.h1 = 30;
    this.h2 = 27;
    this.h3 = 23;
  }

  add_control(name, def_x, def_y, min_x, max_x, min_y, max_y, group, radius=10) {
    if (!this.controls[group]) this.controls[group] = [];
    this.controls[group].push( new Control(name, def_x, def_y, min_x, max_x, min_y, max_y, this.width, this.height, radius) );
    return this.controls[group][this.controls[group].length - 1];
  }

  add_module(m) { this.modules[m.name] = m; }

  add_wire(oport, iport, scale=1, offset=0) {
    this.wires.push(new Wire(oport, iport, scale, offset, this.wire_style, iport.visible))
  }

  add_visual(v) { this.visuals.push(v); }

  set_module_style(ms) { this.module_style = ms; }

  set_port_style(ps) { this.port_style = ps; }

  set_wire_style(ws) { this.wire_style = ws; }

  set_offset(x, y) { this.x = x; this.y = y; }

  set_scale(s) { this.scale = s; }

  set_visuals_drawer(visuals_drawer) { this.visuals_drawer = visuals_drawer; }

  set_visuals_height(vh) {
    this.vh = vh;
    this.y = - this.height * (1 - vh);
  }

  toggle_random_movement() {
    if (engine.control_focus) engine.control_focus.toggle_random_movement();
  }

  toggle_view() {
    if (this.patch_visible) {
      this.set_offset(0, 0);
      this.patch_visible = false;
    } else {
      this.set_offset(0, - (1 - this.vh) * this.height);
      this.patch_visible = true;
    }
  }

  module_intersection(m1, m2, scale, padding=10) {
    if ((((m1.x + padding > m2.x) && (m1.x - padding < m2.x + m2.width * scale)) ||
      ((m1.x + padding + m1.width * scale > m2.x) && (m1.x - padding + m1.width * scale < m2.x + m2.width * scale))) &&
      (((m1.y + padding > m2.y) && (m1.y - padding < m2.y + m2.height * scale)) ||
      ((m1.y + padding + m1.height * scale > m2.y) && (m1.y - padding + m1.height * scale < m2.y + m2.height * scale))))
      return true;
    return false;
  }

  canvas_intersection(m, x, y, width, height, scale, padding=10) {
    padding *= scale;
    if (m.y < this.height * this.vh) return false;
    return false;
  }

  no_module_intersections(scale, padding=10) {
    for(var name1 in this.modules) for(var name2 in this.modules) {
      if ((name1 != name2) && (this.module_intersection(this.modules[name1], this.modules[name2], scale), padding)) return false;
      if (this.canvas_intersection(this.modules[name1], this.x, this.y, this.width, this.height, scale, padding)) return false;
    }
    return true;
  }

  sequential_place_modules() {
    let padding = 15 * this.scale;
    for (var i = 0; ; i++) {
      let x_grid_size = 5 * this.scale;
      let y_grid_size = 80 * this.scale;
      let x = x_grid_size;
      let y = this.height - y_grid_size + 5 * this.scale - this.y;
      let intersections = false;
      for(var name in this.modules) { 
        if (x + this.modules[name].width * this.scale + x_grid_size > (1 - this.label_width) * this.width) { 
          x = x_grid_size;
          y -= y_grid_size;
        }
        if (y - padding < this.height) {
          intersections = true;
          break;
        }
        this.modules[name].set_position( x, y ); 
        x += this.modules[name].width * this.scale + x_grid_size;
      }
      if (!intersections) break;
      this.scale -= 0.1;
      padding = 15 * this.scale;
    }
    let max_y = this.height;
    for(var name in this.modules) {
      if (this.modules[name].y + this.y < max_y) max_y = this.modules[name].y + this.y;
    }
    let old_y = this.y;
    this.set_visuals_height((max_y - padding) / this.height);
    for(var name in this.modules) {
      this.modules[name].y -= this.y - old_y;
    }
  }

  process() {
    for (var group in engine.controls)
      for (var i = 0; i < engine.controls[group].length; i ++)
        engine.controls[group][i].process();
    for (const w of this.wires) w.process();
    for(var name in this.modules) this.modules[name].process();
    return this.OUT.get();
  }

  reset_controls() {
    for (var group in this.controls)
      for (var i = 0; i < this.controls[group].length; i ++)
        this.controls[group][i].reset();
  }

  process_visuals() { for (const v of this.visuals) v.process(); }

  compute_preview(seconds) {
    for (var i = 0; i < sample_rate * seconds; i++) {
      this.process();
      if (i % this.visuals_process_divider == 0) this.process_visuals();
    }
  }

  draw_label() {
    if (!this.sbf) {
      let sbf_w = this.width * this.label_width;
      let sbf_h = this.height * (1 - this.vh);
      this.sbf = createGraphics(sbf_w * upscale_buffers, sbf_h * upscale_buffers);
      this.sbf.background(0,0,0,0);  

      let textscale = (1 - this.vh) * this.height / 250;
      let x_offset = 30 * textscale;

      let y_offset = 40 * textscale;

      this.sbf.strokeWeight(0.5); this.sbf.stroke(70);
      this.sbf.line(x_offset / 2, y_offset, x_offset / 2, this.sbf.height);

      this.sbf.textSize(this.h1 * textscale);
      this.sbf.fill(70);
      this.sbf.textAlign(LEFT, TOP);
      this.sbf.strokeWeight(0.3 * textscale);
      this.sbf.text(this.patch_name, x_offset, y_offset); 

      for (var i = 0; i < this.patch_name.length; i ++) {
        if (this.patch_name[i] == '\n') y_offset += this.h1 * textscale;
      }
      y_offset += this.h1 * textscale;
      y_offset += this.h3 / 2 * textscale;
      this.sbf.textSize(this.h3 * textscale);
      this.sbf.fill(70);
      this.sbf.textAlign(LEFT, TOP);
      this.sbf.strokeWeight(0.3 * textscale);
      this.sbf.text(this.patch_description, x_offset, y_offset);

      for (var i = 0; i < this.patch_description.length; i ++) {
        if (this.patch_description[i] == '\n') y_offset += this.h3 * textscale;
      }
      y_offset += this.h1 * textscale;
      y_offset += this.h3 / 2 * textscale;
      
      this.sbf.textSize(this.h2 * textscale);
      this.sbf.fill(70);
      this.sbf.textAlign(LEFT, TOP);
      this.sbf.strokeWeight(0.3 * textscale);
      this.sbf.text('Patch parameters:', x_offset, y_offset);

      y_offset += this.h1 * textscale;
      y_offset += 10 * textscale;

      this.sbf.textSize(this.h3 * textscale);
      this.sbf.fill(70);
      this.sbf.textAlign(LEFT, TOP);
      this.sbf.strokeWeight(0.3 * textscale);
      this.sbf.text(this.patch_parameters, x_offset + 0.05 * sbf_w, y_offset);

      for (var i = 0; i < this.patch_parameters.length; i ++) {
        if (this.patch_parameters[i] == '\n') y_offset += this.h3 * textscale;
      }
      y_offset += this.h3 * textscale;
      y_offset += this.h1 * textscale;

      this.sbf.textSize(this.h2 * textscale);
      this.sbf.fill(70);
      this.sbf.textAlign(LEFT, TOP);
      this.sbf.strokeWeight(0.3 * textscale);
      this.sbf.text('Interface:', x_offset, y_offset);

      y_offset += this.h1 * textscale;
      y_offset += 10 * textscale;

      this.sbf.textSize(this.h3 * textscale);
      this.sbf.fill(70);
      this.sbf.textAlign(LEFT, TOP);
      this.sbf.strokeWeight(0.3 * textscale);
      this.sbf.text(this.controls_description, x_offset + 0.05 * sbf_w, y_offset); 

      for (var i = 0; i < this.controls_description.length; i ++) {
        if (this.controls_description[i] == '\n') y_offset += this.h3 * textscale;
      }
      y_offset += this.h3 * textscale;
      y_offset += this.h1 * textscale;
      y_offset += this.h3 * textscale;

      this.sbf.textSize(this.h3 * textscale);
      this.sbf.fill(70);
      this.sbf.textAlign(RIGHT, TOP);
      this.sbf.strokeWeight(0.3 * textscale);
      this.sbf.text(this.copyright, this.sbf.width * 0.9, y_offset);
    }
    image(this.sbf, this.x + this.width * (1 - this.label_width), this.y + this.height, this.sbf.width / upscale_buffers, this.sbf.height / upscale_buffers);
  }
}

engine = new Engine(rackwidth, rackheight);

function setup() {
  createCanvas(rackwidth, rackheight);
  frameRate(fps);
}

function mousePressed() {
  for (var group in engine.controls) {
    for (var i = 0; i < engine.controls[group].length; i ++) {
      if (engine.controls[group][i].check_mouse(mouseX, mouseY)) {
        engine.control_focus = engine.controls[group][i];
        break;
      }
    }
  } 
}

function mouseReleased() {
  engine.control_focus = null;
}

function draw() {

  noStroke(); fill(background_color);
  rect(1, 1, rackwidth - 2, rackheight - 2);

  if (engine) {

    noStroke(); fill(visuals_background_color);
    rect(0, 0, engine.width, engine.height + engine.y - 1);

    if (engine.control_focus) {
      engine.control_focus.set_position(mouseX - engine.x, mouseY - engine.y);
    }

    strokeWeight(1); stroke(100);
    for (var group in engine.controls) {
      for (var i = 0; i < engine.controls[group].length - 1; i ++) {
        line(engine.controls[group][i].ax, engine.controls[group][i].ay, engine.controls[group][i + 1].ax, engine.controls[group][i + 1].ay);
      }
      line(engine.controls[group][0].ax, engine.controls[group][0].ay, engine.controls[group][engine.controls[group].length - 1].ax, engine.controls[group][engine.controls[group].length - 1].ay);
    }

    
    for (var group in engine.controls) {
      for (var i = 0; i < engine.controls[group].length; i ++) {
        engine.controls[group][i].draw(engine.x, engine.y);
      }
    }
    engine.mx = mouseX / rackwidth;
    engine.my = Math.min(mouseY, engine.height + engine.y - 6) / (engine.height + engine.y);

    if (engine.patch_visible) {
      noStroke(); fill(background_color);
      rect(1, rackheight * engine.vh, rackwidth - 2, rackheight - 2 - rackheight * engine.vh);
    }
    
    engine.draw_label();

    if (engine.visuals_drawer) engine.visuals_drawer(engine.x, engine.y, engine.scale);
    
    if (engine.patch_visible) {
      for(var name in engine.modules) engine.modules[name].draw(engine.x, engine.y, engine.scale);
      for (const w of engine.wires) w.draw(engine.x, engine.y, engine.height, engine.scale);
    }
  }

  stroke(0); strokeWeight(2); noFill();
  rect(1, 1, rackwidth - 2, rackheight - 2);
}

function engine_run() {
  audioContext = new AudioContext();
  let scriptNode = audioContext.createScriptProcessor(2048, 0, 1);

  scriptNode.onaudioprocess = function(audioProcessingEvent) {
    let outputBuffer = audioProcessingEvent.outputBuffer;

    for (let channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
      let outputData = outputBuffer.getChannelData(channel);
      for (let sample = 0; sample < outputData.length; sample++) {
        outputData[sample] = engine.process() / 10.0;
        if (sample % engine.visuals_process_divider == 0) engine.process_visuals();
      }
    }
  }

  scriptNode.connect(audioContext.destination);
}