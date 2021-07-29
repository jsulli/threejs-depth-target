/* tslint:disable:no-var-requires no-require-imports */
import {
    AlwaysDepth,
    Camera,
    DoubleSide,
    OrthographicCamera,
    PerspectiveCamera,
    ShaderMaterial,
    Vector2
} from "three";

const vertexShader = require('../shaders/depthoffset.vert').default;
const fragmentShader = require('../shaders/depthoffset.frag').default;
/* tslint:enable:no-var-requires no-require-imports */

export class DepthOffsetMaterial extends ShaderMaterial {

    constructor() {
        console.log(fragmentShader, vertexShader);
        super({
            fragmentShader,
            side: DoubleSide,
            transparent: true,
            uniforms: {
                tDepth: { value: null },
                resolution: { value: new Vector2(window.innerWidth, window.innerHeight) }
            },
            vertexShader,
        });

        this.depthTest = false;
    }
}
