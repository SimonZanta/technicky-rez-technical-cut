import { inject, Injectable, signal } from '@angular/core';
import * as THREE from 'three';
import { BufferGeometry } from 'three';
import { SlicerService } from '../../slicer/service/slicer.service';
import { MaterialService } from './material.service';
import { BVHGeometryService } from './BVHGeometry.service';
import { ModelLoaderService } from './modelLoader.service';

@Injectable({
  providedIn: 'root'
})
export class GeometryService {
  slicerService = inject(SlicerService);
  materialService = inject(MaterialService);
  bvhGeometryService = inject(BVHGeometryService);
  modelLoaderService = inject(ModelLoaderService)

  public readonly geometry = signal<THREE.Group>(new THREE.Group());
  public readonly slicerGeometries: THREE.Mesh[] = [];

  async initGeometry() {
    //plane refactor
    this.createSlicerGeometry(new THREE.PlaneGeometry(1200, 1200))


    this.materialService.initMaterial(new THREE.Vector4(0, 0, 1, 0))
    // this.createObjectGeometry(new THREE.SphereGeometry(1))
    // this.createObjectGeometry(new THREE.BoxGeometry(1, 1, 1))
    await this.modelLoaderService.loadOBJModel('assets/models/robotical-arm.obj').then((object) => {
      this.geometry().add(object);
    })
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
