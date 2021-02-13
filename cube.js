const cube_mesh = [
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
