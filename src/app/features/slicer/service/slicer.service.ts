import {Injectable} from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class SlicerService {
  //https://threejs.org/examples/?q=sli#webgpu_tsl_angular_slicing
  // slicing is showed in docs\slicing_using_fragment_shader_GPT.md

  public readonly slicerPlanes: THREE.Plane[] = []

  initSlicerPlanes() {
    this.slicerPlanes.push(this.getSlicerPlane())
  }

  getSlicerPlane(position?: THREE.Vector3) {
    const planeVector = this.getSlicerVector4(position)
    return new THREE.Plane(new THREE.Vector3(planeVector.normalX, planeVector.normalY, planeVector.normalZ), planeVector.d);
  }

  getSlicerVector4(position?: THREE.Vector3) {
    const normal = new THREE.Vector3(0, 0, 1);
    const d = -normal.dot(position ?? new THREE.Vector3(0, 0, 0));

    return {normalX: normal.x, normalY: normal.y, normalZ: normal.z, d}
  }

  setSlicerPlanePosition(slicerPlane: THREE.Plane, position: THREE.Vector3) {
    const planeVector = this.getSlicerVector4(position)
    this.slicerPlanes.at(0)!.set(new THREE.Vector3(planeVector.normalX, planeVector.normalY, planeVector.normalZ), planeVector.d)
  }
}
