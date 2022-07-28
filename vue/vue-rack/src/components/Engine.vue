<script lang="jsx">
import P5 from "../vue-p5/src/p5.vue"
import GraphicComponent from "./GraphicComponent.vue"
import { hp2y, Module, hp2x, InputEncoder, Port } from "../core/core"
import { shallowRef } from "vue"
import WireVue from "./Wire.vue"

export default {
  components: {
    P5, GraphicComponent
  },
  props: {
    engine: {
      type: Object,
    },
  },
  // computed: {
  //   cssProps () {
  //     return {
  //       '--width':  this.engine.w + "px",
  //       '--height': this.engine.h + "px",
  //       '--left': this.engine.x + "px",
  //       '--top': this.engine.y + "px"
  //     }
  //   }
  // },
  created() {
    this.audioContext = new AudioContext();
  },
  data() {
    return {
      module: null,
      moved: false,
      audioContext: null,
      children: [],
      cnv: null,
      cnv_wbf: null,
    }
  },
  render() {
    return(
      <div style={{position:"absolute"}} >
       
        <div style={{position:"absolute"}} >
          <P5 onSetup={this.setup} onDraw={this.draw} />
        </div>
        <div style={{position:"absolute"}}>
          {this.children.map((child) => {
            return <child.component graphicObject={child} id={Math.random() } />
          })}
          <button style={{position:"relative"}} onClick={this.addModule}>test</button>

          <WireVue class="wbf" style={{position:"absolute"}} engine={this.engine} />
        </div>
        
       
        {/*<div id="wbf" style={{position:"absolute"}}>
          <P5 onSetup={this.setup_wbf} onDraw={this.draw_wbf} />
        </div>*/}
      </div>
    )
  },
  methods: {
    debug() {
      console.log('ckicked')
    },
    kill(event) {
      event.stop;
    },
    draw_nothing(p5) {

    },
    addModule() {
      this.module = shallowRef(new Module({engine:this.engine, name:"kek", x:0, y:0, w:hp2x(10)}));
      this.module.add_input(new InputEncoder({x:hp2x(1), y:42, r:9, val: 0, vmin:-10, name:'CV', engine:this.module.engine}));
      this.module.add_output(new Port({x:hp2x(5.5), y:98, r:9, vmin:0, vmax:10, val:1, name:'OUT', engine:this.module.engine}));
      this.module.add_input(new InputEncoder({x:hp2x(5.5), y:42, r:9, val: 0, name:'FM', engine:this.module.engine}));
      this.module.add_input(new InputEncoder({x:hp2x(1), y:70, r:9, vmin:-10, val:0, name:'WAVE', engine:this.module.engine})); //-10 + rackrand() * 20, name:'WAVE'}));
      this.module.add_input(new InputEncoder({x:hp2x(5.5), y:70, r:9, vmin:0, vmax:1, val:0.5, name:'PW', engine:this.module.engine}));
      this.module.add_input(new InputEncoder({x:hp2x(1), y:98, r:9, vmin:0, vmax:1, val:1, name:'AMP', engine:this.module.engine}));
      //this.module.add_output(new Port({x:8, y:62, r:7, name:'PHASE_OUT', visible:false}));
      this.module.scale = this.engine.scale;
      this.children = shallowRef(this.engine.gchildren);
    },
    setup_wbf(p5) {
      this.cnv_wbf = p5.createCanvas(this.engine.w, this.engine.h);
      this.cnv_wbf.id("defaultCanvas1");
      p5.frameRate(this.engine.fps);
      p5.background(0,0,0,0);
      
      // p5.mousePressed = () => {return false};
      // p5.mouseDragged = () => {return false};
      // $(".defaultCanvas1").css("cursor", "not-allowed");
      document.getElementById("defaultCanvas1").addEventListener('click', (event) => {  
        event.preventDefault();  
        event.stopPropagation();
      });
      //p5.mouseClicked = (event) => {event.preventDefault();event.stopPropagation(); console.log(event.srcElement); return false};
      // p5.mouseReleased = () => {return false};

      // document.getElementById("wbf").addEventListener('click', (event) => {  
      //   event.preventDefault();  
      // });

      p5.noLoop();
      //document.getElementById("wbf").mouseclicked = null;
      // document.getElementById("wbf").mouseClicked(false);
      // document.getElementById("wbf").mouseDragged(false);
      // document.getElementById("wbf").mouseReleased(false);
      //this.cnv.mousePressed(false);
      // this.cnv.mouseClicked();
      // this.cnv.mouseReleased();
    },
    draw_wbf(p5) {
      p5.background(0,0,0,0);
      this.engine.wbf = p5.createGraphics(this.engine.w, this.engine.h);
      p5.clear();
      this.engine.wbf.scale(this.engine.scale)
      for (this.engine.i_draw = 0; this.engine.i_draw < this.engine.wires.length; this.engine.i_draw ++) 
        this.engine.wires[this.engine.i_draw].draw(this.engine.wbf, this.engine.x / this.engine.scale, this.engine.y / this.engine.scale);
      
      p5.image(this.engine.wbf, 0, 0, this.engine.w, this.engine.h)
    },

    draw(p5) {

      if (!this.engine.visible) return;
      if (this.engine.changed || this.engine.wbf_changed) {
        this.engine.draw_cbf(p5);
        p5.image(this.engine.cbf, 0, 0, this.engine.w, this.engine.h);
        this.engine.changed = false;
      }

      

      
    },
    setup(p5) {
      import("../modules/VCO").then((component) => {
        this.module = shallowRef(new component.default({engine:this.engine, name:"kek", x:0, y:0, w:hp2x(10)})); 
        this.children = shallowRef(this.engine.gchildren);
      });

      this.cnv = p5.createCanvas(this.engine.w, this.engine.h);
      this.cnv.id('mainCanvas')
      p5.frameRate(this.engine.fps);
      p5.background(0,0,0,0);

      
      p5.mousePressed = (event) => {
        if (p5.mouseX > this.engine.ax && p5.mouseX < this.engine.ax + this.engine.w && p5.mouseY > this.engine.ay && p5.mouseY < this.engine.ay + this.engine.h) {
          if (p5.mouseButton == p5.LEFT) {this.engine.mouse_pressed(p5.mouseX - this.engine.ax, p5.mouseY - this.engine.ay, p5.movedX, p5.movedY); this.audioContext.resume()};
          if (p5.mouseButton == p5.RIGHT) {
            let focus = this.engine.find_focus(p5.mouseX / this.engine.scale, p5.mouseY / this.engine.scale); 
            console.log('pros')
          };
        }
      }

      p5.mouseDragged = () => {
        this.engine.mouse_dragged(p5.mouseX - this.engine.ax, p5.mouseY - this.engine.ay, p5.movedX, p5.movedY);
      }

      p5.mouseReleased = () => {
        this.engine.mouse_released(p5.mouseX - this.engine.ax, p5.mouseY - this.engine.ay, p5.movedX, p5.movedY);
      }

      p5.doubleClicked = () => {
        this.engine.double_clicked(p5.mouseX - this.engine.ax, p5.mouseY - this.engine.ay, p5.movedX, p5.movedY);
      }

      p5.mouseWheel = (event) => {
        this.engine.set_offset(this.engine.x - event.deltaX / 5, 0);
      }

      p5.windowResized = () => {
        this.engine.set_size(document.documentElement.clientWidth, document.documentElement.clientHeight);
        p5.resizeCanvas(this.engine.w, this.engine.h);
        this.engine.changed = true;
      }

      p5.keyPressed = () => {
        if (p5.keyCode === 91) {
          this.engine.cmdpressed = true;
        }
        if (p5.keyCode === 83) {
          const a = document.createElement("a");
          a.href = URL.createObjectURL(new Blob([JSON.stringify(this.engine.save_state())], {
            type: "text/plain"
          }));
          a.setAttribute("download", "state.mrs");
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          // this.engine.save_state();
        }

        if (p5.keyCode === 76) {
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
                this.engine.load_state( JSON.parse(content) );
              }
          }
          input.click();
        }

        if (p5.keyCode === 67) {
          this.engine.clear_state();
        }

        if (p5.keyCode === 85) {
          this.engine.undo_last_action();
        }

        if (p5.keyCode === 8) {
          this.engine.delete_last_module();
        }

        if (p5.keyCode === 70) {
          document.body.requestFullscreen();
        }
      }

      p5.keyReleased = () => {
        if (p5.keyCode === 91) {
          this.engine.cmdpressed = false;
        }
      }

      p5.noLoop();

    },
  }
}
</script>

<style scoped>
.go{
  position: absolute;
  /* width: var(--width);
  height: var(--height);
  left: var(--left);
  top: var(--top); */
}

.wbf{
  cursor: not-allowed;
  pointer-events: none;
}
.eng{
  position: absolute;
  /* width: var(--width);
  height: var(--height);
  left: var(--left);
  top: var(--top); */
}
</style>