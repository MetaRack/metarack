#pragma once

class BernoulliGate {
public:

  double gate = 0;
  double last_gate = 0;
  char state = 'l';
  double p = 0.5;
  double out_l = 0;
  double out_r = 0;


  BernoulliGate() {
    
  } 

  void process() {
    double _rand = rand();
    if (last_gate < gate) {
      if (((float) _rand / RAND_MAX) < p)
        state = 'l';
      else
        state = 'r';  
    } 

    if (state == 'l') {
      out_l = gate;
      out_r = 0;
    } else {
      out_r = gate;
      out_l = 0;
    }

    last_gate = gate;
  }
};
