import { inject, Injectable, signal } from '@angular/core';
import * as THREE from 'three';
import { BufferGeometry } from 'three';
import { SlicerService } from '../../slicer/service/slicer.service';
import { MaterialService } from './material.service';
import { BVHGeometryService, stencilGeometry } from './BVHGeometry.service';
import { ModelLoaderService } from './modelLoader.service';

class stencilGeometryGroup {
  groupName: string;
  geometry: stencilGeometry | stencilGeometryGroup
}
@Injectable({
  providedIn: 'root'
})
export class GeometryService {
  slicerService = inject(SlicerService);
  materialService = inject(MaterialService);
  bvhGeometryService = inject(BVHGeometryService);
  modelLoaderService = inject(ModelLoaderService)

  public readonly geometry = signal<THREE.Group>(new THREE.Group());
  public readonly stencilGeometry = signal<THREE.Group>(new THREE.Group);
  public readonly slicerGeometries: THREE.Mesh[] = [];

  async initGeometry() {
    //plane refactor
    this.materialService.initMaterial(new THREE.Vector4(0, 0, 1, 0))

    // this.createObjectGeometry(new THREE.SphereGeometry(1))
    // this.createObjectGeometry(new THREE.BoxGeometry(1, 1, 1))

    await this.modelLoaderService.loadOBJModel('assets/models/robotical-arm.obj').then((object) => {
      const tempGroup = new THREE.Group()
      tempGroup.add(object)
      this.geometry().add(tempGroup);
    })

    this.stencilGeometry.set(this.getStencilBufferedGeometryFromObject(this.geometry()))
  }

  getStencilBufferedGeometryFromObject(geometry: THREE.Group) {
    const group: THREE.Group = new THREE.Group();
    group.name = geometry.name;

    geometry.children.forEach(object => {
      const geometryGroup = this.recursiveGeometryAdding(object);
      if (geometryGroup) {
        group.add(geometryGroup);
      }
    });

    return group;
  }

  recursiveGeometryAdding(geometry: THREE.Object3D) {
    const group = new THREE.Group();
    group.name = geometry.name;

    if (geometry instanceof THREE.Mesh) {
      // create plane geometry
      const objBoundingBox = new THREE.Box3().setFromObject(geometry);

      const plane = this.getSlicerPlaneGeometryFromMesh(objBoundingBox)
      const geometryBVH: stencilGeometry = this.bvhGeometryService.getGeometryBVH(geometry, plane);

      const cap = geometryBVH.cap

      const boundingPosition = objBoundingBox.getCenter(new THREE.Vector3())
      const planeZ = this.slicerService.getSlicerAsVector().z

      cap.position.set(boundingPosition.x, boundingPosition.y, 0)

      group.add(geometryBVH.front, geometryBVH.back);
      this.slicerGeometries.push(cap)

    } else if (geometry instanceof THREE.Group) {
      geometry.children.forEach(subGeometry => {
        const childGroup = this.recursiveGeometryAdding(subGeometry);
        if (childGroup) {
          group.add(childGroup);
        }
      });
    }

    if (group.children.length === 0) return null;
    return group;
  }

  createObjectGeometry(object: BufferGeometry) {
    const geometry = new THREE.Mesh(object);
    this.geometry().add(geometry);
  }

  getSlicerPlaneGeometryFromMesh(object: THREE.Box3) {
    const boundingBox = object
    const boundingSize = boundingBox.getSize(new THREE.Vector3())

    const tempBoundingWidth = boundingSize.x;
    const tempBoundingHeight = boundingSize.y;

    return new THREE.PlaneGeometry(tempBoundingWidth, tempBoundingHeight)
  }

  updateSlicerPosition(position: THREE.Vector3) {
    const slicerPlane = this.slicerService.slicerPlane

    this.slicerGeometries.forEach(slicer => {
      slicer.position.set(slicer.position.x, slicer.position.y, position.z);
    })

    this.slicerService.setSlicerPlanePosition(slicerPlane, position)
  }
}
