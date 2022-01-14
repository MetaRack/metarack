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

    if (daytime == 'day') {
      this.sbf.strokeWeight(sw); this.sbf.stroke(70);
      this.sbf.ellipse(w / 2, h / 2, w / 2 - sw, h / 2 - sw);
    }
    else {
      this.sbf.beginShape();
      this.sbf.fill(255);
      this.sbf.stroke(70);
      let num_points = rackrand() * 20 + 15;
      if (num_points > 30) num_points = 40;
      let points = [];
      let x, y;
      this.da = Math.PI / 20;
      this.a = -Math.PI * 0.25 - Math.PI * 0.2 * rackrand() - this.da * (num_points - 20) / 2;
      for (var i = 0; i < num_points; i++) {
        x = w / 2 + Math.cos(this.a) * (w / 4 - sw);
        y = h / 2 + Math.sin(this.a) * (h / 4 - sw);
        this.sbf.vertex(x, y);
        points.push([x,y]);
        this.a += this.da;
      }

      if (num_points < 30) {
        for (var i = 1; i < points.length - 1; i ++) {
          x = points[points.length-1][0] + ((points[0][0] - points[points.length-1][0]) / (points.length - 1) * i + points[points.length - 1 - i][0] - points[points.length-1][0]) / 2;
          y = points[points.length-1][1] + ((points[0][1] - points[points.length-1][1]) / (points.length - 1) * i + points[points.length - 1 - i][1] - points[points.length-1][1]) / 2;
          this.sbf.vertex(x, y);
        }
      }

      this.sbf.endShape(CLOSE);
    }
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