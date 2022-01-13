class Port extends ProtoPort {
  constructor(rx, ry, rr, name) {
    super(rx, ry, rr, name, engine.port_style);
  }

  connect(port, scale=1, offset=0) {
    engine.add_wire(this, port, scale, offset);
  }
}

class InvisiblePort extends InvisibleProtoPort {
  constructor(rx, ry, rr, name) {
    super(rx, ry, rr, name, engine.port_style);
  }

  connect(port, scale=1, offset=0) {
    engine.add_wire(this, port, scale, offset);
  }
}