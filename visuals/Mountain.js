class Mountain extends Visual {

  constructor(x, y, num_points, width, height) {
    super(x, y, width, height);
    this.num_points = num_points;

    // buffers
    this.sbf;

    this.cx = 0;
    this.cy = 0;

    this.scale = -1;
  }

  fill_sbf() {
    let w = this.sbf.width / 2;
    let h = this.sbf.height / 2;
    let sw = 1 * this.scale;

    let n = this.num_points;

    let xs = [], ys = [];

    let ox = rackrand() * 0.2;
    let oy = rackrand() * 0.2;
    let k = h / (w / 2);
    xs = [], ys = [];
    for (var i = 0; i < n; i++) {
      xs.push(h / (k - ox * i / n) / n * i + (rackrand() * 2 - 1 + ox * (i / n)) * h / k / n * ox * (i / n));
    }
    for (var i = 0; i < n; i++) {
      ys.push(xs[i] * (k - oy * i / n) + rackrand() * h / k * oy * (i / n));
    }

    let peak_x = xs[n - 1] + 10 * w / h;
    let peak_y = ys[n - 1];

    for (var i = 0; i < n; i++) {
      xs.push(peak_x + h / (k + ox * i / n) / n * i + (rackrand() * 2 - 1 + ox * (i / n)) * h / k / n * ox * (i / n));
    }
    for (var i = 0; i < n; i++) {
      ys.push(peak_y - xs[i] * (k + oy * i / n) + rackrand() * h / k * oy * (i / n));
    }

    let end_x = xs[2 * n - 1];
    let end_y = ys[2 * n - 1];
    let base_y = Math.max(ys[1], ys[2 * n - 2]);

    for (var i = 0; i < n * 2; i++) ys[i] -= base_y;

    let xs_w = xs[2*n - 2];
    for (var i = 0; i < n * 2; i++) xs[i] = (xs[i] / xs_w) * (w - 10*sw) + 0.5 * sw;
    let ys_h = Math.max.apply(Math, ys);
    for (var i = 0; i < n * 2; i++) ys[i] = (ys[i] / ys_h) * (h - 10*sw) + 0.5 * sw;

    this.sbf.strokeWeight(2); this.sbf.strokeJoin(ROUND); this.sbf.fill(255);
    this.sbf.beginShape();
    for (var i = 0; i < n * 2; i++) {
      this.sbf.curveVertex(xs[i], h - ys[i]);
    }
    this.sbf.endShape();

    this.sbf.strokeWeight(0.5); this.sbf.strokeJoin(ROUND); this.sbf.noFill();
    this.sbf.beginShape();
    for (var i = 0; i < n; i++) {
      this.sbf.curveVertex(((xs[n - i] + xs[n + i]) / 2 + xs[n + i]) / 2 - 10, h - (ys[n - i] + ys[n + i]) / 2);
    }
    this.sbf.endShape();

    this.sbf.strokeWeight(0.4); this.sbf.strokeJoin(ROUND); this.sbf.noFill();
    this.sbf.beginShape();
    for (var i = 0; i < n; i++) {
      this.sbf.curveVertex(xs[n + i], h - ys[n + i]);
      this.sbf.curveVertex(((xs[n - i] + xs[n + i]) / 2 + xs[n + i]) / 2 - 10, h - (ys[n - i] + ys[n + i]) / 2);
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