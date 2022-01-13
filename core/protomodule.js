class ModuleStyle {
  constructor(panel=140, frame=60, shadow=30, name=40, lining=100, label=210, background=230) {
    this.panel = panel;
    this.frame = frame;
    this.shadow = shadow;
    this.name = name;
    this.label = label;
    this.lining = lining;
    this.background = background;
  }
}

class ProtoModule {
  constructor(name, x, y, width, height, style = new ModuleStyle()) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.i = {};
    this.o = {};
    this.style = style;

    // buffers
    this.sbf;
    this.nbf;

    this.scale = -1;
  }

  fill_sbf() {
    let w = this.sbf.width / 2;
    let h = this.sbf.height / 2;
    let sw = 1.5 * this.scale;
    let rounding = 5 * this.scale;
    this.sbf.stroke(this.style.shadow); this.sbf.strokeWeight(sw); this.sbf.strokeJoin(ROUND); this.sbf.noFill();
    this.sbf.rect(sw / 2, sw / 2, w - sw, h - sw, 0, rounding, rounding, rounding);
    this.sbf.stroke(this.style.frame); this.sbf.strokeWeight(sw / 1.5); this.sbf.fill(this.style.panel);
    this.sbf.rect(sw / 2, sw / 2, w - sw, h - sw, 0, rounding, rounding, rounding);

    this.sbf.stroke(this.style.lining); this.sbf.strokeWeight(sw / 2);
    let line_step = (6 + rackrand() * 8) * this.scale;
    let x1 = 0;
    while (x1 < w + h) {
      x1 += line_step;
      this.sbf.line(x1, 0, 0, x1);
    }
    this.sbf.stroke(255); this.sbf.strokeWeight(10 * scale); this.sbf.noFill();
    this.sbf.arc(rounding, h - rounding, rounding*2.5, rounding*2.5, HALF_PI - 0.01, PI + 0.01);
  }

  fill_nbf() {
    let w = this.nbf.width / 2;
    let h = this.nbf.height / 2;
    let sw = 1 * this.scale;
    this.nbf.stroke(this.style.frame); this.nbf.strokeWeight(sw); this.nbf.strokeJoin(ROUND); this.nbf.fill(this.style.label);
    this.nbf.rect(sw / 2, sw / 2, w - sw, h - sw);

    this.nbf.textSize(h * 0.5);
    this.nbf.fill(this.style.name);
    this.nbf.textAlign(CENTER, CENTER);
    this.nbf.strokeWeight(sw * 0.1);
    this.nbf.text(this.name, w / 2, h / 2);
  }

  create_fill_buffers() {
    let sbf_w = this.width * this.scale;
    let sbf_h = this.height * this.scale;
    this.sbf = createGraphics(sbf_w * upscale_buffers, sbf_h * upscale_buffers);
    this.sbf.background(0,0,0,0);
    let nbf_w = Math.min(5 * this.name.length * this.scale, this.width * this.scale * 0.7);
    let nbf_h = 8 * this.scale;
    this.nbf = createGraphics(nbf_w * upscale_buffers, nbf_h * upscale_buffers);
    this.nbf.background(0,0,0,0);
    this.fill_sbf();
    this.fill_nbf();
  }

  add_input(port) {
    this.i[port.get_name()] = port;
  }

  add_output(port) {
    this.o[port.get_name()] = port;
  }

  set_position(x, y) {
    this.x = x;
    this.y = y;
  }

  draw(x, y, scale) {
    if (scale != this.scale) {
      this.scale = scale;
      this.create_fill_buffers();
    }
    image(this.sbf, x + this.x, y + this.y, this.sbf.width / upscale_buffers, this.sbf.height / upscale_buffers);
    image(this.nbf, x + this.x, y + this.y - this.nbf.height / upscale_buffers * 0.88, this.nbf.width / upscale_buffers, this.nbf.height / upscale_buffers);
    
    for(var name in this.i) this.i[name].draw(x + this.x, y + this.y, scale);
    for(var name in this.o) this.o[name].draw(x + this.x, y + this.y, scale);
  }
}