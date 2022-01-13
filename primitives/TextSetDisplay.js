class TextSetDisplay {
  constructor(x, y, width, height, textSet, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.textSet = textSet;
    this.color = color;

    this.text_i = 0;

    this.sbf;
    this.scale = -1;
  }

  fill_sbf(i) {
    let w = this.sbf[i].width / 2;
    let h = this.sbf[i].height / 2;
    let sw = 1.5 * this.scale;
    let rounding = 1 * this.scale;

    this.sbf[i].stroke(60); this.sbf[i].strokeWeight(sw); this.sbf[i].strokeJoin(ROUND); this.sbf[i].fill(255);
    this.sbf[i].rect(sw / 2, sw / 2, w - sw, h - sw, rounding, rounding, rounding, rounding);

    this.sbf[i].textSize(h / 3);
    this.sbf[i].fill(this.color);
    this.sbf[i].textAlign(CENTER, CENTER);
    this.sbf[i].strokeWeight(sw / 4);
    this.sbf[i].text(this.textSet[i], w / 2, h / 2);
  }

  create_fill_buffers() {
    this.sbf = [];
    for (var i = 0; i < this.textSet.length; i++) {
      let sbf_w = this.width * this.scale;
      let sbf_h = this.height * this.scale;
      this.sbf.push(createGraphics(sbf_w * upscale_buffers, sbf_h * upscale_buffers));
      this.sbf[i].background(0,0,0,0);   
      this.fill_sbf(i);
    }
  }

  draw(x, y, scale) {
    if (scale != this.scale) {
      this.scale = scale;
      this.create_fill_buffers();
    }
    image(this.sbf[this.text_i], x + this.x, y + this.y, this.sbf[this.text_i].width / upscale_buffers, this.sbf[this.text_i].height / upscale_buffers);
  }

  process(text_i) {
    this.text_i = text_i;
  }
}