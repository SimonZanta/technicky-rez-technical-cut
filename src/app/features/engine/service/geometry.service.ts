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
    this.createSlicerGeometry(new THREE.PlaneGeometry(0.2, 0.2))

    this.materialService.initMaterial(new THREE.Vector4(0, 0, 1, 0))
    // const points = [];
    // for (let i = 0; i < 10; i++) {
    //   points.push(new THREE.Vector2(Math.sin(i * 0.2) * 10 + 5, (i - 5) * 2));
    // }
    // this.createObjectGeometry(new THREE.LatheGeometry(points))
    this.createObjectGeometry(new THREE.SphereGeometry(1))
    // this.createObjectGeometry(new THREE.BoxGeometry(1, 1, 1))
    // this.createObjectGeometry(new THREE.BoxGeometry(0.5, 0.5, 0.5))
  }

  createObjectGeometry(object: BufferGeometry) {
    const geometry = object;
    this.geometry.push(geometry);
  }

  createSlicerGeometry(object: BufferGeometry) {
    const geometry = object;
    const material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      wireframe: true
    });

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
