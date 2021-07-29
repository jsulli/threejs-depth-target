import {
    AxesHelper,
    BoxGeometry,
    DepthFormat,
    DepthTexture,
    DirectionalLight,
    Mesh,
    MeshBasicMaterial,
    OrthographicCamera,
    PerspectiveCamera,
    PlaneBufferGeometry,
    PlaneGeometry,
    RGBAFormat,
    Scene,
    UnsignedShortType,
    WebGLRenderer,
    WebGLRenderTarget
} from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import {DepthTargetMaterial} from "./DepthTargetMaterial";
import {DepthOffsetMaterial} from "./DepthOffsetMaterial";


export class BaseScene {

    public scene = new Scene()
    public camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 40)
    public renderer = new WebGLRenderer()
    public controls = new OrbitControls(this.camera, this.renderer.domElement)

    private light = new DirectionalLight(0xffffff, 1.0)
    private axis = new AxesHelper(5)
    private box: Mesh
    private strip: Mesh;
    private strip2: Mesh;

    private basicMat = new MeshBasicMaterial();

    private depthScene: Scene;
    private depthTarget: WebGLRenderTarget;
    private depthCamera: OrthographicCamera;
    private depthMaterial: DepthTargetMaterial;

    private packTarget: WebGLRenderTarget;

    private depthReadMaterial: DepthOffsetMaterial;

    constructor() {
        this.renderer.setSize(window.innerWidth, window.innerHeight)

        document.body.appendChild(this.renderer.domElement)

        let material = new MeshBasicMaterial({ color: 0x4455aa })

        this.box = new Mesh(new BoxGeometry(2, 2, 2), material)

        this.depthReadMaterial = new DepthOffsetMaterial(this.camera);
        this.strip = new Mesh(new PlaneBufferGeometry(1.75, 1.75), this.depthReadMaterial);
        this.strip.rotateY(Math.PI / 4);
        this.strip.position.set(1.5, 0.5, 1.5);

        this.strip2 = this.strip.clone();
        this.strip2.position.set(4, 0.5, 1.5)
        this.strip2.material = this.basicMat;

        this.box.position.set(1.5, 0.5, 1.5)
        this.camera.position.set(6, 3, 6)
        this.light.position.set(100, 100, 100)

        const box2 = this.box.clone();
        box2.position.set(4, 0.5, 1.5);

        this.camera.lookAt(this.scene.position)

        this.scene.add(this.light)
        this.scene.add(this.axis)
        this.scene.add(this.box)
        this.scene.add(box2);

        this.scene.add(this.strip);
        this.scene.add(this.strip2);

        this.depthTarget = new WebGLRenderTarget( window.innerWidth, window.innerHeight );
        this.depthTarget.texture.format = RGBAFormat;
        this.depthTarget.stencilBuffer = false;
        this.depthTarget.depthBuffer = true;
        this.depthTarget.depthTexture = new DepthTexture(window.innerWidth, window.innerHeight);
        this.depthTarget.depthTexture.format = DepthFormat;
        this.depthTarget.depthTexture.type = UnsignedShortType;

        this.packTarget = new WebGLRenderTarget(window.innerWidth, window.innerHeight)

        window.addEventListener('resize', this.onViewResize.bind(this), false)

        this.setupPost();

        this.render()
    }


    private setupPost() {
        // Setup post processing stage
        const planeGeo = new PlaneGeometry( 2, 2 );
        this.depthCamera = new OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
        this.depthCamera.position.z = 1
        this.depthMaterial = new DepthTargetMaterial(this.camera);


        const depthQuad = new Mesh( planeGeo, this.depthMaterial );
        this.depthScene = new Scene();
        this.depthScene.add( depthQuad );
    }


    public onViewResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );

        this.depthTarget.setSize(window.innerWidth, window.innerHeight);
    }


    public render() {
        requestAnimationFrame(this.render.bind(this))

        this.controls.update()

        let timer = 0.0015 * Date.now()
        this.strip.position.z = 2.5 + (Math.sin(timer));
        this.strip2.position.z = 2.5 + (Math.sin(timer));

        this.strip.material = this.basicMat;

        this.renderer.setRenderTarget(this.depthTarget);
        this.renderer.render(this.scene, this.camera)

        // render post FX
        this.depthMaterial.uniforms.tDiffuse.value = this.depthTarget.texture;
        this.depthMaterial.uniforms.tDepth.value = this.depthTarget.depthTexture;

        this.renderer.setRenderTarget(this.packTarget);
        this.renderer.render(this.depthScene, this.depthCamera);

        this.depthReadMaterial.uniforms.tDepth.value = this.packTarget.texture;

        this.strip.material = this.depthReadMaterial;

        this.renderer.setRenderTarget(null);
        this.renderer.render(this.scene, this.camera);
    }
}



