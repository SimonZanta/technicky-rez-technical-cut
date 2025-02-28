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
    this.createSlicerGeometry(new THREE.PlaneGeometry(1200, 1200))


    this.materialService.initMaterial(new THREE.Vector4(0, 0, 1, 0))
    // this.createObjectGeometry(new THREE.SphereGeometry(1))
    this.createObjectGeometry(new THREE.BoxGeometry(1, 1, 1))
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
      // console.log(geometryGroup);
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
      const geometryBVH: stencilGeometry = this.bvhGeometryService.getGeometryBVH(geometry);
      group.add(geometryBVH.front, geometryBVH.back);
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

  createSlicerGeometry(object: BufferGeometry) {
    const geometry = object;

    const material = this.bvhGeometryService.capMaterial


    const mesh = new THREE.Mesh(geometry, material);

    this.slicerGeometries.push(mesh);
  }

  updateSlicerPosition(position: THREE.Vector3) {
    const slicer = this.slicerGeometries.at(0);
    const slicerPlane = this.slicerService.slicerPlane
    if (slicer && slicerPlane) {
      slicer.position.set(position.x, position.y, position.z);
      this.slicerService.setSlicerPlanePosition(slicerPlane, position)
    }
  }
}
