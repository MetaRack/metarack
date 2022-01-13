class Module extends ProtoModule {
  constructor(name, x, y, width, height) {
    super(name, x, y, width, height, engine.module_style);
    engine.add_module(this);
  }

  connect(oport, iport, scale=1, offset=0) {
    engine.add_wire(oport, iport, scale, offset);
  }
}