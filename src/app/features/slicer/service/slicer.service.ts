import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class SlicerService {
  //https://threejs.org/examples/?q=sli#webgpu_tsl_angular_slicing
  // slicing is showed in docs\slicing_using_fragment_shader_GPT.md

  public slicerPlane: THREE.Plane

  initSlicerPlanes() {
    this.slicerPlane = this.getSlicerPlane()
  }

  getSlicerPlane(position?: THREE.Vector3) {
    const planeVector = this.getSlicerVector4(position)
    return new THREE.Plane(new THREE.Vector3(planeVector.normalX, planeVector.normalY, planeVector.normalZ), planeVector.d);
  }

  getSlicerVector4(position?: THREE.Vector3) {
    const normal = new THREE.Vector3(0, 0, 1);
    const d = -normal.dot(position ?? new THREE.Vector3(0, 0, 0));

    return { normalX: normal.x, normalY: normal.y, normalZ: normal.z, d }
  }

  setSlicerPlanePosition(slicerPlane: THREE.Plane, position: THREE.Vector3) {
    const planeVector = this.getSlicerVector4(position)
    this.slicerPlane!.set(new THREE.Vector3(planeVector.normalX, planeVector.normalY, planeVector.normalZ), planeVector.d)
  }

  getSlicerPlaneForSlicing(): THREE.Plane {

    const plane = this.slicerPlane
    if (plane === undefined) throw Error('plane is undefined')

    return plane
  }

  getSlicerAsVector(plane?: THREE.Plane): THREE.Vector3 {
    const currentPlane = plane ?? this.slicerPlane

    if (!currentPlane) throw Error('no plane to return as vector')

    return new THREE.Vector3(currentPlane.normal.x, currentPlane.normal.y, currentPlane.normal.z)
  }

  setPositionFromSlicer(object: THREE.Mesh) {
    const planePosition = this.getSlicerAsVector()
    object.position.set(planePosition.x, planePosition.y, planePosition.z)
  }
}
