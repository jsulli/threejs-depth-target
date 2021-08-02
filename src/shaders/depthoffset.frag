#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

varying vec2 vUv;
varying vec2 vHighPrecisionZW;
uniform sampler2D tDepth;
uniform vec2 resolution;
uniform float cameraNear;
uniform float cameraFar;

float LinearizeDepth(float depth)
{
    float z = depth * 2.0 - 1.0; // back to NDC
    return (2.0 * cameraNear * cameraFar) / (cameraFar + cameraNear - depth * (cameraFar - cameraNear));
}

void main() {
    #include <clipping_planes_fragment>
    #include <map_fragment>
    #include <alphamap_fragment>
    #include <alphatest_fragment>
    #include <logdepthbuf_fragment>
    vec2 screenPosition = gl_FragCoord.xy / resolution;

    // Higher precision equivalent of gl_FragCoord.z. This assumes depthRange has been left to its default values.
    float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;

    vec4 depthTexture = texture2D( tDepth, screenPosition );
    float unpack = unpackRGBAToDepth(depthTexture);
    //float fragDepth = LinearizeDepth(gl_FragCoord.z) / cameraFar;
    //float fragDepth = LinearizeDepth(fragCoordZ) / cameraFar;
    bool occluded = unpack * 1.001 > (fragCoordZ);

    if(occluded) {
        gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
    } else {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }

    //gl_FragColor = packDepthToRGBA( fragCoordZ );
//    gl_FragColor = vec4(fragCoordZ);
//
//    gl_FragColor = vec4(fragDepth);
//    gl_FragColor = vec4(unpack);
//    gl_FragColor.a = 1.0;
}
