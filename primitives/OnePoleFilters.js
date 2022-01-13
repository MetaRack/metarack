_1_FACT_2 = 0.5;
_1_FACT_3 = 0.1666666667;
_1_FACT_4 = 0.04166666667;
_1_FACT_5 = 0.008333333333;
_2M_PI = 2.0 * Math.PI;

let fastexp_xx, fastexp_x3, fastexp_x4, fastexp_x5;
function fastexp(x) {
    fastexp_xx = x * x;
    fastexp_x3 = x * fastexp_xx;
    fastexp_x4 = fastexp_xx * fastexp_xx;
    fastexp_x5 = fastexp_x4 * x;
    x = 1 + x + (fastexp_xx * _1_FACT_2) + (fastexp_x3 * _1_FACT_3) + (fastexp_x4 * _1_FACT_4);
    return x + (fastexp_x5 * _1_FACT_5);
}

class OnePoleLPFilter {

    constructor(cutoffFreq = sample_rate / 2 - 1, initSampleRate = sample_rate) {
      this.input = 0.0;
      this.output = 0.0;
      this._sampleRate = sample_rate;
      this._1_sampleRate = 1.0 / sample_rate;
      this._cutoffFreq = cutoffFreq;
      this._maxCutoffFreq = sample_rate / 2;
      this._b = Math.exp(-2 * Math.PI * this._cutoffFreq * this._1_sampleRate);
      this._a = 1.0 - this._b;
      this._z = 0.0;

      // this.setSampleRate(initSampleRate);
      // this.setCutoffFreq(cutoffFreq);
    }

    clear() {
      this.input = 0.0;
      this._z = 0.0;
      this.output = 0.0;
    }
    
    setCutoffFreq(cutoffFreq) {
      if (cutoffFreq == this._cutoffFreq) {
        return;
      }

      this._cutoffFreq = cutoffFreq;
      this._b = Math.exp(-2 * Math.PI * this._cutoffFreq * this._1_sampleRate);
      this._a = 1.0 - this._b;
    }
    
    setSampleRate(sampleRate) {
      this._sampleRate = sampleRate;
      this._1_sampleRate = 1.0 / sampleRate;
      this._maxCutoffFreq = sampleRate / 2.0 - 1.0;
      this.clear();
    }

    getMaxCutoffFreq() {
      return this._maxCutoffFreq;
    }
    
    process() {
      this._z = this._a * this.input + this._z * this._b;
      this.output = this._z;
      return this.output;
    }
};



class OnePoleHPFilter {

    constructor(cutoffFreq = 10, initSampleRate = sample_rate) {
      this.input = 0.0;
      this.output = 0.0;
      this._sampleRate = sample_rate;
      this._1_sampleRate = 1.0 / sample_rate;
      this._cutoffFreq = cutoffFreq;
      this._y0 = 0.0;
      this._y1 = 0.0;
      this._x0 = 0.0;
      this._x1 = 0.0;
      this._b1 = Math.exp(- 2 * Math.PI * this._cutoffFreq * this._1_sampleRate);
      this._a0 = (1.0 + this._b1) / 2.0;
      this._a1 = -this._a0;

      // this.setCutoffFreq(cutoffFreq);
    }

    clear() {
      this.input = 0.0;
      this.output = 0.0;
      this._x0 = 0.0;
      this._x1 = 0.0;
      this._y0 = 0.0;
      this._y1 = 0.0;
    }
    
    setCutoffFreq(cutoffFreq) {
      if (cutoffFreq == this._cutoffFreq) {
        return;
      }

      this._cutoffFreq = cutoffFreq;
      this._b1 = Math.exp(- 2 * Math.PI * this._cutoffFreq * this._1_sampleRate);
      this._a0 = (1.0 + this._b1) / 2.0;
      this._a1 = -this._a0;
    }
    
    setSampleRate(sampleRate) {
      this._sampleRate = sampleRate;
      this._1_sampleRate = 1.0 / sampleRate;
      this.clear();
    }
    
    process() {
      this._x0 = this.input;
      this._y0 = this._a0 * this._x0 + this._a1 * this._x1 + this._b1 * this._y1;
      this._y1 = this._y0;
      this._x1 = this._x0;
      this.output = this._y0;
      return this.output;
    }
};



class DCBlocker {

    constructor(cutoffFreq = 20, initSampleRate = sample_rate) {
      this.input = 0.0;
      this.output = 0.0;
      this._sampleRate = 0.0;
      this._cutoffFreq = 0.0;
      this._maxCutoffFreq = 0.0;
      this._b = 0.0;
      this._z = 0.0;

      this.setSampleRate(initSampleRate);
      this.setCutoffFreq(cutoffFreq);
      this.clear();
    }

    clear() {
      this.input = 0.0;
      this.output = 0.0;
      this._z = 0.0;
    }
    
    setCutoffFreq(cutoffFreq) {
      this._cutoffFreq = cutoffFreq;
      this._b = 0.999;
    }
    
    setSampleRate(sampleRate) {
      this._sampleRate = sampleRate;
      this._maxCutoffFreq = sampleRate / 2;
      this.setCutoffFreq(this._cutoffFreq);
      this.clear();
    }

    getMaxCutoffFreq() {
      return this._maxCutoffFreq;
    }
    
    process() {
      this.output = this.input - this._z + this._b * this.output;
      this._z = this.input;
      return this.output;
    }
};

