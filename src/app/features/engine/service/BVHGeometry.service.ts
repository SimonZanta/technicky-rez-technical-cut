import { inject, Injectable } from '@angular/core';
import * as THREE from 'three';
import standartMeshMaterialVertex from '../shaders/slicerShader/standartMeshMaterialVertex.glsl'
import standartMeshMaterialFragment from '../shaders/slicerShader/standartMeshMaterialFragment.glsl'
import { SlicerService } from '../../slicer/service/slicer.service';

@Injectable({
  providedIn: 'root'
})
export class BVHGeometryService {
  //https://github.com/gkjohnson/three-mesh-bvh/blob/master/example/clippedEdges.js
  //https://github.com/gkjohnson/three-mesh-bvh

  slicerService = inject(SlicerService)

  bvhGeometrie: { model: THREE.Mesh, cap: THREE.Mesh }[] = []

  private clippingPlane: THREE.Plane;
  frontModel: THREE.Mesh;
  backModel: THREE.Mesh;

  private frontMaterial = new THREE.ShaderMaterial({
    vertexShader: standartMeshMaterialVertex,
    fragmentShader: standartMeshMaterialFragment,
    uniforms: {
      clippingPlane: { value: null },
      u_color: { value: new THREE.Color(0xff00ff) }
    },
    side: THREE.FrontSide,
    clippingPlanes: [],
    stencilWrite: true,
    stencilFunc: THREE.AlwaysStencilFunc,
    stencilRef: 1,
    stencilZPass: THREE.IncrementWrapStencilOp
  });

  private backMaterial = new THREE.ShaderMaterial({
    vertexShader: standartMeshMaterialVertex,
    fragmentShader: standartMeshMaterialFragment,
    uniforms: {
      clippingPlane: { value: null },
      u_color: { value: new THREE.Color(0x00ff00) }
    },
    side: THREE.BackSide,
    clippingPlanes: [],
    stencilWrite: true,
    stencilFunc: THREE.AlwaysStencilFunc,
    stencilRef: 1,
    stencilZPass: THREE.DecrementWrapStencilOp
  });

  init(clippingPlane: THREE.Plane) {
    this.clippingPlane = clippingPlane

    this.backMaterial.uniforms['clippingPlane'].value = this.slicerService.getSlicerAsVector()
    this.frontMaterial.uniforms['clippingPlane'].value = this.slicerService.getSlicerAsVector()

    this.backMaterial.clippingPlanes?.push(this.clippingPlane)
    this.frontMaterial.clippingPlanes?.push(this.clippingPlane)
  }

  getGeometryBVH(geometry: THREE.BufferGeometry) {
    if (!this.clippingPlane) throw Error('no clipping plane')

    const finalGeom = { model: new THREE.Mesh(geometry, this.frontMaterial), cap: new THREE.Mesh(geometry, this.backMaterial) }

    this.bvhGeometrie.push(finalGeom)

    return finalGeom
  }

  public updateClipPlaneForGeometries(clipPlane: THREE.Plane) {
    this.frontMaterial.clippingPlanes = [clipPlane]
    this.backMaterial.clippingPlanes = [clipPlane]

    this.frontMaterial.uniforms['clippingPlane'].value = this.slicerService.getSlicerAsVector(clipPlane)
    this.backMaterial.uniforms['clippingPlane'].value = this.slicerService.getSlicerAsVector(clipPlane)

    this.bvhGeometrie.forEach(geom => {
      geom.model.material = this.frontMaterial
      geom.cap.material = this.backMaterial
    })
  }

  public updateClipPlane(plane: THREE.Plane) {
    this.clippingPlane = plane
    this.updateClipPlaneForGeometries(this.clippingPlane)
  }
}
