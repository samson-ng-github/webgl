const createShader = (gl, type, source) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader));
  }

  return shader;
};

const createSphere = (radius, segments, rings) => {
  const positions = [];
  const indices = [];

  for (let y = 0; y <= rings; y++) {
    const phi = (y * Math.PI) / rings;

    for (let x = 0; x <= segments; x++) {
      const theta = (x * 2 * Math.PI) / segments;

      const px = radius * Math.sin(phi) * Math.cos(theta);

      const py = radius * Math.cos(phi);

      const pz = radius * Math.sin(phi) * Math.sin(theta);

      positions.push(px, py, pz);
    }
  }

  // Connect the vertices into triangles
  for (let y = 0; y < rings; y++) {
    for (let x = 0; x < segments; x++) {
      const first = y * (segments + 1) + x;

      const second = first + segments + 1;

      indices.push(first, first + 1, second);
      indices.push(second, first + 1, second + 1);
    }
  }

  return {
    positions,
    indices,
  };
};

const render = (gl, indices) => {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
};

const createPerspectiveMatrix = (fov, aspect, near, far) => {
  const f = 1 / Math.tan(fov / 2);

  return new Float32Array([
    f / aspect,
    0,
    0,
    0,
    0,
    f,
    0,
    0,
    0,
    0,
    (far + near) / (near - far),
    -1,
    0,
    0,
    (2 * far * near) / (near - far),
    0,
  ]);
};

export { createShader, createSphere, createPerspectiveMatrix,render };
