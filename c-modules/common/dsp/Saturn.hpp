#pragma once

class Saturn {
public:

  double fold = 1;
  double sat = 1;
  double in = 0;
  double out = 0;


  Saturn() {
    
  } 

  double sigmoid(double x) {
      if (abs(x) < 1)
        return x * (1.5 - 0.5 * x * x);
      else 
        return 1 * sign(x);
  }

  double saturate(double x, double t) {
    if (abs(x)<t)
          return x;
      else
      {
          if (x > 0)
              return t + (1-t)*sigmoid((x-t)/((1-t)*1.5));
          else
              return -(t + (1-t)*sigmoid((-x-t)/((1-t)*1.5)));
      }
  }

  double sign(double x) {
    if (x < 0) {
      return -1;
    }
    else if (x > 0) {
      return 1;
    }
    else return 0;
  }

  void process() {
    out = in * (fold + 1);

    while (out > 1) {
      out = (out - 1) * -1;
      out += 1;
      while (out < 0) out *= -1;
    }
    while (out < -1) {
      out = (out + 1) * -1;
      out -= 1;
      while (out > 0) out *= -1;
    }

    out = out * sat;
    if (sat > 1)
    out = saturate(out, 0);
  }
};

