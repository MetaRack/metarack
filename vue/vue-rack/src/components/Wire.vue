<script lang="jsx">
import VueP5 from "../vue-p5/src/p5.vue"
import { hp2y } from "../core/core"
import { shallowRef } from "vue"

export default {
  components: {
    VueP5
  },
  props: {
    engine: { type: Object, },
  },
  render() {
    return(
      
       <div id="wbf" style={{position:"absolute"}}>
          <VueP5 onSetup={this.setup_wbf} onDraw={this.draw_wbf} />
        </div>
    )
  },
  data() {
    return {
      doc: document.getElementById(this.id),
      cnv: null,
    };
  },
  methods: {
    debug() {
      console.log(this.cnv)
    },
    setup_wbf(p5) {
      this.cnv_wbf = p5.createCanvas(this.engine.w, this.engine.h);
      this.cnv_wbf.id("defaultCanvas3000");
      p5.frameRate(this.engine.fps);
      p5.background(0,0,0,0);
      //this.cnv_wbf.parent('mainCanvas');
      //p5.fill(255);
      //p5.rect(0, 0, 100, 100)
      //this.cnv_wbf.mousePressed(() =>{console.log('kwk')})
      // p5.mousePressed = () => {return false};
      // p5.mouseDragged = () => {return false};
      // p5.mouseClicked = () => {return false}
      // $(".defaultCanvas1").css("cursor", "not-allowed");
      // document.getElementById("defaultCanvas3000").addEventListener('click', (event) => {  
      //   event.preventDefault();  
      //   event.stopPropagation();
      // });
      //p5.mouseClicked = (event) => {console.log(event.srcElement);};
      // p5.mouseReleased = () => {return false};

      // document.getElementById("wbf").addEventListener('click', (event) => {  
      //   event.preventDefault();  
      // });

      //p5.noLoop();
      //document.getElementById("wbf").mouseclicked = null;
      // document.getElementById("wbf").mouseClicked(false);
      // document.getElementById("wbf").mouseDragged(false);
      // document.getElementById("wbf").mouseReleased(false);
      //this.cnv.mousePressed(false);
      // this.cnv.mouseClicked();
      // this.cnv.mouseReleased();
    },
    draw_wbf(p5) {
      //p5.rect(0, 0, 100, 100)
      // p5.background(0,0,0,0);
      // this.engine.wbf = p5.createGraphics(this.engine.w, this.engine.h);
      // p5.clear();
      // this.engine.wbf.scale(this.engine.scale)
      // for (this.engine.i_draw = 0; this.engine.i_draw < this.engine.wires.length; this.engine.i_draw ++) 
      //   this.engine.wires[this.engine.i_draw].draw(this.engine.wbf, this.engine.x / this.engine.scale, this.engine.y / this.engine.scale);
      
      // p5.image(this.engine.wbf, 0, 0, this.engine.w, this.engine.h)
    },
  },
}
</script>

<style scoped>
.go{
  position: absolute;
}
.wbf{
  cursor: not-allowed;
  pointer-events: none;
}
</style>