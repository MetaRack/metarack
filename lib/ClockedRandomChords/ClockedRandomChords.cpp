#include <stdio.h>
#include "emscripten.h"
#include <emscripten/bind.h>
#include "stdlib.h"
#include <math.h>

#include "../dsp/ADSR.hpp"
#include "../dsp/VCO.hpp"
#include "../dsp/SH.hpp"
#include "../dsp/BG.hpp"
#include "../dsp/Saturn.hpp"
#include "../dsp/Scale.hpp"

#define _USE_MATH_DEFINES

class ClockedRandomChords {
public:

  BernoulliGate* BG[3];
  ADSR* ENV[3] = {};
  VCO* OSC[3] = {};
  Saturn* SHP[3] = {};
  Scale* SCL[3] = {};
  SampleAndHold* SH[3] = {};
  double p[3] = {0, 0, 0};


  double gate = 0;
  double out = 0;
  double shape = 0;
  double scale = 0;
  double root = 0;
  double offset = 0;
  double width = 0;
  double A = 0;
  double D = 0;
  double S = 0;
  double R = 0;

  int proc_i = 0;


  ClockedRandomChords() {
    for (int i = 0; i < 3; i++) {
      BG[i] = new BernoulliGate();
      ENV[i] = new ADSR();
      OSC[i] = new VCO();
      SHP[i] = new Saturn();
      SCL[i] = new Scale();
      SH[i] = new SampleAndHold();
      p[i] = 0;
    }

    BG[0]->p = 0.5;
    BG[1]->p = 0.6;
    BG[2]->p = 0.7;
  }

  void update_params () {
    for (int i = 0; i < 3; i++) {
      BG[i]->p = p[i];
      ENV[i]->A = A;
      ENV[i]->D = D;
      ENV[i]->S = S;
      ENV[i]->R = R;
      SHP[i]->fold = shape;
      SCL[i]->scale = scale;
      SCL[i]->root = root;
    }
  }

  //double process(double* buf, double _gate, double _A, double _D, double _S, double _R, double _P1, double _P2, double _P3, double _shape, double _scale, double _root, double _offset, double _width) {
  void process() {

    update_params();

    out = 0;

    for (proc_i = 0; proc_i < 3; proc_i++) {
      BG[proc_i]->gate = gate;
      ENV[proc_i]->gate = BG[proc_i]->out_l;
      SH[proc_i]->gate = BG[proc_i]->out_l;
      SH[proc_i]->in = (((float)rand() / RAND_MAX) * width) + offset;
      SCL[proc_i]->in = SH[proc_i]->out;
      OSC[proc_i]->cv = SCL[proc_i]->out;
      SHP[proc_i]->in = OSC[proc_i]->out;

      BG[proc_i]->process();
      ENV[proc_i]->process();
      OSC[proc_i]->process();
      SH[proc_i]->process();
      SCL[proc_i]->process();
      SHP[proc_i]->process();

      out += SHP[proc_i]->out * ENV[proc_i]->out / 10 / 3;
    }
    // buf[0] = out;
    // return out;
  }
};

extern "C" {

  void* constructor() {
    return new ClockedRandomChords();
  }

  //double process(ClockedRandomChords* ptr, double* buf, double _gate, double _A, double _D, double _S, double _R, double _P1, double _P2, double _P3, double _shape, double _scale, double _root, double _offset, double _width) {
  void process(ClockedRandomChords* ptr, double* buf) {
    ptr->gate = buf[0];

    ptr->A = buf[1];
    ptr->D = buf[2];
    ptr->S = buf[3];
    ptr->R = buf[4];

    ptr->p[0] = buf[5];
    ptr->p[1] = buf[6];
    ptr->p[2] = buf[7];

    ptr->shape = buf[8];
    ptr->scale = buf[9];
    ptr->root = buf[10];

    ptr->offset = buf[11];
    ptr->width = buf[12];

    ptr->process();

    buf[13] = ptr->out;
  }

}
