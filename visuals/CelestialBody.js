class CelestialBody extends Visual {

  constructor(x, y, r, ocx, ocy) {
    super(x, y, r, r);

    this.r = r;
    this.ocx = ocx;
    this.ocy = ocy;

    this.or = Math.sqrt(Math.pow(x - ocx, 2) + Math.pow(y - ocy, 2));
    this.init_phase = Math.atan2(y - ocy, x - ocx);
    this.phase = this.init_phase;

    // buffers
    this.sbf;

    this.scale = -1;

    this.cx = 0;
    this.cy = 0;

    this.add_input(new InvisiblePort(0, 0, 1, 'PHASE'));
  }

  fill_sbf() {
    let w = this.sbf.width / 2;
    let h = this.sbf.height / 2;
    let sw = 2 * this.scale;
    this.sbf.strokeWeight(sw); this.sbf.stroke(70);
    this.sbf.ellipse(w / 2, h / 2, w / 2 - sw, h / 2 - sw);

    // this.sbf.noStroke(); this.sbf.fill(15);
    // this.sbf.ellipse(w / 2 + rackrand() * w / 4, h / 2.3, w / 2 - sw, h / 2 - sw);

    // this.sbf.strokeWeight(sw); this.sbf.stroke(70);
    // this.sbf.ellipse(w / 2 + 10, h / 2 + 10, w / 6 - sw, h / 6 - sw);
  }

  create_fill_buffers() {
    let sbf_w = this.width * this.scale;
    let sbf_h = this.height * this.scale;
    this.sbf = createGraphics(sbf_w * upscale_buffers, sbf_h * upscale_buffers);
    this.sbf.background(0,0,0,0);
    
    this.fill_sbf();
  }

  draw(x=0, y=0, scale=1) {
    if (scale != this.scale) {
      this.scale = scale;
      this.create_fill_buffers();
    }
    this.cx = this.ocx + this.or * Math.cos(this.phase);
    this.cy = this.ocy + this.or * Math.sin(this.phase);

    image(this.sbf, x + this.cx, y + this.cy, this.sbf.width / upscale_buffers * scale, this.sbf.height / upscale_buffers * scale);
  }

  process() {
    this.phase = this.init_phase + this.i['PHASE'].get();
    if (this.phase > Math.PI * 2) this.phase -= Math.PI * 2;
    if (this.phase < 0) this.phase += Math.PI * 2;
  }
  
}