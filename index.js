ms = new ModuleStyle(panel=255, frame=60, shadow=70, name=40, lining=100, label=255, background=255);
ps = new PortStyle(hole=255, ring=80, text=100, istext=true);
ws = new WireStyle(core=255, edge=80);


//engine = new Engine({w:rackwidth * 0.8, h:rackheight / 2});
engine.set_size(rackwidth, rackheight);
engine.set_module_style(ms);
engine.set_port_style(ps);
engine.set_wire_style(ws);
engine.visible = true;

// AUDIO
// n = 2;
// VCOs = [];
// for (var i = 0; i < n; i ++) {
// 	VCOs.push(new VCO(261));
// }

// ADSR1 = new ADSR();

// VCA1 = new VCA();

// DLY1 = new Delay();

// FLTR1 = new ResonantFilter('LP');

// RVR1 = new DattorroReverb();
// RVR2 = new DattorroReverb();

// for (var i = 1; i < n; i ++) {
// 	if (rackrand() > 0.2) VCOs[i - 1].o['OUT'].connect(VCOs[i].i['CV']);
// }

function expr(t, c, p1, p2, p3, p4) {
  return (((t / c) / 2 % (p1 * 13)) + 3) * 2 + (((t / c) / 4 % (p2 * 19)) >> (p3 * 3) + 1)  | (((t / c) ^ (p4) * 11))
}

function expr2(t, c, p1, p2, p3, p4) {
  return (t / c) / (2 + p3) * (((t / c) >> (7 + p2)) % 5)
}

S = new SVCO(261);
D = new Delay();
P = new PingPong();
MIX1 = new RandomGenerator();
CLKD = new Clock(120);
K = new Kick();
BG = new BernoulliGate();
B1 = new ByteBeat(expr);
FL = new ExponentialFilter(1000);
FL2 = new ExponentialFilter(1000);
MIX2 = new Bus();
MIX3 = new Bus();
SAT = new Saturn();
SAT2 = new Saturn();
SCL = new Scale();
// B2 = new ByteBeat(expr2);
// FL = new ExponentialFilter(1000);
// D = new Delay();
// MIX1 = new RandomGenerator();
// RVR1 = new DattorroReverb();
// C = new Chorus();
// BS = new Bus();
// cf = new CombFilter()

// BG = new BernoulliGate();
// BR = new Burst();
// JNO = new NonlinearLab();
// D1 = new Delay();
// D2 = new Delay();
// MIX2 = new Bus();
// MIX3 = new Bus();
// MIX4 = new Bus();

//GOOD BASS//
// CLKD = new Clock(120);
// JNO = new NonlinearLab();
// NOIS = new Noise();
// SH = new SampleAndHold();
// QNT1 = new Scale();
// OCT = new Offset();
// Fil = new SVF();
// Fil2 = new SVF();
// MIX1 = new Mixer();
// SAT = new Saturn();
// FL = new ExponentialFilter(1000);
// C = new Chorus();
// AD = new ADSR();
// VCA1 = new VCA();
// FL2 = new ExponentialFilter(1000);
// BG = new BernoulliGate();
//GOOD BASS//

//PLUCK SOUND
// CLKD = new Clock(120);
// JNO = new NonlinearLab();
// NOIS = new Noise();
// SH = new SampleAndHold();
// QNT1 = new Scale();
// OCT = new Offset();
// ST = new Saturn();
// MIX1 = new Bus();
// FL = new ExponentialFilter(1000);
// C = new Chorus();
// AD = new ADSR();
// VCA1 = new VCA();
//PLUCK SOUND



// n = 2 + Math.floor(rackrand() * 6);
// for(var i = 0; i < n; i ++) {
//   let j = Math.floor(rackrand() * 6);

//   switch (j) {
//     case 0: 
//       new VCO(261);
//       break;
//     case 1:
//       new ADSR(261);
//       break;
//     case 2:
//       new VCA();
//       break;
//     case 3:
//       new ResonantFilter('LP');
//       break;
//     case 4:
//       new DattorroReverb();
//       break;
//     case 5:
//       new Delay();
//       break;
//   }
// }
console.log(engine);
engine.sequential_place_modules();

// for (var i = 0; i < n; i ++) {
// 	VCOs[i].o['OUT'].connect(MIX.i['IN' + i.toString()]);
// }
// VCO0.o['OUT'].connect(VCO0.i['CV']);
// VCO1 = new VCO(64 - 2/16);
// VCO1.o['OUT'].connect(VCO0.i['CV']);

// MIX.o['OUT'].connect(engine.OUT);

// VCO3 = new VCO('VCO3', 0.1);
// SEQ1 = new Sequencer('SEQ1');
// FLTR4 = new SimpleOnePoleFilter('FLTR4', 'LP', 10);
// DLY1 = new Delay('DLY1');
// SH1 = new SampleAndHold('SH1');
// SH2 = new SampleAndHold('SH2');
// VCO4 = new VCO('VCO4', 2);
// VCO5 = new VCO('VCO5', 110);
// VCO6 = new VCO('VCO6', 0.5);
// SH3 = new SampleAndHold('SH3');
// SCL1 = new Scale('SCL1');
// VCO2 = new VCO('VCO2', 220);

// VCA1 = new VCA('VCA1');
// RVR1 = new DattorroReverb('RVR1');
// MIX1 = new Mixer('MIX1');
// NOIS1 = new Noise('NOIS1');
// FLTR1 = new ResonantFilter('FLTR1', 'LP');
// FLTR2 = new ResonantFilter('FLTR2', 'LP', 1900);
// FLTR3 = new ResonantFilter('FLTR3', 'HP', 261.63);
// VCO7 = new VCO('VCO7', 0.2);
// BGATE1 = new BernoulliGate('BGT1');
// FLTR5 = new ResonantFilter('FLTR5', 'LP', 400);


function setup() {
  createCanvas(rackwidth, rackheight);
  frameRate(fps);
}

function draw() { 
	background(0,0,0,0);
  engine.draw(0, 0); 
}

// VCO5.i['WAVE'].set(-1);
// VCO5.o['OUT'].connect(FLTR5.i['IN']);

// BGATE1.i['P'].set(4);
// BGATE1.o['OUT'].connect(SH3.i['GATE']);

// RVR1.o['OUT'].connect(FLTR1.i['IN']);

// FLTR1.i['RES'].set(1);
// FLTR1.o['OUT'].connect(engine.OUT);

// VCO3.o['OUT'].connect(FLTR1.i['FREQ'], 0.2, 2);

// VCO0.i['WAVE'].set(-1);
// VCO0.o['OUT'].connect(SEQ1.i['GATE']);

// SEQ1.set_random_sequence(0);
// SEQ1.o['OUT1'].connect(FLTR4.i['IN']);

// FLTR4.o['OUT'].connect(DLY1.i['IN']);

// DLY1.i['TIME'].set(-7.337);
// DLY1.i['FB'].set(5);
// DLY1.i['D/W'].set(0.5);
// DLY1.o['OUT'].connect(SH1.i['IN']);

// VCO1.i['WAVE'].set(-1);
// VCO1.o['OUT'].connect(SH1.i['GATE']);

// SH1.o['OUT'].connect(SH2.i['IN']);

// VCO4.i['WAVE'].set(-1);
// VCO4.o['OUT'].connect(BGATE1.i['IN']);
// VCO4.o['OUT'].connect(SH2.i['GATE']);

// ADSR1.i['A'].set(0.01);
// ADSR1.i['D'].set(0.3);
// ADSR1.i['S'].set(0.5);
// ADSR1.i['R'].set(0.5);
// ADSR1.o['OUT'].connect(VCA1.i['CV']);

// SCL1.o['GATE'].connect(ADSR1.i['GATE']);
// SCL1.o['1ST'].connect(VCO2.i['FM']);
// SCL1.o['1ST'].connect(SH3.i['IN']);

// SH3.o['OUT'].connect(VCO5.i['FM']);

// SH2.o['OUT'].connect(SCL1.i['IN'], 0.2, 0);

// VCO2.o['OUT'].connect(VCA1.i['IN']);

// VCA1.o['OUT'].connect(MIX1.i['IN1']);
// MIX1.o['OUT'].connect(RVR1.i['IN']);

// FLTR5.i['RES'].set(1);
// FLTR5.o['OUT'].connect(MIX1.i['IN3']);

// MIX1.i['IN1_CV'].set(7);
// MIX1.i['IN2_CV'].set(2);
// MIX1.i['IN3_CV'].set(8);

// FLTR3.i['RES'].set(0);
// FLTR3.o['OUT'].connect(MIX1.i['IN2']);

// VCO7.o['OUT'].connect(FLTR2.i['FREQ'], 0.2, 0);

// NOIS1.o['OUT'].connect(FLTR2.i['IN']);

// FLTR2.i['RES'].set(1);
// FLTR2.o['OUT'].connect(FLTR3.i['IN']);