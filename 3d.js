let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

function clear() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

const draw_triangle = (t) => {
  context.beginPath();
  context.fillStyle = t.color;
  context.moveTo(t.v1.x, t.v1.y);
  context.lineTo(t.v2.x, t.v2.y);
  context.lineTo(t.v3.x, t.v3.y);
  context.closePath();
  context.fill();
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

const matrix_make_identity = () => {
  return [
    [1.0, 0.0, 0.0, 0.0],
    [0.0, 1.0, 0.0, 0.0],
    [0.0, 0.0, 1.0, 0.0],
    [0.0, 0.0, 0.0, 1.0],
  ];
}

const matrix_make_rotation_x = (a) => {
  return [
    [1.0, 0.0, 0.0, 0.0],
    [0.0, Math.cos(a), Math.sin(a), 0.0],
    [0.0, -Math.sin(a), Math.cos(a), 0.0],
    [0.0, 0.0, 0.0, 1.0],
  ];
}

const matrix_make_rotation_y = (a) => {
  return [
    [Math.cos(a), 0.0, Math.sin(a), 0.0],
    [0.0, 1.0, 0.0, 0.0],
    [-Math.sin(a), 0.0, Math.cos(a), 0.0],
    [0.0, 0.0, 0.0, 1.0],
  ];
}

const matrix_make_rotation_z = (a) => {
  return [
    [Math.cos(a), Math.sin(a), 0.0, 0.0],
    [-Math.sin(a), Math.cos(a), 0.0, 0.0],
    [0.0, 0.0, 1.0, 0.0],
    [0.0, 0.0, 0.0, 1.0],
  ];
}

const matrix_make_translation = (x, y, z) => {
  return [
    [1.0, 0.0, 0.0, 0.0],
    [0.0, 1.0, 0.0, 0.0],
    [0.0, 0.0, 1.0, 0.0],
    [x, y, z, 1.0],
  ];
}

const matrix_make_projection = (f_fov_rad, f_aspect_ratio, f_far, f_near) => {
  return [
    [f_aspect_ratio * f_fov_rad, 0, 0, 0],
    [0, f_fov_rad, 0, 0],
    [0, 0, f_far / (f_far - f_near), 1.0],
    [0, 0, (-f_far * f_near) / (f_far - f_near), 0.0],
  ];
}

const matrix_multiply_by_matrix = (m1, m2) => {
  const m = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 4; r++) {
      m[r][c] = m1[r][0] * m2[0][c] + m1[r][1] * m2[1][c] + m1[r][2] * m2[2][c] + m1[r][3] * m2[3][c];
    }
  }
  return m;
}

const luminum_to_color = (luminum) => {
  const color_code = Math.round(Math.abs(luminum) * 100 + 100);
  const color_hex = color_code.toString(16).padStart(2, '0');
  return `#${color_hex}${color_hex}${color_hex}`;
}

const draw_mesh = () => {
  for (let t of this.m) {
    draw_triangle(t);
  }
}

const draw_projected_mesh = (m, mat_proj, mat_rot_z, mat_rot_x) => {
  const triangles = [];
  for (let triangle of m.m) {
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
    draw_triangle(triangle);
  }
}

const ship = new mesh();
ship.m = load_mesh_object(ship_obj);

const teapot = new mesh();
teapot.m = load_mesh_object(teapot_obj);

const cube = new mesh();
cube.m = cube_mesh;

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

  const mat_proj = matrix_make_projection(f_fov_rad, f_aspect_ratio, f_far, f_near);
  const f_theta = 0.1 * f_elapsed_time;

  const rot_z_speed = arg('rot_z_speed'); // 0.5;
  const mat_rot_z = matrix_make_rotation_z(f_theta * rot_z_speed);

  const rot_x_speed = arg('rot_x_speed'); // 0.5;
  const mat_rot_x = matrix_make_rotation_y(f_theta * rot_x_speed);

  clear();
  draw_projected_mesh(ship, mat_proj, mat_rot_z, mat_rot_x);

  f_elapsed_time += 1;
}
