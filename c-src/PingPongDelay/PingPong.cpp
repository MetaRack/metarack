#include "emscripten.h"
#include <stdio.h>
#include "stdlib.h"
#include <emscripten/bind.h>
#include "../dsp/SmoothCrossFade.hpp"
#include "../dsp/ExpFilter.hpp"
#include "../dsp/Delay.hpp"


class PingPong {
  public:

    Delay* leftDelay = new Delay();
    Delay* rightDelay = new Delay();

    double feedback = 0;
    double dw = 0;

    bool sync = false;
    bool prevSync = false;

    bool mode = false;
    bool prevMode = false;

    double leftTime = 0;
    double rightTime = 0;

    double leftIn = 0;
    double rightIn = 0;
    double leftOut = 0;
    double rightOut = 0;

    SmoothCrossFade* CFDW = new SmoothCrossFade();
    SmoothCrossFade* CFFb = new SmoothCrossFade();
    SmoothCrossFade* CFAmp = new SmoothCrossFade();
    SmoothCrossFade* CFMode = new SmoothCrossFade();

    PingPong() {
      CFMode->set(0);
    }

    void updateParam() {
      leftDelay->delay = leftTime;
      rightDelay->delay = rightTime;

      leftOut = 0;
      rightOut = 0;

      leftDelay->feedback = CFFb->get();
      rightDelay->feedback = CFFb->get();
      leftDelay->mix = CFDW->get();
      rightDelay->mix = CFDW->get();
    }

    

    void process() {
      updateParam();

      if ((prevSync != sync) && (sync)) {
        CFDW->set(1);
        CFFb->set(1);
        CFAmp->set(1);
      }

      if ((prevMode != mode) && (mode)) {
        CFMode->set(1);
      }

      if ((prevMode != mode) && (!mode)) {
        CFMode->set(0);
      }

      if (!sync) {
        CFDW->set(dw);
        CFFb->set(feedback);
        CFAmp->set(0);
      }

      if (!mode) {
        rightDelay->in = (leftIn * (1 - CFAmp->get()) + leftDelay->out * CFAmp->get()) * CFMode->get() + (rightIn * (1 - CFAmp->get()) + rightDelay->out * CFAmp->get()) * (1 - CFMode->get());;
        leftDelay->in = (rightIn * (1 - CFAmp->get()) + rightDelay->out * CFAmp->get()) * CFMode->get() + (leftIn * (1 - CFAmp->get()) + leftDelay->out * CFAmp->get()) * (1 - CFMode->get());
      } else {
        rightDelay->in = (leftIn * (1 - CFAmp->get()) + leftDelay->out * CFAmp->get()) * CFMode->get() + (rightIn * (1 - CFAmp->get()) + rightDelay->out * CFAmp->get()) * (1 - CFMode->get());
        leftDelay->in = (rightIn * (1 - CFAmp->get()) + rightDelay->out * CFAmp->get()) * CFMode->get() + (leftIn * (1 - CFAmp->get()) + leftDelay->out * CFAmp->get()) * (1 - CFMode->get());
      }

      leftDelay->process();
      rightDelay->process();

      leftOut = leftDelay->out;
      rightOut = rightDelay->out;

      prevSync = sync;
      prevMode = mode;
    }
    
};

extern "C" {

  void* constructor() {
    return new PingPong();
  }

  void process(PingPong* ptr, double* buf) {
    ptr->leftIn = buf[0];
    ptr->rightIn = buf[1];

    ptr->sync = (bool) buf[2];
    ptr->mode = (bool) buf[3];
    ptr->leftTime = buf[4];
    ptr->rightTime = buf[5];
    ptr->feedback = buf[6];
    ptr->dw = buf[7];

    ptr->process();

    buf[8] = ptr->leftOut;
    buf[9] = ptr->rightOut;
  }

}