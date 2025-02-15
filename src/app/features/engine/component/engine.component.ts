import {AfterViewInit, Component, ElementRef, inject, NgZone, viewChild} from '@angular/core';
import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import {MapControls, OrbitControls} from 'three/examples/jsm/Addons.js';
import {CameraService} from '../../../core/services/camera.service';
import {GeometryService} from '../service/geometry.service';
import {MaterialService} from '../service/material.service';
import {SlicerService} from "../../slicer/service/slicer.service";
import { BVHGeomTest } from '../service/BVHGeomTest.service';


@Component({
  selector: 'app-engine',
  standalone: true,
  imports: [],
  templateUrl: './engine.component.html',
})
export class EngineComponent implements AfterViewInit {
  // implemented using https://github.com/JohnnyDevNull/ng-three-template

  cameraService = inject(CameraService)
  geometryService = inject(GeometryService)
  materialService = inject(MaterialService)
  slicerService = inject(SlicerService)
  bvhGeomTest = inject(BVHGeomTest)

  public mainCanvas = viewChild.required<ElementRef>('mainCanvas')
  public camera!: THREE.PerspectiveCamera | THREE.OrthographicCamera
  // exclamation mark mean no null assertion for TS
  private scene!: THREE.Scene
  private renderer!: THREE.WebGLRenderer
  private canvas!: HTMLCanvasElement
  private light!: THREE.AmbientLight
  private controls!: MapControls
  private frameId = 0

  constructor(private ngZone: NgZone) {
  }

  ngAfterViewInit() {
    if (WebGL.isWebGL2Available()) {
      this.initScene()
      this.animate();
    } else {
      const warning = WebGL.getWebGL2ErrorMessage();
      console.log(warning)
    }
  }

  // TODO refactor
  public animate(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      if (document.readyState !== 'loading') {
        this.render();
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          this.controls.update()
          this.render();
        });
      }
      window.addEventListener('resize', () => {
        // if (this.camera instanceof THREE.PerspectiveCamera) {
        //   this.cameraService.resizePerspectiveCamera(this.camera as THREE.PerspectiveCamera, this.renderer);
        // }
      });
    });
  }

  public render(): void {
    this.frameId = requestAnimationFrame(() => {
      this.render();
    });

     // Animate clip plane
     const time = Date.now() * 0.001;
     this.bvhGeomTest.updateClipPlane(
         new THREE.Vector3(Math.sin(time), Math.cos(time), 0),
         0
     );


    this.renderer.localClippingEnabled = true;
    this.renderer.render(this.scene, this.camera);
  }

  // TODO: add cameras to services
  public preparePerspectiveCamera(): THREE.PerspectiveCamera {
    //TODO: change camera values to variables
    // FOV, aspectRation, near, far
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    this.camera.position.z = 5
    return this.camera
  }

// TODO end of refactor

  public prepareOrthographicCamera(): THREE.OrthographicCamera {
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000)
    this.camera.position.z = 5
    return this.camera
  }

  prepareGeometry() {
    this.geometryService.initGeometry()
    this.geometryService.geometry.forEach(geometry => {
      // geometry.setRotationFromEuler(new THREE.Euler(0.25, 0, 0))
      this.scene.add(geometry)
    })

    this.geometryService.slicerGeometries.forEach(slicer => this.scene.add(slicer))
  }

  prepareMaterial() {
    this.materialService.initMaterial(new THREE.Vector4(0, 0, 1, 0))
  }

  prepareSlicers() {
    this.slicerService.initSlicerPlanes()
  }

  prepareTestBVH(){
    this.bvhGeomTest.init()
    this.scene.add(this.bvhGeomTest.frontModel, this.bvhGeomTest.backModel, this.bvhGeomTest.outlineLines)
  }

  protected initScene() {
    // set canvas
    this.canvas = this.getCanvas()

    // set renderer
    this.prepareRenderer()

    // prepare scene
    this.prepareScene()

    // prepare camera
    this.preparePerspectiveCamera()

    // register camera
    this.scene.add(this.camera)

    // prepare controls
    this.prepareControls()

    // init initial ambient light
    this.prepareLight()

    // register new light
    this.scene.add(this.light)

    // this.prepareSlicers()

    // prepare material
    // this.prepareMaterial()

    // simple geometry loader
    // this.prepareGeometry()

    this.prepareTestBVH()
  }

  protected getCanvas() {
    return this.mainCanvas().nativeElement
  }

  protected prepareRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true, // sets transparency
      antialias: true, // sets antialiasing
      stencil: true // sets stencil buffer
    })

    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // enable clipping using clipping planes
    this.renderer.localClippingEnabled = true;
  }

  protected prepareScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000)
  }

  protected prepareControls() {
    // https://threejs.org/docs/#examples/en/controls/OrbitControls.update
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.mouseButtons = {LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.ROTATE, RIGHT: THREE.MOUSE.DOLLY}
    this.controls.minDistance = 0.1;
    this.controls.maxDistance = 1000;
    this.controls.maxPolarAngle = Math.PI / 2;
  }

  protected prepareLight() {
    // TODO: add factory for adding multiple lights
    this.light = new THREE.AmbientLight()
    this.light.position.z = 10
  }

}
