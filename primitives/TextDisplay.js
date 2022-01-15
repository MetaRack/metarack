class TextDisplay {
    constructor(x, y, width, height, color=60) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.color = color;

      this.sbf;
      this.scale = -1;

      this.displaytext = '';
    }

    set_text(displaytext) {
      this.displaytext = displaytext;
    }

    fill_sbf() {
      let w = this.sbf.width;
      let h = this.sbf.height;
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

    draw_text(x, y, scale) {
      textSize(4 * scale);
      fill(this.color);
      textAlign(CENTER, CENTER);
      strokeWeight(0.2 * scale);
      text(this.displaytext, x + this.x + this.width / 2 * scale, y + this.y + this.height / 2 * scale);
    }

    draw(x, y, scale) {
      if (scale != this.scale) {
        this.scale = scale;
        this.create_fill_buffers();
      }
      image(this.sbf, x + this.x, y + this.y, this.sbf.width / upscale_buffers, this.sbf.height / upscale_buffers);
      this.draw_text(x, y, scale);
    }

    process(sample) {
      if (this.sample_counter % this.divider == 0) {
        this.i = this.sample_counter / this.divider;
        this.buffer[this.i] = sample / 10;
        if (this.i >= this.size) this.sample_counter = -1;
      }
      this.sample_counter ++;
    }
}