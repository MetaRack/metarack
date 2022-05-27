#pragma once

class Scale {
  
  public:

  int scales[9][7] = {
      {0, 2, 4, 5, 7, 9, 11},
      {0, 2, 3, 5, 7, 8, 10},
      {0, 2, 3, 5, 7, 8, 11},
      {0, 2, 4, 5, 7, 9, 10},
      {0, 2, 3, 5, 7, 9, 11},
      {0, 2, 4, 5, 7, 8, 11},
      {0, 2, 4, 5, 7, 8, 10},
      {0, 3, 4, 6, 7, 9, 10},
      {0, 2, 3, 6, 7, 8, 11}
    };
    int scale = 0;
    double in = 0;
    double out = 0;
    double gate = 0;

    double gate_length = 100;
    double gate_counter = 0;

    double value = 0;
    
    double mod = 0;
    int cl_i = 0;
    double v_frac = 0;
    double last_value = 0;

    int root = 0;
    double semitones[7] = {};
    
    int prev_scale = 0;
    int prev_root = 0;


  Scale() {
    for (int j = 0; j < 7; j++) { 
      semitones[j] = (root + scales[scale][j]) % 12;
    }
    for(int i = 0; i < 7; i++) semitones[i] /= 12;
    set_param();
  } 

  double get_closest_note(double v) {
    cl_i = 0;
    v_frac = v - floor(v);
    for(int i = 0; i < 7; i++) {
      if (abs(semitones[i] / 12 - v_frac) < abs(semitones[cl_i] / 12 - v_frac)) 
        cl_i = i;
    }
    return (floor(v) + semitones[cl_i] / 12);
  }

  void set_param() {
    if (root != prev_root) {
      for (int j = 0; j < 7; j++) { 
        semitones[j] = (root + scales[scale][j]) % 12;
      }
    }
    if (scale != prev_scale) {
      if (scale == -1) scale = 0;
      for (int j = 0; j < 7; j++) { 
        semitones[j] = (root + scales[scale][j]) % 12;
      }
    }
  }

  void process() {

    set_param();
    
    value = get_closest_note(round(in * 12) / 12);
    if (last_value != value) {
      gate_counter = gate_length;
    }
    last_value = value;
    value = get_closest_note(round((in) * 12) / 12);
    if (gate_counter > 0) {
      if (gate_counter == gate_length) out = value;
      gate = 10;
      gate_counter--;
    } else {
      gate = 0;
    }
    prev_root = root;
    prev_scale = scale;
  }
};

