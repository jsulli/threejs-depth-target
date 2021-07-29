varying vec2 vUv;

void main() {
    vUv = uv;
    vec4 modelViewPos = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewPos;
}
