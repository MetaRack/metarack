class PortStyle {
  constructor(hole=100, ring=50, text=50, istext=false){
    this.hole = hole;
    this.ring = ring;
    this.text = text;
    this.istext = istext;
  }
}

class ProtoPort {
  constructor(rx, ry, rr, name, style = new PortStyle()) {
    this.value = 0;
    this.name = name;
    this.rx = rx;
    this.ry = ry;
    this.rr = rr;
    this.style = style;

    // buffers
    this.sbf;
    this.nbf;

    this.cx = 0;
    this.cy = 0;

    this.visible = true;

    this.scale = -1;
  }

  fill_sbf() {
    let w = this.sbf.width / 2;
    let h = this.sbf.height / 2;
    let sw = 1 * this.scale;

    this.sbf.noStroke(); this.sbf.fill(this.style.hole);
    this.sbf.ellipse(w / 2, h / 2, this.rr * this.scale + sw, this.rr * this.scale + sw);

    this.sbf.stroke(this.style.ring); this.sbf.strokeWeight(sw); this.sbf.noFill();
    this.sbf.ellipse(w / 2, h / 2, this.rr * this.scale, this.rr * this.scale);
  }

  fill_nbf() {
    let w = this.nbf.width / 2;
    let h = this.nbf.height / 2;
    let sw = 1 * this.scale;
    this.nbf.stroke(this.style.ring); this.nbf.strokeWeight(sw); this.nbf.strokeJoin(ROUND); //this.nbf.fill(this.style.label);
    this.nbf.rect(sw / 2, sw / 2, w - sw, h - sw);

    this.nbf.textSize(h * 0.6);
    this.nbf.fill(this.style.text);
    this.nbf.textAlign(CENTER, CENTER);
    this.nbf.strokeWeight(sw * 0.2);
    this.nbf.text(this.name, w / 2, h / 2);
  }

  create_fill_buffers() {
    let sbf_w = this.rr * this.scale;
    let sbf_h = this.rr * this.scale;
    this.sbf = createGraphics(sbf_w * upscale_buffers, sbf_h * upscale_buffers);
    this.sbf.background(0,0,0,0);
    let nbf_w = this.rr * this.scale * 1.7;
    let nbf_h = this.rr * this.scale * 0.8;
    this.nbf = createGraphics(nbf_w * upscale_buffers, nbf_h * upscale_buffers);
    this.nbf.background(0,0,0,0);
    this.fill_sbf();
    this.fill_nbf();
  }

  set(value) {
    this.value = value;
  }

  get() {
    return this.value;
  }

  get_name() {
    return this.name;
  }

  draw(x, y, scale) {
    if (!this.visible) return;
    if (scale != this.scale) {
      this.scale = scale;
      this.create_fill_buffers();
    }
    this.cx = x + this.rx * this.scale;
    this.cy = y + this.ry * this.scale;
    image(this.sbf, this.cx - this.sbf.width / upscale_buffers / 2, 
                    this.cy - this.sbf.height / upscale_buffers,
                    this.sbf.width / upscale_buffers, this.sbf.height / upscale_buffers);
    image(this.nbf, this.cx - this.nbf.width / upscale_buffers / 2,
                    this.cy, this.nbf.width / upscale_buffers, this.nbf.height / upscale_buffers);
    this.cy = this.cy - this.sbf.height / upscale_buffers / 2;
  }

  get_position() {
    return [this.cx, this.cy];
  }
}

class InvisibleProtoPort extends ProtoPort {
  constructor(rx, ry, rr, name) {
    super(rx, ry, rr, name);
    this.visible = false;
  }
}