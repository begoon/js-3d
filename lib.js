class V {
  constructor(x, y, z, w = 1) {
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
}

function load_mesh_object(obj) {
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
  return new V(
    v.x * m[0][0] + v.y * m[1][0] + v.z * m[2][0] + v.w * m[3][0],
    v.x * m[0][1] + v.y * m[1][1] + v.z * m[2][1] + v.w * m[3][1],
    v.x * m[0][2] + v.y * m[1][2] + v.z * m[2][2] + v.w * m[3][2],
    v.x * m[0][3] + v.y * m[1][3] + v.z * m[2][3] + v.w * m[3][3],
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
  const o = new Triangle(
    vector_multiply_by_matrix(t.v1, m),
    vector_multiply_by_matrix(t.v2, m),
    vector_multiply_by_matrix(t.v3, m),
  );
  o.v1 = vector_div(o.v1, o.v1.w);
  o.v2 = vector_div(o.v2, o.v2.w);
  o.v3 = vector_div(o.v3, o.v3.w);
  return o;
}

class mesh {
  constructor() {
    this.m = [];
  }
}
