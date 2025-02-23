import { inject, Injectable } from '@angular/core';
import * as THREE from 'three';
import standartMeshMaterialVertex from '../shaders/slicerShader/standartMeshMaterialVertex.glsl'
import standartMeshMaterialFragment from '../shaders/slicerShader/standartMeshMaterialFragment.glsl'
import vertexShader from '../shaders/slicerShader/vertexShader.glsl'
import fragmentShader from '../shaders/slicerShader/fragmentShader.glsl'
import { SlicerService } from '../../slicer/service/slicer.service';

class BVHGeom {
  front: THREE.Mesh;
  back: THREE.Mesh;
}
@Injectable({
  providedIn: 'root'
})
export class BVHGeometryService {
  //https://github.com/gkjohnson/three-mesh-bvh/blob/master/example/clippedEdges.js
  //https://github.com/gkjohnson/three-mesh-bvh

  slicerService = inject(SlicerService)

  bvhGeometrie: BVHGeom[] = []

  private clippingPlane: THREE.Plane;
  frontModel: THREE.Mesh;
  backModel: THREE.Mesh;

  private frontMaterial = new THREE.MeshStandardMaterial({
    color: 0x0000ff,
    side: THREE.FrontSide,
    clippingPlanes: [],
    stencilWrite: true,
    stencilFail: THREE.IncrementWrapStencilOp,
    stencilZFail: THREE.IncrementWrapStencilOp,
    stencilZPass: THREE.IncrementWrapStencilOp,
  });

  private backMaterial = new THREE.MeshStandardMaterial({
    color: 0x00ff00,
    side: THREE.BackSide,
    clippingPlanes: [],
    colorWrite: false,
    depthWrite: false,
    stencilWrite: true,
    stencilFail: THREE.DecrementWrapStencilOp,
    stencilZFail: THREE.DecrementWrapStencilOp,
    stencilZPass: THREE.DecrementWrapStencilOp,
  });

  public capMaterial = new THREE.ShaderMaterial({
    vertexShader: standartMeshMaterialVertex,
    fragmentShader: standartMeshMaterialFragment,
    uniforms: {
      u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      clippingPlane: { value: null },
      hasLines: { value: 1. }
    },
    side: THREE.DoubleSide,
    stencilWrite: true,
    stencilFunc: THREE.NotEqualCompare,
    stencilFail: THREE.ZeroStencilOp,
    stencilZFail: THREE.ZeroStencilOp,
    stencilZPass: THREE.ZeroStencilOp,
  });

  init(clippingPlane: THREE.Plane) {
    this.clippingPlane = clippingPlane

    this.backMaterial.clippingPlanes?.push(this.clippingPlane)
    this.frontMaterial.clippingPlanes?.push(this.clippingPlane)
  }

  getGeometryBVH(geometry: THREE.Mesh) {
    if (!this.clippingPlane) throw Error('no clipping plane')

    const front = new THREE.Mesh;
    front.copy(geometry)
    front.material = this.frontMaterial

    const back = new THREE.Mesh;
    back.copy(geometry)
    back.material = this.backMaterial

    const finalGeom: BVHGeom = {
      front: front,
      back: back,
    }

    return finalGeom
  }
}
