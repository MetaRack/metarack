#pragma once

class VCO {
public:

  double freq = 261.63;
  double sample_rate = 44100;
  double delta = M_PI * 2 / (sample_rate / freq);
  double phase = 0;

  double wave = 0;
  double amp = 1;
  double cv = 0;
  double fm = 0;
  double pw = 0.5;
  double value = 0;
  double type = 0;
  double mod = 0;
  double mod_prev = 0;
  double phase_inc = delta;
  double _alpha = 0.01;
  double out = 0;


  VCO() {
    
  } 

  void update_params() {
    type = wave / 10;
    delta = M_PI * 2 / (sample_rate / freq);
  }

  void process() {
    update_params();

    if (type >= 0) {
      value = sin(phase) * (1 - type) + (phase / M_PI - 1) * type;
    } else {
      value = sin(phase) * (1 + type) - ((phase < M_PI * pw * 2 ) * 2 - 1) * type;
    }
    
    mod = _alpha * (cv + fm) + (1 - _alpha) * mod;
    if (mod != mod_prev) { phase_inc = delta * pow(2, mod); mod_prev = mod; }
    phase += phase_inc;
    if (phase > M_PI * 2) {
      phase -= M_PI * 2;
    }
    out = value * amp;
  }
};
