class Landscape extends Visual {

  constructor(x, y, width, height, num_mountains) {
    super(x, y, width, height);

    // buffers
    this.sbf;

    this.scale = -1;

    this.num_mountains = num_mountains;
    this.mountains = [];

    this.add_input(new InvisiblePort(0, 0, 1, 'BOX_GATE'));
    this.add_input(new InvisiblePort(0, 0, 1, 'SUN_PHASE'));

    this.land;

    this.boxes = new SkyBoxes(0, 0, this.width, this.height);

    this.sun = new CelestialBody(this.width / 5 + this.width / 5 * (1 - 2 * rackrand()), 
                                 this.height * 0.5 + this.height / 5 * (1 - 2 * rackrand()), 100, this.width * 3 / 4, this.height * 3 / 4);
  }

  fill_sbf() {
    let w = this.sbf.width;
    let h = this.sbf.height;

    // for (var i = 0; i < this.num_mountains; i++) {
    //   let m_height = (20 + (10 + rackrand() * 40) * rackrand()) * this.scale;
    //   let m_width = (100 + w / 8 * rackrand());
    //   let m_x = (w / 2 * rackrand());
    //   this.mountains.push(new Mountain(m_x, h - m_height, 9, m_width, m_height));
    // }
    for (var i = 0; i < this.num_mountains; i++) {
      let m_height = (40 + (50 + rackrand() * 150) * rackrand()) * this.scale;
      let m_width = (300 + 100 * rackrand()) * this.scale;
      let m_x = w * 1.1 - (w / 2 * rackrand());
      this.mountains.push(new Mountain(m_x, h - m_height, 9, m_width, m_height));
    }
    this.mountains.sort((a,b) => (a.height < b.height) ? 1 : ((b.height < a.height) ? -1 : 0))

    for (var i = 0; i < this.num_mountains; i++) {
      this.mountains[i].draw_to_buffer(0, 0, this.scale, this.sbf);
    }

    this.land = new Land(0, 0, 9, w, h);
    this.land.draw_to_buffer(0, 0, this.scale, this.sbf);
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

    this.boxes.draw(x, y);

    this.sun.draw(x, y);

    image(this.sbf, x + this.x, y + this.y, this.sbf.width / upscale_buffers, this.sbf.height / upscale_buffers);

    // this.land.draw(x + this.x, y + this.y);

    // for (var i = 0; i < this.num_mountains; i++) {
    //   this.mountains[i].draw(x + this.x, y + this.y, scale);
    // }

    // stroke(0); strokeWeight(2); noFill();
    // line(x, y + this.y + this.sbf.height / upscale_buffers, x + this.sbf.width / upscale_buffers, y + this.y + this.sbf.height / upscale_buffers);
  }

  process() {
    this.boxes.i['GATE'].set(this.i['BOX_GATE'].get());
    this.sun.i['PHASE'].set(this.i['SUN_PHASE'].get());
  }
  
}