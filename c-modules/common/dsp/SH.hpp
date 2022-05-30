#pragma once

class SampleAndHold {
public:

    bool holding = false;
    double in = 0;
    double gate = 0;
    double out = 0;


  SampleAndHold() {
    
  } 

  double process() {
    if (gate > 1) {
      if (holding == false) {
        out = in;
        holding = true;
      }
    } else holding = false;
    return out;
    }
};
