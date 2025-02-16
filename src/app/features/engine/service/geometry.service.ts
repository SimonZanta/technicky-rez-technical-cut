import { inject, Injectable } from '@angular/core';
import * as THREE from 'three';
import { BufferGeometry } from 'three';
import { SlicerService } from '../../slicer/service/slicer.service';
import { MaterialService } from './material.service';
import { BVHGeometryService } from './BVHGeometry.service';

@Injectable({
  providedIn: 'root'
})
export class GeometryService {
  slicerService = inject(SlicerService);
  materialService = inject(MaterialService);
  bvhGeometryService = inject(BVHGeometryService)

  public readonly geometry: THREE.BufferGeometry[] = [];
  public readonly slicerGeometries: THREE.Mesh[] = [];

  initGeometry() {
    //plane refactor
    this.createSlicerGeometry(new THREE.PlaneGeometry(10, 10))


    this.materialService.initMaterial(new THREE.Vector4(0, 0, 1, 0))
    this.createObjectGeometry(new THREE.SphereGeometry(1))
    // this.createObjectGeometry(new THREE.BoxGeometry(1, 1, 1))
  }

  createObjectGeometry(object: BufferGeometry) {
    const geometry = object;
    geometry.rotateY(0.4)
    this.geometry.push(geometry);
  }

  createSlicerGeometry(object: BufferGeometry) {
    const geometry = object;
    // const material = new THREE.ShaderMaterial({
    //   side: THREE.DoubleSide,
    //   wireframe: true
    // });

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
      this.bvhGeometryService.updateClipPlane(slicerPlane)
    }
  }
}
