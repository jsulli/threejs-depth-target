#include <packing>

varying vec2 vUv;
uniform sampler2D tDepth;
uniform vec2 resolution;

void main() {
    vec2 uv = gl_FragCoord.xy / resolution;

    vec4 depthTexture = texture2D( tDepth, uv );
    float unpack = unpackRGBAToDepth(depthTexture);
    bool occluded = unpack > gl_FragCoord.z;

    if(occluded) {
        gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
    } else {
        gl_FragColor = depthTexture;
    }

    //gl_FragColor.rgb = vec3(unpack);
    //gl_FragColor.a = 1.0;
}
