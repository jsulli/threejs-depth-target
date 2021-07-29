/* tslint:disable:no-var-requires no-require-imports */
import {Camera, DoubleSide, OrthographicCamera, PerspectiveCamera, ShaderMaterial} from "three";

const vertexShader = require('../shaders/depthtarget.vert').default;
const fragmentShader = require('../shaders/depthtarget.frag').default;
/* tslint:enable:no-var-requires no-require-imports */

export class DepthTargetMaterial extends ShaderMaterial {

    constructor(camera: PerspectiveCamera) {
        console.log(fragmentShader, vertexShader);
        super({
            fragmentShader,
            side: DoubleSide,
            transparent: true,
            uniforms: {
                cameraNear: { value: camera.near },
                cameraFar: { value: camera.far },
                tDiffuse: { value: null },
                tDepth: { value: null }
            },
            vertexShader,
        });
    }
}
