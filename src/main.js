import './style.css';


const canvas = document.querySelector('#canvas');
const gl = canvas.getContext('webgl2');
canvas.width = 500;
canvas.height = 500;
gl.viewport(0, 0, canvas.width, canvas.height);

if (!gl) {
  throw new Error('WebGL 2 is not supported');
}

const vertexShaderSource = `/*glsl*/ #version 300 es
void main() {
  gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
  gl_PointSize = 10.0;
}
`;

const fragmentShaderSource = `/*glsl*/ #version 300 es
precision mediump float;

out vec4 fragColor;

void main() {
  fragColor = vec4(1.0, 0.0, 0.0, 1.0);
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

// Set the canvas background to dark grey.
gl.clearColor(0.1, 0.1, 0.1, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

// Draw one point.
gl.drawArrays(gl.POINTS, 0, 1);