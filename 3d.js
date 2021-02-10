let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

function clear() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

class v {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  s2() {
    return `[x: ${this.x}, y: ${this.y}]`;
  }
}

class Triangle {
  constructor(v1, v2, v3) {
    this.t = [v1, v2, v3];
    this.v1 = v1;
    this.v2 = v2;
    this.v3 = v3;
  }
  draw() {
    context.beginPath();
    context.fillStyle = 'black';
    context.moveTo(this.v1.x, this.v1.y);
    context.lineTo(this.v2.x, this.v2.y);
    context.lineTo(this.v3.x, this.v3.y);
    context.closePath();
    context.stroke();
  }
}

class mesh {
  constructor() {
    this.m = [];
  }
  draw() {
    for (let t of this.m) {
      t.draw();
    }
  }
  draw_projected(m, mat_rot_z, mat_rot_x) {
    for (let triangle of this.m) {
      const t_rotated_z = new Triangle(
        multiply_matrix_vector(triangle.v1, mat_rot_z),
        multiply_matrix_vector(triangle.v2, mat_rot_z),
        multiply_matrix_vector(triangle.v3, mat_rot_z),
      );
      const t_rotated_x = new Triangle(
        multiply_matrix_vector(t_rotated_z.v1, mat_rot_x),
        multiply_matrix_vector(t_rotated_z.v2, mat_rot_x),
        multiply_matrix_vector(t_rotated_z.v3, mat_rot_x),
      );
      const t_translated = new Triangle(
        new v(t_rotated_x.v1.x, t_rotated_x.v1.y, t_rotated_x.v1.z + 3.0),
        new v(t_rotated_x.v2.x, t_rotated_x.v2.y, t_rotated_x.v2.z + 3.0),
        new v(t_rotated_x.v3.x, t_rotated_x.v3.y, t_rotated_x.v3.z + 3.0),
      );
      const t_projected = new Triangle(
        multiply_matrix_vector(t_translated.v1, m),
        multiply_matrix_vector(t_translated.v2, m),
        multiply_matrix_vector(t_translated.v3, m),
      );
      t_projected.v1.x += 1.0;
      t_projected.v1.y += 1.0;
      t_projected.v2.x += 1.0;
      t_projected.v2.y += 1.0;
      t_projected.v3.x += 1.0;
      t_projected.v3.y += 1.0;

      t_projected.v1.x *= 0.5 * width;
      t_projected.v1.y *= 0.5 * height;
      t_projected.v2.x *= 0.5 * width;
      t_projected.v2.y *= 0.5 * height;
      t_projected.v3.x *= 0.5 * width;
      t_projected.v3.y *= 0.5 * height;

      t_projected.v1.x = Math.round(t_projected.v1.x);
      t_projected.v1.y = Math.round(t_projected.v1.y);
      t_projected.v2.x = Math.round(t_projected.v2.x);
      t_projected.v2.y = Math.round(t_projected.v2.y);
      t_projected.v3.x = Math.round(t_projected.v3.x);
      t_projected.v3.y = Math.round(t_projected.v3.y);

      t_projected.draw();
    }
  }
}

const cube = new mesh();
cube.m = [
  // SOUTH
  new Triangle(new v(0.0, 0.0, 0.0), new v(0.0, 1.0, 0.0), new v(1.0, 1.0, 0.0)),
  new Triangle(new v(0.0, 0.0, 0.0), new v(1.0, 1.0, 0.0), new v(1.0, 0.0, 0.0)),
  // EAST                                                      
  new Triangle(new v(1.0, 0.0, 0.0), new v(1.0, 1.0, 0.0), new v(1.0, 1.0, 1.0)),
  new Triangle(new v(1.0, 0.0, 0.0), new v(1.0, 1.0, 1.0), new v(1.0, 0.0, 1.0)),
  // NORTH                                                     
  new Triangle(new v(1.0, 0.0, 1.0), new v(1.0, 1.0, 1.0), new v(0.0, 1.0, 1.0)),
  new Triangle(new v(1.0, 0.0, 1.0), new v(0.0, 1.0, 1.0), new v(0.0, 0.0, 1.0)),
  // WEST                                                      
  new Triangle(new v(0.0, 0.0, 1.0), new v(0.0, 1.0, 1.0), new v(0.0, 1.0, 0.0)),
  new Triangle(new v(0.0, 0.0, 1.0), new v(0.0, 1.0, 0.0), new v(0.0, 0.0, 0.0)),
  // TOP                                                       
  new Triangle(new v(0.0, 1.0, 0.0), new v(0.0, 1.0, 1.0), new v(1.0, 1.0, 1.0)),
  new Triangle(new v(0.0, 1.0, 0.0), new v(1.0, 1.0, 1.0), new v(1.0, 1.0, 0.0)),
  // BOTTOM                                                    
  new Triangle(new v(1.0, 0.0, 1.0), new v(0.0, 0.0, 1.0), new v(0.0, 0.0, 0.0)),
  new Triangle(new v(1.0, 0.0, 1.0), new v(0.0, 0.0, 0.0), new v(1.0, 0.0, 0.0)),
];

class matrix4x4 {
  constructor() {
    this.r = [
      [0.0, 0.0, 0.0, 0.0],
      [0.0, 0.0, 0.0, 0.0],
      [0.0, 0.0, 0.0, 0.0],
      [0.0, 0.0, 0.0, 0.0],
    ];
  }
}

const width = 256.0;
const height = 240.0;
const f_near = 0.1;
const f_far = 1000.0;
const f_fov = 90.0;
const f_aspect_ratio = height / width;
const f_fov_rad = 1.0 / Math.tan(f_fov * 0.5 / 180.0 * Math.PI);

const mat_proj = [
  [f_aspect_ratio * f_fov_rad, 0, 0, 0],
  [0, f_fov_rad, 0, 0],
  [0, 0, f_far / (f_far - f_near), 1.0],
  [0, 0, (-f_far * f_near) / (f_far - f_near), 0.0],
];

function multiply_matrix_vector(i, m) {
  const o = new v(
    i.x * m[0][0] + i.y * m[1][0] + i.z * m[2][0] + m[3][0],
    i.x * m[0][1] + i.y * m[1][1] + i.z * m[2][1] + m[3][1],
    i.x * m[0][2] + i.y * m[1][2] + i.z * m[2][2] + m[3][2],
  );
  const w = i.x * m[0][3] + i.y * m[1][3] + i.z * m[2][3] + m[3][3];
  if (w != 0) {
    o.x /= w;
    o.y /= w;
    o.z /= w;
  }
  return o;
}

let f_elapsed_time = 0;
let f_theta = 0;
setInterval(loop, 50);

function loop() {
  f_theta = 1.0 * f_elapsed_time;
  const mat_rot_z = [
    [Math.cos(f_theta), Math.sin(f_theta), 0, 0],
    [-Math.sin(f_theta), Math.cos(f_theta), 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ];

  const rot_x_speed = 0.5;
  const mat_rot_x = [
    [1, 0, 0, 0],
    [0, Math.cos(f_theta * rot_x_speed), Math.sin(f_theta * rot_x_speed), 0],
    [0, -Math.sin(f_theta * rot_x_speed), Math.cos(f_theta * rot_x_speed), 0],
    [0, 0, 0, 1],
  ];

  clear();
  cube.draw_projected(mat_proj, mat_rot_z, mat_rot_x);

  f_elapsed_time += 0.1;
}
