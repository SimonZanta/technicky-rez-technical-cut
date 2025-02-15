import {inject, Injectable} from '@angular/core';
import * as THREE from 'three';
import {BufferGeometry} from 'three';
import {SlicerService} from '../../slicer/service/slicer.service';
import {MaterialService} from './material.service';

@Injectable({
  providedIn: 'root'
})
export class GeometryService {
  slicerService = inject(SlicerService);
  materialService = inject(MaterialService);

  public readonly geometry: THREE.Mesh[] = [];
  public readonly slicerGeometries: THREE.Mesh[] = [];

  initGeometry() {
    //plane refactor
    this.createSlicerGeometry(new THREE.PlaneGeometry(0.2, 0.2))

    this.materialService.initMaterial(new THREE.Vector4(0, 0, 1, 0))
    this.createObjectGeometry(new THREE.BoxGeometry(1, 1, 1))
    this.createObjectGeometry(new THREE.BoxGeometry(0.5, 0.5, 0.5))
  }

  createObjectGeometry(object: BufferGeometry) {
    const geometry = object;
    const mesh = new THREE.Mesh(geometry, this.materialService.material());
    this.geometry.push(mesh);
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
    const slicerPlane = this.slicerService.slicerPlanes.at(0)
    if (slicer && slicerPlane) {
      slicer.position.set(position.x, position.y, position.z);
      this.slicerService.setSlicerPlanePosition(slicerPlane, position)
    }
  }
}
