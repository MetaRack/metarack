<script lang="jsx">
import P5 from "../vue-p5/src/p5.vue"
import { hp2y } from "../core/core"
import drag from "v-drag"

export default {
  components: {
    P5
  },
  props: {
    module: { type: Object, },
    scale: { type: Number }
  },
  render() {
    return(
      <div drag:x class = "go" style={this.cssProps}>
        <P5 onSetup={this.setup} onDraw={this.draw}/>
      </div>
    )
  },
  data() {
    return {
      buf : null,
      moved: false,
    }
  },
  // computed: {
  //   cssProps () {
  //     return {
  //       '--width':  this.module.w * this.module.scale + "px",
  //       '--height': this.module.h * this.module.scale + "px",
  //       '--left': this.module.x * this.module.scale + "px",
  //       '--top': this.module.y * this.module.scale + "px"
  //     }
  //   }
  // },
  // created() {

  // },
  // unmounted() {

  // },
  methods: {
    downListener() {
      this.moved = false
    },
    moveListener() {
      this.moved = true
    },
    upListener(event) {
      if (this.moved) {
        console.log([event.pageX, event.pageY])
      } else {
        console.log('not moved')
      }
    },
    draw(p5) {
      
      if (!this.module.visible) return;
      if (this.module.changed) {
        // this.module.x += 2;
        // this.module.y -= 2;
        this.module.scale = this.scale;
        p5.resizeCanvas(this.module.gparent.w, this.module.gparent.h);
        this.module.draw_cbf(p5, this.module.w * this.scale, this.module.h * this.scale);
        p5.image(this.module.cbf, this.module.x * this.scale, this.module.y * this.scale, this.module.w * this.module.scale, this.module.h * this.module.scale);
        this.module.changed = false;
      }
    },
    setup(p5) {
      
      //p5.background(0,0,0,0);
      p5.createCanvas(this.module.gparent.w, this.module.gparent.h);
      p5.frameRate(this.module.fps);
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
.p5{
  position: absolute;
  /* width: var(--width);
  height: var(--height);
  left: var(--left);
  top: var(--top); */
}
</style>