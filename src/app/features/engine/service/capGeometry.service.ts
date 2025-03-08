import { inject, Injectable } from '@angular/core';
import * as THREE from 'three';
import standartMeshMaterialVertex from '../shaders/slicerShader/standartMeshMaterialVertex.glsl'
import standartMeshMaterialFragment from '../shaders/slicerShader/standartMeshMaterialFragment.glsl'
import vertexShader from '../shaders/slicerShader/vertexShader.glsl'
import fragmentShader from '../shaders/slicerShader/fragmentShader.glsl'
import { SlicerService } from '../../slicer/service/slicer.service';

export class stencilGeometry {
  front: THREE.Mesh;
  back: THREE.Mesh;
  cap: THREE.Mesh;
}
@Injectable({
  providedIn: 'root'
})
export class CapGeometryService {
  //https://github.com/gkjohnson/three-mesh-bvh/blob/master/example/clippedEdges.js
  //https://github.com/gkjohnson/three-mesh-bvh

  slicerService = inject(SlicerService)


  private clippingPlane: THREE.Plane;
  frontModel: THREE.Mesh;
  backModel: THREE.Mesh;

  init(clippingPlane: THREE.Plane) {
    this.clippingPlane = clippingPlane
  }

  getGeometryBVH(geometry: THREE.Mesh, capPlane: THREE.PlaneGeometry) {
    if (!this.clippingPlane) throw Error('no clipping plane')


    const frontMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: THREE.FrontSide,
      clippingPlanes: [this.clippingPlane],
      clipping: true,
      stencilWrite: true,
      stencilFail: THREE.IncrementWrapStencilOp,
      stencilZFail: THREE.IncrementWrapStencilOp,
      stencilZPass: THREE.IncrementWrapStencilOp,
    });

    const backMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: THREE.BackSide,
      clippingPlanes: [this.clippingPlane],
      clipping: true,
      stencilWrite: true,
      stencilFail: THREE.DecrementWrapStencilOp,
      stencilZFail: THREE.DecrementWrapStencilOp,
      stencilZPass: THREE.DecrementWrapStencilOp,
    });

    const cap = new THREE.Mesh(capPlane)
    let measure = new THREE.Vector3();
    let box = new THREE.Box3().setFromObject(cap).getSize(measure);

    const capMaterial = new THREE.ShaderMaterial({
      vertexShader: standartMeshMaterialVertex,
      fragmentShader: standartMeshMaterialFragment,
      uniforms: {
        u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        clippingPlane: { value: null },
        objectSize: { value: new THREE.Vector2(measure.x, measure.y) },
        lineWidth: { value: 0.05 },
        lineAngle: { value: Math.PI / 4 },
        hasLines: { value: 1. }
      },
      side: THREE.DoubleSide,
      stencilWrite: true,
      stencilFunc: THREE.NotEqualCompare,
      stencilFail: THREE.ZeroStencilOp,
      stencilZFail: THREE.ZeroStencilOp,
      stencilZPass: THREE.ZeroStencilOp,
    });

    const front = new THREE.Mesh;
    front.copy(geometry)
    front.material = frontMaterial

    const back = new THREE.Mesh;
    back.copy(geometry)
    back.material = backMaterial

    cap.material = capMaterial

    const finalGeom: stencilGeometry = {
      front: front,
      back: back,
      cap: cap
    }

    return finalGeom
  }
}
