class Scale extends Module {
  constructor(name, base_note=null, type=null, x=-1, y=-1) {
    super(name, x, y, 30, 70);

    this.note_names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    this.scales = {
      'Major': [0, 2, 4, 5, 7, 9, 11],
      'HarmMajor': [0, 2, 4, 5, 7, 8, 11],
      'MelMajor': [0, 2, 4, 5, 7, 8, 10],
      'Minor': [0, 2, 3, 5, 7, 8, 10],
      'HarmMinor': [0, 2, 3, 5, 7, 8, 11],
      'MelMinor': [0, 2, 3, 5, 7, 9, 11],
      'Mixolydian': [0, 2, 4, 5, 7, 9, 10],
      'HungarianMajor': [0, 3, 4, 6, 7, 9, 10],
      'HungarianMinor': [0, 2, 3, 6, 7, 8, 11]
    }

    if (!base_note) this.base_note = this.note_names[Math.floor(rackrand() * this.note_names.length)];
    else this.base_note = base_note;
    if (!type) this.type = Object.keys(this.scales)[Math.floor(rackrand() * Object.keys(this.scales).length)];
    else this.type = type;

    this.base_note_num = 0;

    for (var i = 0; i < this.note_names.length; i++) {
      if (this.base_note == this.note_names[i]) {
        this.base_note_num = i;
        break;
      }
    }

    this.semitones = [];

    for (var j = 0; j < this.scales[this.type].length; j++) { 
      this.semitones.push((this.base_note_num + this.scales[this.type][j]) % 12);
    }

    this.textdisplay = new TextSetDisplay (0, 0, 30, 30, this.note_names, 60);

    this.scope = new RawScope(0, 0, 30, 30, 'scope', 30, 128);

    this.add_input(new Port(8, 38, 7, 'CV'));
    this.add_input(new Port(22, 38, 7, 'IN'));
    this.add_output(new Port(8, 50, 7, '1ST'));
    this.add_output(new Port(22, 50, 7, '2ST'));
    this.add_output(new Port(8, 62, 7, '3ST'));
    this.add_output(new Port(22, 62, 7, 'GATE'));

    this.gate_length = 100;
    this.gate_counter = 0;

    this.value = 0;
    for(var i = 0; i < this.semitones.length; i ++) this.semitones[i] /= 12;
    this.mod = 0;
    this.cl_i = 0;
    this.v_frac = 0;
    this.last_value = 0;
  }

  get_scale() {
    return `${this.base_note} ${this.type}`;
  }

  get_closest_note(v) {
    this.cl_i = 0;
    this.v_frac = v - Math.floor(v);
    for(var i = 0; i < this.semitones.length; i ++) {
      if (Math.abs(this.semitones[i] - this.v_frac) < Math.abs(this.semitones[this.cl_i] - this.v_frac)) this.cl_i = i;
    }
    return (Math.floor(v) + this.semitones[this.cl_i]);
  }

  draw(x, y, scale) {
    x += this.o['1ST'].get() * 0.05;
    y += this.o['1ST'].get() * 0.05;

    super.draw(x, y, scale);
    this.textdisplay.draw(x + this.x, y + this.y, scale);
  }

  process() {
    this.value = this.get_closest_note(Math.round(this.i['IN'].get() * 12) / 12);
    if (this.last_value != this.value) {
      this.gate_counter = this.gate_length;
    }
    this.last_value = this.value;
    this.value = this.get_closest_note(Math.round((this.i['IN'].get() + this.i['CV'].get()) * 12) / 12);
    if (this.gate_counter > 0) {
      if (this.gate_counter == this.gate_length) this.o['1ST'].set( this.value );
      this.o['GATE'].set( 10 );
      this.gate_counter --;
    } else {
      this.o['GATE'].set( -10 );
    }
    this.textdisplay.process(this.semitones[this.cl_i] * 12);
  }
}