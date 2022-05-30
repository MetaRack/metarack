class OneSampleDelay {
public:

  double in = 0;
  double prevIn = 0;
  double out = 0;

  OneSampleDelay() {

  }

  void process() {
    out = prevIn;
    prevIn = in;
  }
};
