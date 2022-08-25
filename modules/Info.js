class Info extends Module {

  constructor(freq, _p5=rackp5) {
    super({w:hp2x(10)});
    //buf = _p5;
  }

  draw_cbf(buf, w, h) {
    super.draw_cbf(buf, w, h);
    let sw = 1;
    buf.stroke(60); buf.strokeWeight(sw*3); buf.fill(255);
    //buf.rect(sw + w * 0.05, sw + h * 0.05, (w - 2 * sw - w * 0.1), (h - 2 * sw - h * 0.1) / 1.8, 5);

    let text = "F - fullscreen\n\nU - undo\n\nS - save\n\nL - load\n\n\nModulation level - \nhold cmd \nwhile rotating a knob\n\n\nClick on screen to start\n"

    buf.textSize(h / 30);
    buf.fill(0);
    buf.textAlign(buf.LEFT, buf.TOP);
    buf.strokeWeight(sw / 10);
    buf.text(text, sw + w * 0.07, sw + h * 0.1);
  }

  process() {}
}

engine.add_module_class(Info);