import './style.css';
import {
  createShader,
  createSphere,
  createPerspectiveMatrix,
  render,
} from './utilities.js';

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

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(
  gl,
  gl.FRAGMENT_SHADER,
  fragmentShaderSource,
);
const program = gl.createProgram();

gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  throw new Error(gl.getProgramInfoLog(program));
}

gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.enable(gl.DEPTH_TEST);
gl.useProgram(program);

// Identity matrices

const modelMatrix = new Float32Array([
  1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
]);

const viewMatrix = new Float32Array([
  1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -, 1,
]);

const projectionMatrix = createPerspectiveMatrix(
  Math.PI / 4,
  canvas.width / canvas.height,
  0.1,
  100,
);

gl.uniformMatrix4fv(
  gl.getUniformLocation(program, 'model'),
  false,
  modelMatrix,
);

gl.uniformMatrix4fv(gl.getUniformLocation(program, 'view'), false, viewMatrix);

gl.uniformMatrix4fv(
  gl.getUniformLocation(program, 'projection'),
  false,
  projectionMatrix,
);

// Sphere vertices

const { positions, indices } = createSphere(1, 32, 16);

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
const positionLocation = gl.getAttribLocation(program, 'position');
gl.enableVertexAttribArray(positionLocation);

gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

const indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(
  gl.ELEMENT_ARRAY_BUFFER,
  new Uint16Array(indices),
  gl.STATIC_DRAW,
);

render(gl, indices);
