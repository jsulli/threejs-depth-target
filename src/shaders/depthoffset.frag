#include <packing>

varying vec2 vUv;
uniform sampler2D tDepth;
uniform vec2 resolution;
uniform float cameraNear;
uniform float cameraFar;

void main() {
    vec2 screenPosition = gl_FragCoord.xy / resolution;

    vec4 depthTexture = texture2D( tDepth, screenPosition );
    float unpack = unpackRGBAToDepth(depthTexture);
    bool occluded = unpack > (gl_FragCoord.z);

    if(occluded) {
        gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
    } else {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 0.0);
    }

    gl_FragColor = vec4(gl_FragCoord.z);
    gl_FragColor = vec4(unpack);
    gl_FragColor.a = 1.0;
}
