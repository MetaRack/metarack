#pragma once

class ADSR {
  public:

  double phase = 0;
  char stage = 'R';
  double switch_level = 0;

  double gate = 0;
  double out = 0;
  double prev_a = 0.1;

  double A = 0.1;
  double D = 0.1;
  double S = 0.1;
  double R = 30;


  ADSR() {

  } 

  void set_param (double a, double d, double s, double r) {
    A = a + 0.1;
    D = d + 0.1;
    S = s + 0.000001;
    R = r + 0.1;
   }

  void process() {
    double env = 0;
    double lin = 0;
    double sqr = 0;

    if (prev_a < 0.1) prev_a = 0.1;
    if (D < 0.1) D = 0.1;
    if (S < 0.000001) S = 0.000001;
    if (R < 0.1) R = 0.1;

    if (gate > 0) {
      switch(stage) {
        case 'R':
          stage = 'A';
          phase = pow(out / 10, 2) * prev_a;
        case 'A':
          env = sqrt(phase / prev_a);
          if (env >= 1) {
            //console.log('A->D');
            stage = 'D';
            switch_level = env;
          }
          break;
        case 'D':
          sqr = S + (switch_level - sqrt((phase - prev_a) / D)) * (switch_level - S);
          lin = (phase - prev_a) / D;
          env = sqr; //(1 - lin) * switch_level + lin * sqr;
          if (env <= S) stage = 'S';
          break;
        case 'S':
          env = out / 10;
          break;

      }
    } else {
      prev_a = A;
      switch (stage) {
        case 'A':
          stage = 'R';
          phase = 0.001;
          switch_level = out / 10;
        case 'D':
          stage = 'R';
          phase = 0.001;
          switch_level = out / 10;
        case 'S':
          stage = 'R';
          phase = 0.001;
          switch_level = out / 10;
        case 'R':
          env = (1 - sqrt(phase / R)) * switch_level;
          if (env <= 0) env = 0;
          break;
      }
    }

    out = fmin(env * 10, 10);
    phase += 0.001;
  }
};

