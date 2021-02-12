ship_obj = `
# Blender v2.79 (sub 0) OBJ File: ''
# www.blender.org
v 1.000000 -1.000000 -1.000000
v 1.000000 1.000000 -1.000000
v 1.000000 -1.000000 1.000000
v 1.000000 1.000000 1.000000
v -1.000000 -1.000000 -1.000000
v -1.000000 1.000000 -1.000000
v -1.000000 -1.000000 1.000000
v -1.000000 1.000000 1.000000
v -0.720000 0.120000 -1.400000
v 0.300000 0.000000 5.000000
v -0.600000 -0.600000 -1.400000
v -0.300000 0.000000 5.000000
v -1.200000 0.200000 1.000000
v -0.600000 0.600000 -1.400000
v -1.200000 -0.200000 -1.000000
v -1.200000 0.200000 -1.000000
v 1.200000 -0.200000 1.000000
v 1.200000 -0.200000 -1.000000
v 1.200000 0.200000 -1.000000
v 1.200000 0.200000 1.000000
v -1.200000 -0.200000 1.000000
v 0.600000 0.600000 -1.400000
v 0.600000 -0.600000 -1.400000
v -4.200000 0.060000 1.000000
v -4.200000 -0.060000 1.000000
v -4.200000 -0.060000 -1.000000
v -4.200000 0.060000 -1.000000
v 4.200000 -0.060000 1.000000
v 4.200000 -0.060000 -1.000000
v 4.200000 0.060000 -1.000000
v 4.200000 0.060000 1.000000
v 4.200000 -0.180000 1.000000
v 4.200000 -0.180000 -1.000000
v 4.200000 0.180000 -1.000000
v 4.200000 0.180000 1.000000
v 4.500000 -0.180000 1.000000
v 4.500000 -0.180000 -1.000000
v 4.500000 0.180000 -1.000000
v 4.500000 0.180000 1.000000
v -4.200000 0.180000 1.000000
v -4.200000 -0.180000 1.000000
v -4.200000 -0.180000 -1.000000
v -4.200000 0.180000 -1.000000
v -4.500000 0.180000 1.000000
v -4.500000 -0.180000 1.000000
v -4.500000 -0.180000 -1.000000
v -4.500000 0.180000 -1.000000
v 4.350000 -0.180000 3.000000
v 4.350000 0.180000 3.000000
v -4.350000 0.180000 3.000000
v -4.350000 -0.180000 3.000000
v 0.000000 -0.700000 3.000000
v -0.720000 -0.120000 -1.400000
v 0.720000 -0.120000 -1.400000
v 0.720000 0.120000 -1.400000
s off
f 21 52 12
f 6 13 8
f 5 23 1
f 7 1 3
f 4 6 8
f 4 12 10
f 17 20 10
f 20 4 10
f 17 52 3
f 7 3 52
f 16 14 9
f 7 15 5
f 20 30 19
f 18 23 54
f 4 19 2
f 1 17 3
f 13 25 21
f 13 21 12
f 12 52 10
f 8 13 12
f 27 42 43
f 15 27 16
f 21 26 15
f 16 24 13
f 31 34 30
f 18 28 17
f 17 31 20
f 19 29 18
f 32 49 35
f 29 32 28
f 31 32 35
f 29 34 33
f 38 36 37
f 34 37 33
f 35 38 34
f 33 36 32
f 43 44 40
f 25 42 26
f 27 40 24
f 25 40 41
f 44 46 45
f 40 44 50
f 42 47 43
f 41 46 42
f 44 47 46
f 32 36 48
f 39 35 49
f 39 48 36
f 45 51 50
f 40 51 41
f 45 41 51
f 45 50 44
f 18 29 28
f 17 28 31
f 4 2 6
f 18 55 19
f 15 11 5
f 19 22 2
f 2 14 6
f 16 53 15
f 53 9 54
f 19 30 29
f 15 26 27
f 16 27 24
f 13 24 25
f 21 25 26
f 7 21 15
f 7 5 1
f 21 7 52
f 1 18 17
f 17 10 52
f 4 20 19
f 20 31 30
f 4 8 12
f 43 47 44
f 6 16 13
f 40 50 51
f 41 45 46
f 42 46 47
f 2 22 14
f 19 55 22
f 18 54 55
f 18 1 23
f 5 11 23
f 15 53 11
f 16 9 53
f 16 6 14
f 9 14 22
f 22 55 9
f 55 54 9
f 54 23 11
f 11 53 54
f 34 38 37
f 38 39 36
f 39 49 48
f 35 39 38
f 33 37 36
f 25 41 42
f 27 43 40
f 31 35 34
f 29 33 32
f 32 48 49
f 27 26 42
f 31 28 32
f 29 30 34
f 25 24 40
`;

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

function clear() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

class V {
  constructor(x, y, z) {
    this.x = parseFloat(x);
    this.y = parseFloat(y);
    this.z = parseFloat(z);
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

const vector_normalize = (v) => {
  const l = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  return new V(v.x / l, v.y / l, v.z / l);
}

const vector_dot_product = (v1, v2) => {
  return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}

function vector_multiply_by_matrix(i, m) {
  const o = new V(
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

const vector_scale_to_canvas = (v) => {
  return new V(
    Math.round((v.x + 1.0) * 0.5 * width),
    Math.round((v.y + 1.0) * 0.5 * height),
    v.z,
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
  const line1 = new V(
    t.v2.x - t.v1.x,
    t.v2.y - t.v1.y,
    t.v2.z - t.v1.z,
  );
  const line2 = new V(
    t.v3.x - t.v1.x,
    t.v3.y - t.v1.y,
    t.v3.z - t.v1.z,
  );
  return new V(
    line1.y * line2.z - line1.z * line2.y,
    line1.z * line2.x - line1.x * line2.z,
    line1.x * line2.y - line1.y * line2.x,
  );
}

const triangle_multiply_by_matrix = (t, m) => {
  return new Triangle(
    vector_multiply_by_matrix(t.v1, m),
    vector_multiply_by_matrix(t.v2, m),
    vector_multiply_by_matrix(t.v3, m),
  );
}

const triangle_scale_to_canvas = (t) => {
  return new Triangle(
    vector_scale_to_canvas(t.v1),
    vector_scale_to_canvas(t.v2),
    vector_scale_to_canvas(t.v3),
  )
}

const luminum_to_color = (luminum) => {
  const color_code = Math.round(Math.abs(luminum) * 255);
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

const cube = new mesh();
cube.m = [
  // SOUTH
  new Triangle(new V(0.0, 0.0, 0.0), new V(0.0, 1.0, 0.0), new V(1.0, 1.0, 0.0)),
  new Triangle(new V(0.0, 0.0, 0.0), new V(1.0, 1.0, 0.0), new V(1.0, 0.0, 0.0)),
  // EAST                                                      
  new Triangle(new V(1.0, 0.0, 0.0), new V(1.0, 1.0, 0.0), new V(1.0, 1.0, 1.0)),
  new Triangle(new V(1.0, 0.0, 0.0), new V(1.0, 1.0, 1.0), new V(1.0, 0.0, 1.0)),
  // NORTH                                                     
  new Triangle(new V(1.0, 0.0, 1.0), new V(1.0, 1.0, 1.0), new V(0.0, 1.0, 1.0)),
  new Triangle(new V(1.0, 0.0, 1.0), new V(0.0, 1.0, 1.0), new V(0.0, 0.0, 1.0)),
  // WEST                                                      
  new Triangle(new V(0.0, 0.0, 1.0), new V(0.0, 1.0, 1.0), new V(0.0, 1.0, 0.0)),
  new Triangle(new V(0.0, 0.0, 1.0), new V(0.0, 1.0, 0.0), new V(0.0, 0.0, 0.0)),
  // TOP                                                       
  new Triangle(new V(0.0, 1.0, 0.0), new V(0.0, 1.0, 1.0), new V(1.0, 1.0, 1.0)),
  new Triangle(new V(0.0, 1.0, 0.0), new V(1.0, 1.0, 1.0), new V(1.0, 1.0, 0.0)),
  // BOTTOM                                                    
  new Triangle(new V(1.0, 0.0, 1.0), new V(0.0, 0.0, 1.0), new V(0.0, 0.0, 0.0)),
  new Triangle(new V(1.0, 0.0, 1.0), new V(0.0, 0.0, 0.0), new V(1.0, 0.0, 0.0)),
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

const width = 512.0;
const height = 480.0;
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

const camera = new V(0, 0, 0);

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
  ship.draw_projected(mat_proj, mat_rot_z, mat_rot_x);

  f_elapsed_time += 0.1;
}
