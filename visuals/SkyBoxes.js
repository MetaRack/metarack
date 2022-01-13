class SkyBoxes extends Visual {

  constructor(x, y, width, height) {
    super(x, y, width, height);

    this.add_input(new InvisiblePort(0, 0, 1, 'GATE'));
    this.add_input(new InvisiblePort(0, 0, 1, 'SIZE'));

    this.val = 0;
    this.last_val = 0;
    this.boxes = []

    this.da = 0;
    this.a = 0;
  }

  star(x, y, size, rays) {
    beginShape();
    this.da = Math.PI / rays;
    this.a = 0;
    for (var i = 0; i < 2 * rays; i++) {
      vertex(x + Math.cos(this.a) * size / ((i % 2) * 4 + 1), y + Math.sin(this.a) * size / ((i % 2) * 4 + 1));
      this.a += this.da;
    }
    endShape(CLOSE);
  }

  draw(x=0, y=0, scale=1) {
    strokeWeight(1.5); strokeJoin(ROUND); fill(255);

    for (var i = 0; i < this.boxes.length; i ++) {
      if (visuals_background_color < 128) stroke(70 + (this.boxes[i][2] / 30) * 185);
      if (visuals_background_color > 128) stroke(70 + (1 - this.boxes[i][2] / 30) * 185); 
      noFill();
      // rect(x + this.x + this.boxes[i][0] - this.boxes[i][2] / 2, y + this.y + this.boxes[i][1] - this.boxes[i][2] / 2, this.boxes[i][2], this.boxes[i][2]);
      this.star(x + this.x + this.boxes[i][0], y + this.y + this.boxes[i][1], this.boxes[i][2], 4);
      this.boxes[i][2] = this.boxes[i][2] - 0.7;
    }

    for (var i = 0; i < this.boxes.length; i ++) {
      if (this.boxes[i][2] < 4) {
        delete this.boxes[i][2];
      }
    }
  }

  process() {
    this.val = this.i['GATE'].get();
    if ((this.val != this.last_val) && (this.val > this.last_val)) {
      this.boxes.push([rackrand() * (this.width - 100) + 50, rackrand() * this.height - 100, 1 + 4 * (10 - this.i['SIZE'].get())]);
    }
    this.last_val = this.val;
  }
  
}