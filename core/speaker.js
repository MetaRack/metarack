class Speaker extends ProtoModule {
  constructor(name, x=-1, y=-1) {
    super(name, x, y, 20, 20);
    
    this.add_input(new ProtoPort(5, 10, 7, 'IN'));

    // buffers
    this.sbf;
    this.scale = -1;
  }

  fill_sbf() {
    let w = this.sbf.width / 2;
    let h = this.sbf.height / 2;
    let sw = 1 * this.scale;
    this.sbf.stroke(this.style.shadow); this.sbf.strokeWeight(sw); 
    this.sbf.strokeJoin(ROUND); this.sbf.fill(this.style.panel);
    this.sbf.rect(0, h * 0.25, w * 0.5, h * 0.5);
    this.sbf.quad(w * 0.5, h * 0.25, w, 0, w, h, w * 0.5, h * 0.75);
  }

  create_fill_buffers() {
    let sbf_w = this.width * this.scale;
    let sbf_h = this.height * this.scale;
    this.sbf = createGraphics(sbf_w * upscale_buffers, sbf_h * upscale_buffers);
    this.sbf.background(0,0,0,0);
    this.fill_sbf();
  }

  draw(x, y, scale) {
    if (scale != this.scale) {
      this.scale = scale;
      this.create_fill_buffers();
    }

    scale += this.i['IN'].get() * 0.1;
    x -= this.i['IN'].get() * 0.2 * scale;
    y -= this.i['IN'].get() * 0.2 * scale;

    image(this.sbf, x + this.x, y + this.y, this.sbf.width / upscale_buffers * scale / this.scale, this.sbf.height / upscale_buffers * scale / this.scale);

    for(var name in this.i) this.i[name].draw(x + this.x, y + this.y, scale);
  }

  process() {}
}