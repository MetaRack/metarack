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
        <div id={this.id} class = "go">
          <P5 onSetup={this.setup} onDraw={this.draw}/>
          {this.children.map((child) => {
            return <child.component graphicObject={child} id={Math.random()}/>
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
    }
  },
  methods: {
    draw_nothing(p5) {

    },
    draw(p5) {
      this.graphicObject.scale = this.graphicObject.gparent.scale;
      this.doc.style.width = (this.graphicObject.w) * this.graphicObject.scale + "px";
      this.doc.style.height = (this.graphicObject.h) * this.graphicObject.scale + "px";
      this.doc.style.left = (this.graphicObject.x) * this.graphicObject.scale + "px";
      this.doc.style.top = (this.graphicObject.y) * this.graphicObject.scale + "px";

      if (!this.graphicObject.visible) return;
      if (this.graphicObject.changed) {
        this.graphicObject.draw_cbf(p5, this.graphicObject.w * this.graphicObject.scale, this.graphicObject.h * this.graphicObject.scale);
        p5.image(this.graphicObject.cbf, 0, 0, this.graphicObject.w * this.graphicObject.scale, this.graphicObject.h * this.graphicObject.scale);
        this.graphicObject.changed = false;
      }
    },
    setup(p5) {
      this.children = shallowRef(this.graphicObject.gchildren);
      this.doc = document.getElementById(this.id);
      this.graphicObject.scale = this.graphicObject.gparent.scale;
      this.doc.style.left = (this.graphicObject.x) * this.graphicObject.scale + "px";
      this.doc.style.top = (this.graphicObject.y) * this.graphicObject.scale + "px";
     
      p5.createCanvas(this.graphicObject.w * this.graphicObject.scale, this.graphicObject.h * this.graphicObject.scale);
      p5.frameRate(this.graphicObject.fps);
      p5.mouseDragged = () => {
        p5.redraw();
        // this.doc.style.left = (this.graphicObject.x) * this.graphicObject.scale + "px";
        // this.doc.style.top = (this.graphicObject.y) * this.graphicObject.scale + "px";
      }

      p5.windowResized = () => {
        this.graphicObject.scale = this.graphicObject.gparent.scale;
        this.doc.style.width = (this.graphicObject.w) * this.graphicObject.scale + "px";
        this.doc.style.height = (this.graphicObject.h) * this.graphicObject.scale + "px";
        this.doc.style.left = (this.graphicObject.x) * this.graphicObject.scale + "px";
        this.doc.style.top = (this.graphicObject.y) * this.graphicObject.scale + "px";
        this.graphicObject.changed = true;
        p5.resizeCanvas(this.graphicObject.w * this.graphicObject.scale, this.graphicObject.h * this.graphicObject.scale);
        
      }
    },
  }
}
</script>

<style scoped>
.go{
  position: absolute;
}
</style>