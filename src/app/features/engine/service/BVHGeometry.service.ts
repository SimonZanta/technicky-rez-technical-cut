import { inject, Injectable } from '@angular/core';
import * as THREE from 'three';
import standartMeshMaterialVertex from '../shaders/slicerShader/standartMeshMaterialVertex.glsl'
import standartMeshMaterialFragment from '../shaders/slicerShader/standartMeshMaterialFragment.glsl'
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
    stencilFunc: THREE.AlwaysStencilFunc,
    stencilRef: 0,
    stencilZPass: THREE.ReplaceStencilOp
  });

  private backMaterial = new THREE.MeshStandardMaterial({
    color: 0x00ff00,
    side: THREE.BackSide,
    clippingPlanes: [],
    stencilWrite: true,
    stencilFunc: THREE.AlwaysStencilFunc,
    stencilRef: 1,
    stencilZPass: THREE.ReplaceStencilOp
  });

  public capMaterial = new THREE.ShaderMaterial({
    vertexShader: standartMeshMaterialVertex,
    fragmentShader: standartMeshMaterialFragment,
    uniforms: {
      u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      clippingPlane: { value: null },
      hasLines: { value: 1. }
    },
    clippingPlanes: [],
    side: THREE.DoubleSide,
    stencilWrite: true,
    stencilFunc: THREE.EqualStencilFunc,
    stencilRef: 1,
  });


  init(clippingPlane: THREE.Plane) {
    this.clippingPlane = clippingPlane

    this.backMaterial.clippingPlanes?.push(this.clippingPlane)
    this.frontMaterial.clippingPlanes?.push(this.clippingPlane)
  }

  getGeometryBVH(geometry: THREE.BufferGeometry) {
    if (!this.clippingPlane) throw Error('no clipping plane')

    const finalGeom: BVHGeom = {
      front: new THREE.Mesh(geometry, this.frontMaterial),
      back: new THREE.Mesh(geometry, this.backMaterial),
    }

    this.bvhGeometrie.push(finalGeom)

    return finalGeom
  }

  public updateClipPlaneForGeometries(clipPlane: THREE.Plane) {
    this.frontMaterial.clippingPlanes = [clipPlane]
    this.backMaterial.clippingPlanes = [clipPlane]

    // this.frontMaterial.uniforms['clippingPlane'].value = this.slicerService.getSlicerAsVector(clipPlane)
    // this.backMaterial.uniforms['clippingPlane'].value = this.slicerService.getSlicerAsVector(clipPlane)

    this.bvhGeometrie.forEach(geom => {
      geom.front.material = this.frontMaterial
      geom.back.material = this.backMaterial
    })
  }

  public updateClipPlane(plane: THREE.Plane) {
    this.clippingPlane = plane
    this.updateClipPlaneForGeometries(this.clippingPlane)
  }
}
