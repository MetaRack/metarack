ms = new ModuleStyle(panel=255, frame=60, shadow=70, name=40, lining=100, label=255, background=255);
ps = new PortStyle(hole=255, ring=80, text=100, istext=true);
ws = new WireStyle(core=255, edge=80);
engine.set_module_style(ms);
engine.set_port_style(ps);
engine.set_wire_style(ws);


// AUDIO

VCO0 = new VCO('VCO0', 1024);
VCO1 = new VCO('VCO1', 64 - 2/16);
VCO3 = new VCO('VCO3', 0.1);
SEQ1 = new Sequencer('SEQ1');
FLTR4 = new SimpleOnePoleFilter('FLTR4', 'LP', 10);
DLY1 = new Delay('DLY1');
SH1 = new SampleAndHold('SH1');
SH2 = new SampleAndHold('SH2');
VCO4 = new VCO('VCO4', 2);
VCO5 = new VCO('VCO5', 110);
VCO6 = new VCO('VCO6', 0.5);
SH3 = new SampleAndHold('SH3');
SCL1 = new Scale('SCL1');
VCO2 = new VCO('VCO2', 220);
ADSR1 = new ADSR('ADSR1');
VCA1 = new VCA('VCA1');
RVR1 = new DattorroReverb('RVR1');
MIX1 = new Mixer('MIX1');
NOIS1 = new Noise('NOIS1');
FLTR1 = new ResonantFilter('FLTR1', 'LP');
FLTR2 = new ResonantFilter('FLTR2', 'LP', 1900);
FLTR3 = new ResonantFilter('FLTR3', 'HP', 261.63);
VCO7 = new VCO('VCO7', 0.2);
BGATE1 = new BernoulliGate('BGT1');
FLTR5 = new ResonantFilter('FLTR5', 'LP', 400);

VCO5.i['WAVE'].set(-1);
VCO5.o['OUT'].connect(FLTR5.i['IN']);

BGATE1.i['P'].set(4);
BGATE1.o['OUT'].connect(SH3.i['GATE']);

RVR1.o['OUT'].connect(FLTR1.i['IN']);

FLTR1.i['RES'].set(1);
FLTR1.o['OUT'].connect(engine.OUT);

VCO3.o['OUT'].connect(FLTR1.i['FREQ'], 0.2, 2);

VCO0.i['WAVE'].set(-1);
VCO0.o['OUT'].connect(SEQ1.i['GATE']);

SEQ1.set_random_sequence(0);
SEQ1.o['OUT1'].connect(FLTR4.i['IN']);

FLTR4.o['OUT'].connect(DLY1.i['IN']);

DLY1.i['TIME'].set(-7.337);
DLY1.i['FB'].set(5);
DLY1.i['D/W'].set(0.5);
DLY1.o['OUT'].connect(SH1.i['IN']);

VCO1.i['WAVE'].set(-1);
VCO1.o['OUT'].connect(SH1.i['GATE']);

SH1.o['OUT'].connect(SH2.i['IN']);

VCO4.i['WAVE'].set(-1);
VCO4.o['OUT'].connect(BGATE1.i['IN']);
VCO4.o['OUT'].connect(SH2.i['GATE']);

ADSR1.i['A'].set(0.01);
ADSR1.i['D'].set(0.3);
ADSR1.i['S'].set(0.5);
ADSR1.i['R'].set(0.5);
ADSR1.o['OUT'].connect(VCA1.i['CV']);

SCL1.o['GATE'].connect(ADSR1.i['GATE']);
SCL1.o['1ST'].connect(VCO2.i['FM']);
SCL1.o['1ST'].connect(SH3.i['IN']);

SH3.o['OUT'].connect(VCO5.i['FM']);

SH2.o['OUT'].connect(SCL1.i['IN'], 0.2, 0);

VCO2.o['OUT'].connect(VCA1.i['IN']);

VCA1.o['OUT'].connect(MIX1.i['IN1']);
MIX1.o['OUT'].connect(RVR1.i['IN']);

FLTR5.i['RES'].set(1);
FLTR5.o['OUT'].connect(MIX1.i['IN3']);

MIX1.i['IN1_CV'].set(7);
MIX1.i['IN2_CV'].set(2);
MIX1.i['IN3_CV'].set(8);

FLTR3.i['RES'].set(0);
FLTR3.o['OUT'].connect(MIX1.i['IN2']);

VCO7.o['OUT'].connect(FLTR2.i['FREQ'], 0.2, 0);

NOIS1.o['OUT'].connect(FLTR2.i['IN']);

FLTR2.i['RES'].set(1);
FLTR2.o['OUT'].connect(FLTR3.i['IN']);


// VISUALS

engine.set_visuals_height(0.63);
engine.sequential_place_modules();
LND1 = new Landscape(0, 0, rackwidth, rackheight, 15);
VCO2.i['CV'].connect(LND1.boxes.i['SIZE']);
SCL1.o['GATE'].connect(LND1.i['BOX_GATE']);

DLYCTRL = engine.add_control('Delay', -7.28, 0.5, -7.50, -7.20, 0, 1, 'MELODY');
TMPCTRL = engine.add_control('Tempo', 0.5, 0.3, 0, 1, 0, 1, 'GLOBAL', 15);
PITCHCTRL = engine.add_control('Pitch', 0.4, 1, 0, 1, -2, 4, 'MELODY');
VARCTRL = engine.add_control('Variance', 5, -7.28, 0, 10, -7.30, -7.27, 'MELODY');
FLTRCTRL = engine.add_control('Filter', -1 + 0.3*(1 - 2*rackrand()), 1 + 0.5*(1 - 2*rackrand()), -2, 0, 0, 2.5, 'NOISE');
NOISEMIXCTRL = engine.add_control('Noise', 0.8 + 0.5*(1 - 2*rackrand()), 3 + (1 - 2*rackrand()), 0.1, 2, 0, 10, 'NOISE');

engine.patch_name = `Ambient Landscapes v1`;
engine.patch_description = `Audiovisual modular synthesizer`;
engine.patch_parameters = `Scale: ${SCL1.get_scale()}\nSeq: ${SEQ1.get_sequence(0)}`;
engine.controls_description = `space ~ start\nmouse ~ move stars\ne ~ toggle star drift (while pressing mouse)\nv ~ toggle view (better performance)\nr ~ reset stars`;
engine.copyright = `© ferluht, 2022`

function draw_background(x, y, scale) {

  LND1.draw(x, y);

  let delay_time = -7.337// + (1 - engine.my) * 0.1;
  let dw_cv = engine.mx * 20 - 10;
  engine.cursor_text = `Delay time CV: ${delay_time.toFixed(4)}\nDelay D/W CV: ${dw_cv.toFixed(2)}`;
  DLY1.i['TIME'].set(VARCTRL.get_y());

  VCO1.set_frequency(64 - (TMPCTRL.get_x() * 6) / 16);
  VCO4.set_frequency(TMPCTRL.get_x() * 6);

  SCL1.i['CV'].set(PITCHCTRL.get_y());

  VCO7.i['FM'].set(FLTRCTRL.get_x());
  VCO3.i['AMP'].set(NOISEMIXCTRL.get_x());
  FLTR1.i['RES'].set(FLTRCTRL.get_y());
  MIX1.i['IN2_CV'].set(NOISEMIXCTRL.get_y()); 

  FLTR4.i['FREQ'].set(VARCTRL.get_x())
}

engine.set_visuals_drawer(draw_background);


function keyPressed() {
  if (keyCode === 86) {
    engine.toggle_view();
  }
  if (keyCode === 69) {
    engine.toggle_random_movement();
  }
  if (keyCode === 82) {
    engine.reset_controls();
  }
}