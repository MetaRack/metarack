class Scale extends Module {
  constructor(root='C', scale=1) {
    super({w:hp2px(4)});

    //this.note_names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    // this.scales = {
    //   'Major': [0, 2, 4, 5, 7, 9, 11],
    //   'Minor': [0, 2, 3, 5, 7, 8, 10],
    //   'HarmMinor': [0, 2, 3, 5, 7, 8, 11],
    //   'Mixolydian': [0, 2, 4, 5, 7, 9, 10],
    //   'MelMinor': [0, 2, 3, 5, 7, 9, 11],
    //   'HarmMajor': [0, 2, 4, 5, 7, 8, 11],
    //   'MelMajor': [0, 2, 4, 5, 7, 8, 10],
    //   'HungarianMajor': [0, 3, 4, 6, 7, 9, 10],
    //   'HungarianMinor': [0, 2, 3, 6, 7, 8, 11]
    // }

    this.scales = [
      [0, 2, 4, 5, 7, 9, 11],
      [0, 2, 3, 5, 7, 8, 10],
      [0, 2, 3, 5, 7, 8, 11],
      [0, 2, 4, 5, 7, 9, 10],
      [0, 2, 3, 5, 7, 9, 11],
      [0, 2, 4, 5, 7, 8, 11],
      [0, 2, 4, 5, 7, 8, 10],
      [0, 3, 4, 6, 7, 9, 10],
      [0, 2, 3, 6, 7, 8, 11]
    ]
    this.add_control(new Encoder({x:hp2px(0.6), y:6, r:7, vmin:1, vmax:12, val:1, precision:0, name:'ROOT'}));
    this.add_control(new Encoder({x:hp2px(0.6), y:26, r:7, vmin:1, vmax:9, val:1, precision:0, name:'SCL'}));
    this.add_input(new Port({x:hp2px(0.8), y:48, r:6, name:'IN'}));
    this.add_input(new Port({x:hp2px(0.8), y:68, r:6, name:'CV'}));
    this.add_output(new Port({x:hp2px(0.8), y:88, r:6, name:'GATE'}));
    this.add_output(new Port({x:hp2px(0.8), y:108, r:6, name:'OUT'}));

    // this.root = this.c['ROOT'].get().toFixed(0) - 1;
    // this.scale = this.c['SCL'].get().toFixed(0) - 1;

    // this.semitones = [];
    // for (var j = 0; j < this.scales[this.scale].length; j++) { 
    //   this.semitones.push((this.root + this.scales[this.scale][j]) % 12);
    // }

    this.gate_length = 100;
    this.gate_counter = 0;

    this.value = 0;
    
    this.mod = 0;
    this.cl_i = 0;
    this.v_frac = 0;
    this.last_value = 0;

    this.scale = 0;
    this.root = 0;
    this.semitones = [];
    for (var j = 0; j < this.scales[this.scale].length; j++) { 
      this.semitones.push((this.root + this.scales[this.scale][j]) % 12);
    }
    for(var i = 0; i < this.semitones.length; i ++) this.semitones[i] /= 12;
    this.prev_scale = 0;
    this.prev_root = 0;
    this.set_param();
  }

  get_scale() {
    return `${this.root} ${this.scale}`;
  }

  get_closest_note(v) {
    this.cl_i = 0;
    this.v_frac = v - Math.floor(v);
    for(var i = 0; i < this.semitones.length; i++) {
      if (Math.abs(this.semitones[i] / 12 - this.v_frac) < Math.abs(this.semitones[this.cl_i] / 12 - this.v_frac)) 
        this.cl_i = i;
    }
    return (Math.floor(v) + this.semitones[this.cl_i] / 12);
  }

  set_param() {
    this.root = this.c['ROOT'].get().toFixed(0) - 1;
    if (this.root != this.prev_root) {
      this.semitones = [];
      for (var j = 0; j < this.scales[this.scale].length; j++) { 
        this.semitones.push((this.root + this.scales[this.scale][j]) % 12);
      }
    }
    this.scale = this.c['SCL'].get().toFixed(0) - 1;
    if (this.scale != this.prev_scale) {
      this.semitones = [];
      if (this.scale == -1) this.scale = 0;
      for (var j = 0; j < this.scales[this.scale].length; j++) { 
        this.semitones.push((this.root + this.scales[this.scale][j]) % 12);
      }
    }
  }

  // draw_dbf (buf, x, y, w, h) {
  //   if (this.c['ROOT'].changed) {
  //     this.root = this.c['ROOT'].get().toFixed(0) - 1;
  //     this.semitones = [];
  //     for (var j = 0; j < this.scales[this.scale].length; j++) { 
  //       this.semitones.push((this.root + this.scales[this.scale][j]) % 12);
  //     }
  //   }
  //   if (this.c['SCL'].changed) {
  //     this.scale = this.c['SCL'].get().toFixed(0) - 1;
  //     this.semitones = [];
  //     for (var j = 0; j < this.scales[this.scale].length; j++) { 
  //       this.semitones.push((this.root + this.scales[this.scale][j]) % 12);
  //     }
  //   }
  // }

  process() {
    this.set_param();
    this.value = this.get_closest_note(Math.round(this.i['IN'].get() * 12) / 12);
    if (this.last_value != this.value) {
      this.gate_counter = this.gate_length;
    }
    this.last_value = this.value;
    this.value = this.get_closest_note(Math.round((this.i['IN'].get() + this.i['CV'].get()) * 12) / 12);
    if (this.gate_counter > 0) {
      if (this.gate_counter == this.gate_length) this.o['OUT'].set( this.value );
      this.o['GATE'].set(10);
      this.gate_counter --;
    } else {
      this.o['GATE'].set(-10);
    }
    this.prev_root = this.root;
    this.prev_scale = this.scale;
    //this.textdisplay.process(this.semitones[this.cl_i] * 12);
  }
}

engine.add_module_class(Scale);