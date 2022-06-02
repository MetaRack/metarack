class InfoIPFS extends Module {

  constructor(freq) {
    super({w:hp2x(20)});
  }

  draw_cbf(buf, w, h) {
    super.draw_cbf(buf, w, h);
    let sw = 1;
    buf.stroke(60); buf.strokeWeight(sw); buf.fill(230);
    buf.rect(sw + w * 0.05, sw + h * 0.05, w - 2 * sw - w * 0.1, h - 2 * sw - h * 0.1);

    let text = "Hooray, this module\nwas loaded from\nIPFS"

    buf.textSize(h / 20);
    buf.fill(60);
    buf.textAlign(LEFT, TOP);
    buf.strokeWeight(sw / 10);
    buf.text(text, sw + w * 0.07, sw + h * 0.1);
  }

  process() {}
}

engine.add_module_class(InfoIPFS);

