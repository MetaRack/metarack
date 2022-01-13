class ProtoVisual {
  constructor(x, y, width, height) {
    this.height = height;
    this.width = width;

    this.x = x;
    this.y = y;

    this.i = {};
    this.o = {};
  }

  add_input(port) { this.i[port.get_name()] = port; }

  add_output(port) { this.o[port.get_name()] = port; }

  process() {}

  set_position(x, y) { this.x = x; this.y = y; }
}