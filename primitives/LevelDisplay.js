class LevelDisplay {
    constructor(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.sample = -1;

      this.sbf;
      this.scale = -1;
    }

    fill_sbf() {
      let w = this.sbf.width / 2;
      let h = this.sbf.height / 2;
      let sw = 1.5 * this.scale;
      let rounding = 1 * this.scale;
      this.sbf.stroke(60); this.sbf.strokeWeight(sw); this.sbf.strokeJoin(ROUND); this.sbf.fill(255);
      this.sbf.rect(sw / 2, sw / 2, w - sw, h - sw, rounding, rounding, rounding, rounding);
    }

    create_fill_buffers() {
      let sbf_w = this.width * this.scale;
      let sbf_h = this.height * this.scale;
      this.sbf = createGraphics(sbf_w * upscale_buffers, sbf_h * upscale_buffers);
      this.sbf.background(0,0,0,0);   
      this.fill_sbf();
    }

    draw_signal(x, y) {
      fill(200); noStroke();
      let pad = 3 * this.scale;
      rect(x + this.x + pad / 2, y + this.y + this.height * 0.9 * this.scale * (1 - (this.sample + 1) / 2) + this.height * this.scale * 0.05, 
           this.width * this.scale - pad, this.height * 0.9 * this.scale * (this.sample + 1) / 2);
    }

    draw(x, y, scale) {
      if (scale != this.scale) {
        this.scale = scale;
        this.create_fill_buffers();
      }
      image(this.sbf, x + this.x, y + this.y, this.sbf.width / upscale_buffers, this.sbf.height / upscale_buffers);
      this.draw_signal(x, y);
    }

    process(sample) {
      this.sample = sample;
    }
}