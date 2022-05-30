#include <stdio.h>
#include "emscripten.h"
#include <emscripten/bind.h>
#include "stdlib.h"
#include <math.h>
#include "../libsamplerate-0.1.9/src/samplerate.h"
#include "../dsp/RingBuffer.hpp"
#include <cmath>

#define HISTORY_SIZE (1<<21)

struct Delay {

	DoubleRingBuffer<float, HISTORY_SIZE> historyBuffer;
	DoubleRingBuffer<float, 16> outBuffer;
	SRC_STATE* src;
	float lastWet = 0.f;
	double in = 0;
	double out = 0;
	double feedback = 0;
	double mix = 0;
	double delay = 0;
	double wet = 0;

	Delay() {
		src = src_new(SRC_SINC_FASTEST, 1, NULL);
		assert(src);
	}

	~Delay() {
		src_delete(src);
	}

	double clamp(double x, double a, double b) {
		return std::max(std::min(x, b), a);
	}

	double crossfade(double a, double b, double p) {
		return a + (b - a) * p;
	}

	//double process(double _in, double _feedback, double _delay, double _mix) {
	void process() {
		// Get input to delay block
		// in = _in;
		// feedback = _feedback;
		feedback = clamp(feedback, 0.f, 1.f);
		float dry = in * (1 - feedback) + lastWet * feedback;

		// Compute delay time in seconds
		// float delay = _delay;
		delay = clamp(delay, 0.f, 1.f);
		delay = 1e-3 * std::pow(10.f / 1e-3, delay);
		// Number of delay samples
		float index = std::round(delay * 44100);

		// Push dry sample into history buffer
		if (!historyBuffer.full()) {
			historyBuffer.push(dry);
		}

		// How many samples do we need consume to catch up?
		float consume = index - historyBuffer.size();

		if (outBuffer.empty()) {
			double ratio = 1.f;
			if (std::fabs(consume) >= 16.f) {
				// Here's where the delay magic is. Smooth the ratio depending on how divergent we are from the correct delay time.
				ratio = std::pow(10.f, clamp(consume / 10000.f, -1.f, 1.f));
			}

			SRC_DATA srcData;
			srcData.data_in = (const float*) historyBuffer.startData();
			srcData.data_out = (float*) outBuffer.endData();
			srcData.input_frames = std::min((int) historyBuffer.size(), 16);
			srcData.output_frames = outBuffer.capacity();
			srcData.end_of_input = false;
			srcData.src_ratio = ratio;
			src_process(src, &srcData);
			historyBuffer.startIncr(srcData.input_frames_used);
			outBuffer.endIncr(srcData.output_frames_gen);
		}

		wet = 0.f;
		if (!outBuffer.empty()) {
			wet = outBuffer.shift();
		}

		// // Apply color to delay wet output
		// float color = params[COLOR_PARAM].getValue() + inputs[COLOR_INPUT].getVoltage() / 10.f;
		// color = clamp(color, 0.f, 1.f);
		// float colorFreq = std::pow(100.f, 2.f * color - 1.f);

		// float lowpassFreq = clamp(20000.f * colorFreq, 20.f, 20000.f);
		// lowpassFilter.setCutoffFreq(lowpassFreq / 44100);
		// lowpassFilter.process(wet);
		// wet = lowpassFilter.lowpass();

		// float highpassFreq = clamp(20.f * colorFreq, 20.f, 20000.f);
		// highpassFilter.setCutoff(highpassFreq / 44100);
		// highpassFilter.process(wet);
		// wet = highpassFilter.highpass();

		lastWet = wet;

		// float mix = _mix;
		mix = clamp(mix, 0.f, 1.f);
		out = crossfade(in, wet, mix);

		// return out;
	}
};

extern "C" {

  void* constructor() {
    return new Delay();
  }

  //double process(Delay* ptr, double _in, double _feedback, double _delay, double _mix) {
  void process(Delay* ptr, double* buf) {
  	ptr->in = buf[0];
  	ptr->feedback = buf[1];
  	ptr->delay = buf[2];
  	ptr->mix = buf[3];

    ptr->process();

    buf[4] = ptr->out;
  }

}
