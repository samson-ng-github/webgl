import './style.css';


const canvas = document.querySelector('#canvas');
const gl = canvas.getContext('webgl2');
if (!gl) {
  throw new Error('WebGL 2 is not supported');
}


canvas.width = 500;
canvas.height = 500;
gl.viewport(0, 0, canvas.width, canvas.height);

const vertexShaderSource = `#version 300 es
in vec3 position;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

void main() {
    gl_Position =
        projection *
        view *
        model *
        vec4(position, 1.0);
}
`;

const fragmentShaderSource = `#version 300 es
precision highp float;

out vec4 outColor;

void main() {
    outColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`;

function createShader(type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader));
  }

  return shader;
}

const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
const program = gl.createProgram();

gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  throw new Error(gl.getProgramInfoLog(program));
}

gl.useProgram(program);

// Identity matrices

const identityMatrix = new Float32Array([
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1,
]);

for (const name of ['model', 'view', 'projection']) {
  const location = gl.getUniformLocation(program, name);

  gl.uniformMatrix4fv(location, false, identityMatrix);
}

// Triangle vertices

const positions = new Float32Array([
  0.0,
  0.5,
  0.0, // vertex 1
  -0.5,
  -0.5,
  0.0, // vertex 2
  0.5,
  -0.5,
  0.0, // vertex 3
]);

const positionBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

const positionLocation = gl.getAttribLocation(program, 'position');

gl.enableVertexAttribArray(positionLocation);

gl.vertexAttribPointer(
  positionLocation,
  3, // 3 numbers per vertex: x, y, z
  gl.FLOAT,
  false,
  0,
  0,
);


gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.TRIANGLES, 0, 3);