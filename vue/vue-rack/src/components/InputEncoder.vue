<script lang="jsx">
import P5 from "../vue-p5/src/p5.vue"
import { hp2y } from "../core/core"
import { shallowRef } from "vue"

export default {
  components: {
    P5
  },
  props: {
    graphicObject: { type: Object, },
    id: { type: Number }
  },
  render() {
    return(
      
       <div id={this.id} style={{position:"absolute"}}>
          <P5 onSetup={this.setup} onDraw={this.draw}  />
         
          {this.children.map((child) => {
            return <child.component graphicObject={child} id={Math.random()} />
          })}
        </div>
    )
  },
  data() {
    return {
      buf : null,
      pickedUp: false,
      startX: 0,
      startY: 0,
      children: shallowRef(this.graphicObject.gchildren),
      doc: document.getElementById(this.id),
      cnv: null,
    };
  },
  methods: {
    debug() {
      console.log(this.cnv)
    },
    draw(p5) {
      this.graphicObject.scale = this.graphicObject.gparent.scale;
      this.doc.style.width = (this.graphicObject.w) * this.graphicObject.scale + "px";
      this.doc.style.height = (this.graphicObject.h) * this.graphicObject.scale + "px";
      this.doc.style.left = (this.graphicObject.x) * this.graphicObject.scale + "px";
      this.doc.style.top = (this.graphicObject.y) * this.graphicObject.scale + "px";

      if (this.graphicObject.draw_dbf)
        this.graphicObject.draw_dbf();

      if (!this.graphicObject.visible) return;
      
      if (this.graphicObject.changed) {
        if (this.graphicObject.draw_cbf) {
          this.graphicObject.draw_cbf(p5, this.graphicObject.w * this.graphicObject.scale, this.graphicObject.h * this.graphicObject.scale);
          p5.image(this.graphicObject.cbf, 0, 0, this.graphicObject.w * this.graphicObject.scale, this.graphicObject.h * this.graphicObject.scale);
        }

        if (this.graphicObject.draw_sbf) {
          this.graphicObject.draw_sbf(p5, this.graphicObject.w * this.graphicObject.scale, this.graphicObject.h * this.graphicObject.scale);
          p5.image(this.graphicObject.sbf, 0, 0, this.graphicObject.w * this.graphicObject.scale, this.graphicObject.h * this.graphicObject.scale);
        }
        this.graphicObject.changed = false;
      }
    },
    setup(p5) {
      this.children = shallowRef(this.graphicObject.gchildren);
      this.graphicObject.scale = this.graphicObject.gparent.scale;
      this.doc = document.getElementById(this.id);
      // this.doc.onclick=this.debug

      this.doc.style.left = (this.graphicObject.x) * this.graphicObject.scale + "px";
      this.doc.style.top = (this.graphicObject.y) * this.graphicObject.scale + "px";

      this.cnv = p5.createCanvas(this.graphicObject.w * this.graphicObject.scale, this.graphicObject.h * this.graphicObject.scale);
      p5.frameRate(this.graphicObject.fps);

      p5.windowResized = () => {
          this.graphicObject.changed = true;
          p5.resizeCanvas(this.graphicObject.w * this.graphicObject.scale * 2, this.graphicObject.h * this.graphicObject.scale * 2);
      }

      this.cnv.mousePressed(() => {
          this.pickedUp = true;
          //console.log('clicked')
        // p5.mouseDragged = () => {
          // this.doc.style.left = (this.graphicObject.x) * this.graphicObject.scale + "px";
          // this.doc.style.top = (this.graphicObject.y) * this.graphicObject.scale + "px";
          if (this.graphicObject.mouse_dragged) {
            p5.loop();
          }
        //}
      });

      p5.mouseReleased = (event) => {
        //console.log(event.srcElement)
        p5.noLoop();
        if (this.graphicObject.mouse_released) {
          //p5.redraw();
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
}
</style>