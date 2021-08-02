#include <packing>

varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform sampler2D tDepth;
uniform float cameraNear;
uniform float cameraFar;


float readDepth( sampler2D depthSampler, vec2 coord ) {
    return texture2D( depthSampler, coord ).x;
//    float fragCoordZ = texture2D( depthSampler, coord ).x;
//    float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
//    return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
}

void main() {
    float depth = readDepth( tDepth, vUv );
    vec4 pack = packDepthToRGBA(depth);

    gl_FragColor = pack;
    //gl_FragColor = vec4(depth);
}
