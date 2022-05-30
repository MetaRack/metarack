#pragma once
#include "SampleDelay.hpp"

#define depth 3

class ExpFilter {

public:

    double freq = 4000;
    double sum = 0;
    double coeffIn = freq / 10000;
    double coeffDel = 1 - coeffIn;
    double res = 0;

    OneSampleDelay* delayArray[depth];

    double delayCounter = 0;
    double cv = 0;
    double in = 0;
    double out = 0;
    double buf = 0;
    double lp = 0;
    double hp = 0;

  ExpFilter() {
    for (int i = 0; i < depth; i++) {
      delayArray[i] = new OneSampleDelay();
    }
  }

  void process () {
    coeffIn = freq / 10000;
    if (coeffIn > 1) coeffIn = 0.999;

    coeffDel = 1 - coeffIn;
    out = 0;

    delayArray[0]->in = in * coeffIn + delayArray[0]->out * coeffDel - delayArray[depth - 1]->out * res * coeffIn;
    out = delayArray[0]->out;
    for (int i = 1; i < depth; i++) {
      delayArray[i]->in = out * coeffIn + delayArray[i]->out * coeffDel;
      out = delayArray[i]->out;
    }
    for (int i = 0; i < depth; i++) {
      delayArray[i]->process();
    }

    in = out;
    delayArray[0]->in = in * coeffIn + delayArray[0]->out * coeffDel - delayArray[depth - 1]->out * res * coeffIn;
    out = delayArray[0]->out;
    for (int i = 1; i < depth; i++) {
      delayArray[i]->in = out * coeffIn + delayArray[i]->out * coeffDel;
      out = delayArray[i]->out;
    }
    for (int i = 0; i < depth; i++) {
      delayArray[i]->process();
    }
  }
};