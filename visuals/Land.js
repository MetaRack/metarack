class Land extends Visual {

  constructor(x, y, num_points, width, height) {
    super(x, y, width, height);
    this.num_points = num_points;

    // buffers
    this.sbf;

    this.scale = -1;
  }

  fill_sbf() {
    let w = this.sbf.width / 2;
    let h = this.sbf.height / 2;
    let sw = 4 * this.scale;

    let n = this.num_points;

    let xs = [], ys = [];

    xs.push(0); ys.push(h);
    xs.push(0); ys.push(h);

    for (var i = -1; i < n + 1; i ++) {
      xs.push( (w / n) * i );
      ys.push( h - 5 - 20 * rackrand() );
    }

    xs.push(w); ys.push(h);
    xs.push(w); ys.push(h);

    this.sbf.strokeWeight(2); this.sbf.strokeJoin(ROUND); this.sbf.fill(255);
    this.sbf.beginShape();
    for (var i = 0; i < n + 6; i++) {
      this.sbf.curveVertex(xs[i], ys[i]);
    }
    this.sbf.endShape();
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
    this.cx = x + this.width / 2 * this.scale;
    this.cy = y + this.height / 2 * this.scale;
    image(this.sbf, x + this.x, y + this.y, this.sbf.width / upscale_buffers, this.sbf.height / upscale_buffers);
  }

  draw_to_buffer(x, y, scale, imbuffer) {
    if (scale != this.scale) {
      this.scale = scale;
      this.create_fill_buffers();
    }
    this.cx = x + this.width / 2 * this.scale;
    this.cy = y + this.height / 2 * this.scale;
    imbuffer.image(this.sbf, x + this.x, y + this.y, this.sbf.width / upscale_buffers, this.sbf.height / upscale_buffers);
  }

}