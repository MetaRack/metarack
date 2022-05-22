class DattorroReverbProcessor {

    constructor() {

      // hpp

      this.inputL = 0.0;
      this.inputR = 0.0;
      this.outputL = 0.0;
      this.outputR = 0.0;
      
      this.inputLowCut = 0.0;
      this.inputHighCut = 10000.0;
      this.reverbHighCut = 10000.0;
      this.reverbLowCut = 0.0;
      this.inputDiffusion1 = 0.75;
      this.inputDiffusion2 = 0.625;
      this.plateDiffusion1 = 0.7;
      this.plateDiffusion2 = 0.5;
      this.decay = 0.9999;
      this.diffuseInput = 0.0;

      this._timeScale = 1.0;
      this._preDelayTime = 0.0;
      this._kInApf1Time = 141;
      this._kInApf2Time = 107;
      this._kInApf3Time = 379;
      this._kInApf4Time = 277;

      this._kApf1TimeL = 672;
      this._kDelay1TimeL = 4453;
      this._kApf2TimeL = 1800;
      this._kDelay2TimeL = 3720;

      this._kApf1TimeR = 908;
      this._kDelay1TimeR = 4217;
      this._kApf2TimeR = 2656;
      this._kDelay2TimeR = 3163;

      this._kTapsL = [266, 2974, 1913, 1996, 1990, 187, 1066];
      this._kTapsR = [266, 2974, 1913, 1996, 1990, 187, 1066];
      this._scaledTapsL = [0,0,0,0,0,0,0];
      this._scaledTapsR = [0,0,0,0,0,0,0];

      // cpp

      this._dattorroSampleRate = 29761.0;
      this._sampleRate = sample_rate;
      this._dattorroScaleFactor = this._sampleRate / this._dattorroSampleRate;

      this._preDelay = new InterpDelay(192010, 0);

      this._inputLpf = new OnePoleLPFilter(this.inputHighCut);
      this._inputHpf = new OnePoleHPFilter(this.inputLowCut);

      this._inApf1 = new AllPassFilter(this.dattorroScale(20 * this._kInApf1Time), this.dattorroScale(this._kInApf1Time), this.inputDiffusion1);
      this._inApf2 = new AllPassFilter(this.dattorroScale(20 * this._kInApf2Time), this.dattorroScale(this._kInApf2Time), this.inputDiffusion1);
      this._inApf3 = new AllPassFilter(this.dattorroScale(20 * this._kInApf3Time), this.dattorroScale(this._kInApf3Time), this.inputDiffusion2);
      this._inApf4 = new AllPassFilter(this.dattorroScale(20 * this._kInApf4Time), this.dattorroScale(this._kInApf4Time), this.inputDiffusion2);

      this._apf1L = new AllPassFilter(this.dattorroScale(40 * this._kApf1TimeL), this.dattorroScale(this._kApf1TimeL), -this.plateDiffusion1);
      this._delay1L = new InterpDelay(this.dattorroScale(40 * this._kDelay1TimeL), this.dattorroScale(this._kDelay1TimeL));
      this._filterL = new OnePoleLPFilter(this.reverbHighCut);
      this._hpfL = new OnePoleHPFilter(this.reverbLowCut);
      this._apf2L = new AllPassFilter(this.dattorroScale(40 * this._kApf2TimeL), this.dattorroScale(this._kApf2TimeL), this.plateDiffusion2);
      this._delay2L = new InterpDelay(this.dattorroScale(40 * this._kDelay2TimeL), this.dattorroScale(this._kDelay2TimeL));

      this._apf1R = new AllPassFilter(this.dattorroScale(40 * this._kApf1TimeR), this.dattorroScale(this._kApf1TimeR), -this.plateDiffusion1);
      this._delay1R = new InterpDelay(this.dattorroScale(40 * this._kDelay1TimeR), this.dattorroScale(this._kDelay1TimeR));
      this._filterR = new OnePoleLPFilter(this.reverbHighCut);
      this._hpfR = new OnePoleHPFilter(this.reverbLowCut);
      this._apf2R = new AllPassFilter(this.dattorroScale(40 * this._kApf2TimeR), this.dattorroScale(this._kApf2TimeR), this.plateDiffusion2);
      this._delay2R = new InterpDelay(this.dattorroScale(40 * this._kDelay2TimeR), this.dattorroScale(this._kDelay2TimeR));

      this._apf1TimeL = this.dattorroScale(this._kApf1TimeL);
      this._apf2TimeL = this.dattorroScale(this._kApf2TimeL);
      this._apf1TimeR = this.dattorroScale(this._kApf1TimeR);
      this._apf2TimeR = this.dattorroScale(this._kApf2TimeR);

      for(var i = 0; i < 7; i++) {
        this._scaledTapsL[i] = this.dattorroScale(this._kTapsL[i]);
        this._scaledTapsR[i] = this.dattorroScale(this._kTapsR[i]);
      }

      this._inputDCBlockL = new OnePoleHPFilter(20.0);
      this._inputDCBlockR = new OnePoleHPFilter(20.0);

      this._outDCBlockL = new OnePoleHPFilter(20.0);
      this._outDCBlockR = new OnePoleHPFilter(20.0);

      this._decay = this.decay;
      this._sumL = 0.0;
      this._sumR = 0.0;

      this._fade = 1.0;
      this._fadeTime = 0.002;
      this._fadeStep = 1.0 / (this._fadeTime * this._sampleRate);
      this._fadeDir = 1.0;

      this._tankFeed = 0.0;
    }

    dattorroScale(delayTime) {
      return delayTime * this._dattorroScaleFactor;
    }

    setTimeScale(timeScale) {
      if (timeScale == this._timeScale) {
        return;
      }

      this._timeScale = timeScale;
      if(this._timeScale < 0.0001) {
        this._timeScale = 0.0001;
      }

      this._delay1L.setDelayTime(this.dattorroScale(this._kDelay1TimeL * this._timeScale));
      this._delay2L.setDelayTime(this.dattorroScale(this._kDelay2TimeL * this._timeScale));
      this._apf1TimeL = this.dattorroScale(this._kApf1TimeL * this._timeScale);
      this._apf2TimeL = this.dattorroScale(this._kApf2TimeL * this._timeScale);

      this._delay1R.setDelayTime(this.dattorroScale(this._kDelay1TimeR * this._timeScale));
      this._delay2R.setDelayTime(this.dattorroScale(this._kDelay2TimeR * this._timeScale));
      this._apf1TimeR = this.dattorroScale(this._kApf1TimeR * this._timeScale);
      this._apf2TimeR = this.dattorroScale(this._kApf2TimeR * this._timeScale);
    }


    setPreDelay(t) {
      if (t == this._preDelayTime) {
        return;
      }

      this._preDelayTime = t;
      this._preDelay.setDelayTime(this._preDelayTime * this._sampleRate);
    }

    clear() {
      this.input = 0.0;
      this.output = 0.0;

      this._preDelay.clear();
      this._inputLpf.clear();
      this._inputHpf.clear();
      this._inApf1.clear();
      this._inApf2.clear();
      this._inApf3.clear();
      this._inApf4.clear();

      this._apf1L.clear();
      this._delay1L.clear();
      this._filterL.clear();
      this._hpfL.clear();
      this._apf2L.clear();
      this._delay2L.clear();

      this._apf1R.clear();
      this._delay1R.clear();
      this._filterR.clear();
      this._hpfR.clear();
      this._apf2R.clear();
      this._delay2R.clear();

      this._inputDCBlockL.clear();
      this._outDCBlockL.clear();

      this._inputDCBlockR.clear();
      this._outDCBlockR.clear();
      
      this._sumL = 0.0;
      this._sumR = 0.0;
      this.outputL = 0.0;
      this.outputR = 0.0;
    }

    
    process() {
      this._decay = this.decay;

      this._inputDCBlockL.input = this.inputL;
      this._inputDCBlockR.input = this.inputR;

      this._inputLpf.input = this._inputDCBlockL.process() + this._inputDCBlockR.process();
      this._inputHpf.input = this._inputLpf.process();
      this._preDelay.input = this._inputHpf.process();
      this._inApf1.input = this._preDelay.process();
      this._inApf2.input = this._inApf1.process();
      this._inApf3.input = this._inApf2.process();
      this._inApf4.input = this._inApf3.process();
      this._tankFeed = this._preDelay.output * (1.0 - this.diffuseInput) + this._inApf4.process() * this.diffuseInput;
      this._sumL += this._tankFeed;
      this._sumR += this._tankFeed;

      this._apf1L.input = this._sumL;
      this._delay1L.input = this._apf1L.process();
      this._filterL.input = this._delay1L.process();
      this._hpfL.input = this._filterL.process();
      this._apf2L.input = (this._delay1L.output * (1.0 - this._fade) + this._hpfL.process() * this._fade) * this._decay;
      this._delay2L.input = this._apf2L.process();
      this._delay2L.process();

      this._apf1R.input = this._sumR;
      this._delay1R.input = this._apf1R.process();
      this._filterR.input = this._delay1R.process();
      this._hpfR.input = this._filterR.process();
      this._apf2R.input = (this._delay1R.output * (1.0 - this._fade) + this._hpfR.process() * this._fade) * this._decay;
      this._delay2R.input = this._apf2R.process();
      this._delay2R.process();

      this._sumL = this._delay2L.output * this._decay;
      this._sumR = this._delay2R.output * this._decay;

      this._outDCBlockL.input = this._apf1L.output;
      this._outDCBlockL.input += this._delay1L.tap(this._scaledTapsL[0]);
      this._outDCBlockL.input += this._delay1L.tap(this._scaledTapsL[1]);
      this._outDCBlockL.input -= this._apf2L.delay.tap(this._scaledTapsL[2]);
      this._outDCBlockL.input += this._delay2L.tap(this._scaledTapsL[3]);
      this._outDCBlockL.input -= this._delay1L.tap(this._scaledTapsL[4]);
      this._outDCBlockL.input -= this._apf2L.delay.tap(this._scaledTapsL[5]);
      this._outDCBlockL.input -= this._delay2L.tap(this._scaledTapsL[6]);

      this._outDCBlockR.input = this._apf1R.output;
      this._outDCBlockR.input += this._delay1R.tap(this._scaledTapsR[0]);
      this._outDCBlockR.input += this._delay1R.tap(this._scaledTapsR[1]);
      this._outDCBlockR.input -= this._apf2R.delay.tap(this._scaledTapsR[2]);
      this._outDCBlockR.input += this._delay2R.tap(this._scaledTapsR[3]);
      this._outDCBlockR.input -= this._delay1R.tap(this._scaledTapsR[4]);
      this._outDCBlockR.input -= this._apf2R.delay.tap(this._scaledTapsR[5]);
      this._outDCBlockR.input -= this._delay2R.tap(this._scaledTapsR[6]);

      this.outputL = this._outDCBlockL.process() * 0.5;
      this.outputR = this._outDCBlockR.process() * 0.5;

      this._fade += this._fadeStep * this._fadeDir;
      this._fade = (this._fade < 0.0) ? 0.0 : ((this._fade > 1.0) ? 1.0 : this._fade);
    }
};