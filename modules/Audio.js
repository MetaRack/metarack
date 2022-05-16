class Audio extends Module {

  constructor() {
    super({w:hp2px(4)});

    this.scope = new RawScope(0, 0, 30, 30);
    // this.attach(this.scope);

    this.add_input(new Port({x:hp2px(0.8), y:88, r:6, name:'LEFT'}));
    this.add_input(new Port({x:hp2px(0.8), y:108, r:6, name:'RIGHT'}));

    this.L = 0;
    this.R = 0;
  }

  draw_cbf(buf, w, h) {
    super.draw_cbf(buf, w, h);
    let sw = 1;
    buf.stroke(60); buf.strokeWeight(sw); buf.fill(255);
    buf.rect(sw + w * 0.2, sw + h * 0.63, w * 0.6 - 2 * sw, h * 0.038 - 2 * sw);

    sw = 0.1;
    buf.textSize(w * 0.18);
    buf.fill(60);
    buf.textAlign(CENTER, CENTER);
    buf.strokeWeight(sw);
    buf.text('LVLS', w / 2, sw*2 + h * 0.63 + h * 0.04 / 2);
  }

  draw_dbf(buf, x, y, w, h) {
    buf.stroke(60);
    buf.strokeWeight(0.4);
    for (var i = 0; i < 10; i ++) {
      if (Math.abs(this.L) > i) buf.fill(120);
      else buf.fill(250);
      buf.circle(x + w * 0.3, y + h * 0.6 - h * i * 0.057, w * (0.1 + 0.005 * i));
      if (Math.abs(this.R) > i) buf.fill(120);
      else buf.fill(250);
      buf.circle(x + w * 0.7, y + h * 0.6 - h * i * 0.057, w * (0.1 + 0.005 * i));
    }
  }

  process() {
    if (this.i['RIGHT'].port.wires.length == 0) {
      this.L = this.i['LEFT'].get();
      this.R = this.L;
    } else {
      this.L = this.i['LEFT'].get();
      this.R = this.i['RIGHT'].get();
    }
  }
}