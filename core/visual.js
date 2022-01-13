class Visual extends ProtoVisual{
  constructor(x, y, width, height) {
    super(x, y, width, height);
    engine.add_visual(this);
  }
}