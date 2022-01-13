class Control {
  constructor(name, def_x, def_y, min_x, max_x, min_y, max_y, w, h, radius) {
    this.name = name;
    this.x = 0;
    this.y = 0;
    this.width = w;
    this.height = h;
    this.scale_x = max_x - min_x;
    this.offset_x = min_x;
    this.scale_y = max_y - min_y;
    this.offset_y = min_y;

    this.radius = radius;

    this.text = name;

    this.def_x = def_x;
    this.def_y = def_y;

    this.reset();

    this.ax = 0;
    this.ay = 0;

    this.visible = true;

    this.scale = -1;

    this.enable_random_movement = false;
    this.mov_vec = [2 - 4 * rackrand(), 2 - 4 * rackrand()];
    this.next_mov_vec = [0, 0];
    this.mov_speed = 0;
    this.vec_mix = 0;
    this.bound_vec_mix = 0;
    this.r_norm = 0;
    this.mov_scale = 0;
    this.random_movement();
  }

  reset() {
    this.x = (this.def_x - this.offset_x) / this.scale_x * this.width;
    this.y = this.height - (this.def_y - this.offset_y) / this.scale_y * this.height;
    this.set_position(this.x, this.y);
  }

  get_x() {
    return this.val_x;
  }

  get_y() {
    return this.val_y;
  }

  set_position(x, y) {
    this.x = x;
    this.y = y;
    if (this.y < 10) this.y = 10;
    if (this.y > this.height - 10) this.y = this.height - 10;
    if (this.x < 10) this.x = 10;
    if (this.x > this.width - 10) this.x = this.width - 10;
    this.val_x = this.x / this.width * this.scale_x + this.offset_x;
    this.val_y = (1 - this.y / this.height) * this.scale_y + this.offset_y;
  }

  get_position() {
    return [this.x, this.y];
  }

  toggle_random_movement() {
    this.enable_random_movement = !this.enable_random_movement;
  }

  next_movement_vector() {
    this.r_norm = Math.sqrt(Math.pow(this.width / 2 - this.x, 2) + Math.pow(this.height / 2 - this.y, 2));
    this.mov_scale = Math.min(this.width, this.height) / 3 * this.mov_speed;
    this.bound_vec_mix = this.r_norm / Math.min(this.width, this.height) * 2;
    this.bound_vec_mix = Math.pow(this.bound_vec_mix, 2);
    this.mov_vec[0] = this.next_mov_vec[0];
    this.mov_vec[1] = this.next_mov_vec[1];
    this.next_mov_vec = [this.bound_vec_mix * (this.width / 2 - this.x) / this.r_norm + (1 - this.bound_vec_mix) * (1 - 2 * rackrand()),
                         this.bound_vec_mix * (this.height / 2 - this.y) / this.r_norm + (1 - this.bound_vec_mix) * (1 - 2 * rackrand())];
    this.vec_mix = 1;
  }

  random_movement(speed = 0.000001) {
    this.mov_speed = speed;
    this.vec_mix = 1;
    this.next_movement_vector();
  }

  check_mouse(x, y) {
    if (Math.sqrt( Math.pow(x - this.ax, 2) + Math.pow(y - this.ay, 2) ) < 10) return true;
    return false;
  }

  draw(x, y) {
    this.set_position(this.x, this.y);

    this.ax = x + this.x;
    this.ay = y + this.y;

    this.val_x = this.x / this.width * this.scale_x + this.offset_x;
    this.val_y = (1 - this.y / this.height) * this.scale_y + this.offset_y;

    strokeWeight(0.5); stroke(70);
    strokeWeight(1); fill(255);
    ellipse(this.ax, Math.min(this.ay, this.height + y - 6), this.radius, this.radius);
    if (this.enable_random_movement) ellipse(this.ax, Math.min(this.ay, this.height + y - 6), 3, 3);

    textSize(15);
    fill(255 - visuals_background_color);
    textAlign(LEFT, CENTER);
    strokeWeight(0.3);
    text(this.text, this.ax + 10, Math.min(this.ay, this.height + y) + 20);
  }

  process() {
    if (this.enable_random_movement) {
      this.x = (this.mov_vec[0] * this.vec_mix + this.next_mov_vec[0] * (1 - this.vec_mix)) * this.mov_scale + this.x;
      this.y = (this.mov_vec[1] * this.vec_mix + this.next_mov_vec[1] * (1 - this.vec_mix)) * this.mov_scale + this.y;
      this.vec_mix -= this.mov_speed;
      if (this.vec_mix < 0.01) {
        this.next_movement_vector();
      }
    }
  }
}