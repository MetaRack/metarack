class RawScope {
    constructor(x, y, width, height, name, size=32, divider=256, offset=5) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.name = name;
      this.size = size;
      this.divider = divider;
      this.i = 0;
      this.offset = offset;

      this.sample_counter = 0;
      this.buffer = [];
      this.i = 0;
      for (var j = 0; j < this.size; j ++) this.buffer.push(0);

      this.sbf;
      this.scale = -1;

      this.delta = 0;
      this.y1 = 0;
      this.y2 = 0;
    }

    fill_sbf() {
      let w = this.sbf.width / 2;
      let h = this.sbf.height / 2;
      let sw = 1.5 * this.scale;
      let rounding = 1 * this.scale;
      this.sbf.stroke(60); this.sbf.strokeWeight(sw); this.sbf.strokeJoin(ROUND); this.sbf.fill(255);
      this.sbf.rect(sw / 2, sw / 2, w - sw, h - sw, rounding, rounding, rounding, rounding);

      // this.sbf.stroke(60); this.sbf.strokeWeight(sw / 4);
      // for (var i = 1; i < 4; i++) {
      //   this.sbf.line(sw / 2, h * 0.25 * i, sw * 2, h * 0.25 * i);
      //   this.sbf.line(w - sw * 2, h * 0.25 * i, w - sw / 2, h * 0.25 * i);
      // }
      // for (var i = 1; i < 5; i++) {
      //   this.sbf.line(sw / 2 + w * 0.2 * i, sw / 2, sw / 2 + w * 0.2 * i, sw * 2);
      //   this.sbf.line(sw / 2 + w * 0.2 * i, h - sw * 2, sw / 2 + w * 0.2 * i, h - sw / 2);
      // }
    }

    create_fill_buffers() {
      let sbf_w = this.width * this.scale;
      let sbf_h = this.height * this.scale;
      this.sbf = createGraphics(sbf_w * upscale_buffers, sbf_h * upscale_buffers);
      this.sbf.background(0,0,0,0);   
      this.fill_sbf();
    }

    draw_signal(x, y, scale) {
      stroke(60); strokeWeight(0.5 * scale); noFill();

      this.delta = (this.width - this.offset * 2) / this.size;
      for (var j = 0; j < this.size - 1; j++) { 
        this.y1 = -this.buffer[(this.i + j + 1) % this.size] * this.height / 3 * scale + y + this.y + this.height / 2 * scale;
        this.y2 = -this.buffer[(this.i + j + 2) % this.size] * this.height / 3 * scale + y + this.y + this.height / 2 * scale;
        line(x + this.x + (this.offset + j * this.delta) * scale, this.y1, x + this.x + (this.offset + (j + 1) * this.delta) * scale, this.y2);
      }
    }

    draw(x, y, scale) {
      if (scale != this.scale) {
        this.scale = scale;
        this.create_fill_buffers();
      }
      image(this.sbf, x + this.x, y + this.y, this.sbf.width / upscale_buffers, this.sbf.height / upscale_buffers);
      this.draw_signal(x, y, scale);
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