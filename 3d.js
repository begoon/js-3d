let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

function clear() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

class V {
  constructor(x, y, z, w = 0) {
    this.x = parseFloat(x);
    this.y = parseFloat(y);
    this.z = parseFloat(z);
    this.w = parseFloat(w);
  }
  s() {
    return `[x: ${this.x}, y: ${this.y}, z: ${this.z}, w: ${this.w}]`;
  }
  s2() {
    return `[x: ${this.x}, y: ${this.y}]`;
  }
}

class Triangle {
  constructor(v1, v2, v3, color = '#000') {
    this.t = [v1, v2, v3];
    this.v1 = v1;
    this.v2 = v2;
    this.v3 = v3;
    this.color = color;
  }
  draw() {
    context.beginPath();
    context.fillStyle = this.color;
    context.moveTo(this.v1.x, this.v1.y);
    context.lineTo(this.v2.x, this.v2.y);
    context.lineTo(this.v3.x, this.v3.y);
    context.closePath();
    context.fill();
  }
}

function load_object(obj) {
  const lines = obj.split('\n').filter(x => x.trim().length > 0);
  const vectors = lines.filter(x => x[0] == 'v').map(x => new V(
    ...x.split(' ').slice(1))
  )
  const mesh = lines
    .filter(x => x[0] == 'f')
    .map(x => x.split(' ').slice(1).map(z => vectors[+z - 1]))
    .map(t => new Triangle(...t))
  return mesh;
}

const vector_add = (v1, v2) => {
  return new V(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
}

const vector_substract = (v1, v2) => {
  return new V(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
}

const vector_multiply_by_scalar = (v, k) => {
  return new V(v.x * k, v.y * k, v.z * k);
}

const vector_div = (v, k) => {
  return new V(v.x / k, v.y / k, v.z / k);
}

const vector_length = (v) => {
  return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
}

const vector_normalize = (v) => {
  return vector_div(v, vector_length(v));
}

const vector_dot_product = (v1, v2) => {
  return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}

const vector_cross_product = (v1, v2) => {
  return new V(
    v1.y * v2.z - v1.z * v2.y,
    v1.z * v2.x - v1.x * v2.z,
    v1.x * v2.y - v1.y * v2.x,
  );
}

const vector_multiply_by_vector = (v1, v2) => {
  return new V(v1.x * v2.x, v1.y * v2.y, v1.z * v2.z);
}

function vector_multiply_by_matrix(v, m) {
  const o = new V(
    v.x * m[0][0] + v.y * m[1][0] + v.z * m[2][0] + v.w * m[3][0],
    v.x * m[0][1] + v.y * m[1][1] + v.z * m[2][1] + v.w * m[3][1],
    v.x * m[0][2] + v.y * m[1][2] + v.z * m[2][2] + v.w * m[3][2],
    v.x * m[0][3] + v.y * m[1][3] + v.z * m[2][3] + v.w * m[3][3],
  );
  return o;
}

const vector_scale_to_canvas = (v) => {
  return vector_multiply_by_vector(
    vector_add(v, new V(1, 1, 1)), new V(0.5 * width, 0.5 * height, 1)
  );
}

const triangle_offset = (t, o) => {
  return new Triangle(
    vector_add(t.v1, o),
    vector_add(t.v2, o),
    vector_add(t.v3, o),
  );
}

const triangle_normal = (t) => {
  const line1 = vector_substract(t.v2, t.v1);
  const line2 = vector_substract(t.v3, t.v1);
  return vector_cross_product(line1, line2);
}

const triangle_multiply_by_matrix = (t, m) => {
  t.v1.w = t.v2.w = t.v3.w = 1;
  const o = new Triangle(
    vector_multiply_by_matrix(t.v1, m),
    vector_multiply_by_matrix(t.v2, m),
    vector_multiply_by_matrix(t.v3, m),
  );
  if (o.v1.w != 0) {
    o.v1 = vector_div(o.v1, o.v1.w);
  }
  if (o.v2.w != 0) {
    o.v2 = vector_div(o.v2, o.v2.w);
  }
  if (o.v3.w != 0) {
    o.v3 = vector_div(o.v3, o.v3.w);
  }
  return o;
}

const triangle_scale_to_canvas = (t) => {
  return new Triangle(
    vector_scale_to_canvas(t.v1),
    vector_scale_to_canvas(t.v2),
    vector_scale_to_canvas(t.v3),
  )
}

const luminum_to_color = (luminum) => {
  const color_code = Math.round(Math.abs(luminum) * 100 + 100);
  const color_hex = color_code.toString(16).padStart(2, '0');
  return `#${color_hex}${color_hex}${color_hex}`;
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
  draw_projected(mat_proj, mat_rot_z, mat_rot_x) {
    const triangles = [];
    for (let triangle of this.m) {
      triangle.v1.w = 1;
      triangle.v2.w = 1;
      triangle.v3.w = 1;
      const t_rotated_z = triangle_multiply_by_matrix(triangle, mat_rot_z);
      const t_rotated_x = triangle_multiply_by_matrix(t_rotated_z, mat_rot_x);

      const distance = new V(0.0, 0.0, 8.0);
      const t_translated = triangle_offset(t_rotated_x, distance);

      const normal = vector_normalize(triangle_normal(t_translated));
      const camera_dot_product = vector_dot_product(
        normal,
        vector_substract(t_translated.v1, camera),
      );

      if (camera_dot_product < 0) {
        const light_direction = vector_normalize(new V(0.0, 0.0, -1.0));

        const light_dot_product = vector_dot_product(normal, light_direction);

        const color = luminum_to_color(light_dot_product);

        const t_projected = triangle_multiply_by_matrix(t_translated, mat_proj);

        const t_scaled = triangle_scale_to_canvas(t_projected);
        t_scaled.color = color;

        triangles.push(t_scaled);
      }
    }

    triangles.sort((t1, t2) => {
      const z1 = (t1.v1.z + t1.v2.z + t1.v3.z) / 3.0;
      const z2 = (t2.v1.z + t2.v2.z + t2.v3.z) / 3.0;
      return z2 - z1;
    });

    for (const triangle of triangles) {
      triangle.draw();
    }
  }
}

const ship = new mesh();
ship.m = load_object(ship_obj);

const teapot = new mesh();
teapot.m = load_object(teapot_obj);

const cube = new mesh();
cube.m = cube_mesh();

const width = 512.0;
const height = 480.0;
const f_aspect_ratio = height / width;
const f_near = 0.1;
const f_far = 1000.0;
const f_fov = 90.0;
const f_fov_rad = 1.0 / Math.tan(f_fov * 0.5 / 180.0 * Math.PI);

const camera = new V(0, 0, 0);

let f_elapsed_time = 0;
setInterval(loop, 100);

const arg = (name) => {
  return parseFloat(document.getElementById(name).innerHTML);
}

function loop() {
  const f_far = 1000.0;
  const f_fov = arg('f_fov'); // 90.0;
  const f_fov_rad = 1.0 / Math.tan(f_fov * 0.5 / 180.0 * Math.PI);

  const mat_proj = [
    [f_aspect_ratio * f_fov_rad, 0, 0, 0],
    [0, f_fov_rad, 0, 0],
    [0, 0, f_far / (f_far - f_near), 1.0],
    [0, 0, (-f_far * f_near) / (f_far - f_near), 0.0],
  ];

  const f_theta = 0.1 * f_elapsed_time;

  const rot_z_speed = arg('rot_z_speed'); // 0.5;
  const mat_rot_z = [
    [Math.cos(f_theta), Math.sin(f_theta * rot_z_speed), 0, 0],
    [-Math.sin(f_theta), Math.cos(f_theta * rot_z_speed), 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ];

  const rot_x_speed = arg('rot_x_speed'); // 0.5;
  const mat_rot_x = [
    [1, 0, 0, 0],
    [0, Math.cos(f_theta * rot_x_speed), Math.sin(f_theta * rot_x_speed), 0],
    [0, -Math.sin(f_theta * rot_x_speed), Math.cos(f_theta * rot_x_speed), 0],
    [0, 0, 0, 1],
  ];

  clear();
  ship.draw_projected(mat_proj, mat_rot_z, mat_rot_x);

  f_elapsed_time += 1;
}
