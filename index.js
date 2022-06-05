ms = new ModuleStyle(panel=255, frame=60, shadow=70, name=40, lining=100, label=255, background=255);
ps = new PortStyle(hole=255, ring=80, text=100, istext=true);
ws = new WireStyle(core=255, edge=80);

// engine.set_size(rackwidth, rackheight);
engine.set_module_style(ms);
engine.set_port_style(ps);
engine.set_wire_style(ws);
engine.visible = true;

state_string = `{"modules":{"1":{"name":"Clock","i":{"BPM":{"val":"101.000000","mod":"0.100000"}},"c":{"DIV1":"2.000000","DIV2":"1.000000","DIV3":"1.000000"},"pos":[0,0]},"2":{"name":"ClockedRandomChords","i":{"A":{"val":"1.000000","mod":"0.503524"},"D":{"val":"2.763953","mod":"0.100000"},"S":{"val":"0.535661","mod":"0.100000"},"R":{"val":"30.000000","mod":"0.100000"},"P1":{"val":"0.500000","mod":"0.100000"},"P2":{"val":"0.700000","mod":"0.100000"},"P3":{"val":"0.500000","mod":"0.100000"},"SHPR":{"val":"0.389042","mod":"0.816885"},"SCL":{"val":"3.000000","mod":"0.100000"},"ROOT":{"val":"0.000000","mod":"0.689523"},"OFST":{"val":"-0.992562","mod":"0.100000"},"WDTH":{"val":"2.055667","mod":"0.100000"}},"c":{},"pos":[10,0]},"3":{"name":"DattorroReverb","i":{"SIZE":{"val":"0.576922","mod":"0.229884"}},"c":{"DEC":"0.835939","D/W":"0.497421"},"pos":[20,0]},"4":{"name":"Info","i":{},"c":{},"pos":[32,1]},"5":{"name":"VCO","i":{"CV":{"val":"-8.726098","mod":"0.100000"},"FM":{"val":"0.000000","mod":"0.100000"},"WAVE":{"val":"0.012791","mod":"0.442365"},"PW":{"val":"0.500000","mod":"0.100000"},"AMP":{"val":"1.000000","mod":"0.100000"}},"c":{},"pos":[23,0]},"6":{"name":"VCO","i":{"CV":{"val":"-9.104401","mod":"0.100000"},"FM":{"val":"0.000000","mod":"0.100000"},"WAVE":{"val":"0.012791","mod":"0.100000"},"PW":{"val":"0.500000","mod":"0.100000"},"AMP":{"val":"1.000000","mod":"0.100000"}},"c":{},"pos":[0,1]}},"wires":[{"a":{"mid":2,"pid":"OUT"},"b":{"mid":3,"pid":"I/R"}},{"a":{"mid":2,"pid":"OUT"},"b":{"mid":3,"pid":"I/L"}},{"a":{"mid":1,"pid":"CLK 1"},"b":{"mid":2,"pid":"GATE"}},{"a":{"mid":5,"pid":"OUT"},"b":{"mid":2,"pid":"SHPR"}},{"b":{"mid":5,"pid":"WAVE"},"a":{"mid":5,"pid":"OUT"}},{"b":{"mid":2,"pid":"A"},"a":{"mid":5,"pid":"OUT"}},{"a":{"mid":6,"pid":"OUT"},"b":{"mid":3,"pid":"SIZE"}},{"b":{"mid":6,"pid":"WAVE"},"a":{"mid":5,"pid":"OUT"}},{"a":{"mid":3,"pid":"O/R"},"b":{"mid":0,"pid":"RIGHT"}},{"a":{"mid":3,"pid":"O/L"},"b":{"mid":0,"pid":"LEFT"}}]}`
state = JSON.parse(state_string)
engine.load_state(state);

function drawrack(p) {
  p.setup = function () {
    let pw = p.canvas.parentElement.offsetWidth;
    let ph = p.canvas.parentElement.offsetHeight;
    var cnv = p.createCanvas(pw, ph);
    cnv.mousePressed(mouse_pressed);
    cnv.mouseMoved(mouse_dragged);
    cnv.mouseReleased(mouse_released);
    cnv.doubleClicked(double_clicked);
    cnv.mouseWheel(mouse_wheel);

    engine.set_size(pw, ph);
    p.frameRate(fps);
    p.background(0);
    console.log(pw, ph);
  }

  p.draw = function () {
    engine.draw(p, 0, 0);
  }

  p.windowResized = function () {
    engine.stop = true;
    let pw = p.canvas.parentElement.offsetWidth;
    let ph = p.canvas.parentElement.offsetHeight;
    p.resizeCanvas(pw, ph);
    engine.set_size(pw, ph);
    console.log(pw, ph);
    engine.stop = false;
  }

  function mouse_pressed(event) {
    if (p.mouseX > engine.ax && p.mouseX < engine.ax + engine.w && p.mouseY > engine.ay && p.mouseY < engine.ay + engine.h) {
      if (p.mouseButton == p.LEFT) engine.mouse_pressed(p.mouseX - engine.ax, p.mouseY - engine.ay, p.movedX, p.movedY);
      if (p.mouseButton == p.RIGHT) console.log('prop');
    }
  }

  function mouse_dragged() {
    engine.mouse_dragged(p.mouseX - engine.ax, p.mouseY - engine.ay, p.movedX, p.movedY);
  }

  function mouse_released() {
    engine.mouse_released(p.mouseX - engine.ax, p.mouseY - engine.ay, p.movedX, p.movedY);
  }

  function double_clicked() {
    engine.double_clicked(p.mouseX - engine.ax, p.mouseY - engine.ay, p.movedX, p.movedY);
  }

  function mouse_wheel(event) {
    engine.set_offset(engine.x - event.deltaX / 5, 0);
  }
}

new p5(drawrack, window.document.getElementById('synth'));


document.body.onkeydown = function(e){

  if(e.keyCode == 32){
    if(!audioContext) {
      engine_run();
    }
  }

  if(e.keyCode == 91){
    engine.cmdpressed = true;
  }

  if (e.keyCode === 83) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(engine.save_state())], {
      type: "text/plain"
    }));
    a.setAttribute("download", "state.mrs");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  if (e.keyCode === 76) {
    var input = document.createElement('input');
    input.type = 'file';
    input.onchange = e => { 
       // getting a hold of the file reference
       var file = e.target.files[0]; 

       // setting up the reader
       var reader = new FileReader();
       reader.readAsText(file,'UTF-8');

       // here we tell the reader what to do when it's done reading...
       reader.onload = readerEvent => {
          var content = readerEvent.target.result; // this is the content!
          engine.load_state( JSON.parse(content) );
       }
    }
    input.click();
  }

  if (e.keyCode === 67) {
    engine.clear_state();
  }

  if (e.keyCode === 85) {
    engine.undo_last_action();
  }

  if (e.keyCode === 8) {
    engine.delete_last_module();
  }

  if (e.keyCode === 70) {
    document.body.requestFullscreen();
  }
}

document.body.onkeyup = function(e){
  if (e.keyCode === 91) {
    engine.cmdpressed = false;
  }
}