import { Injectable } from '@angular/core';
import { BufferGeometry } from 'three';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class SlicerService {
  //https://threejs.org/examples/?q=sli#webgpu_tsl_angular_slicing
  // slicing is showed in docs\slicing_using_fragment_shader_GPT.md

  setSlicePlane(position: THREE.Vector3){
    // Calculate plane equation (ax + by + cz + d = 0)
    console.log(position);
    const normal = new THREE.Vector3(0, 0, 1);
    const d = -normal.dot(position);

    return new THREE.Vector4(normal.x, normal.y, normal.z, d);
  }

  g

  // createSlicerGeometry(position?: THREE.Vector3){
  //   const slicePlane = this.setSlicePlane(position ?? new THREE.Vector3(0, 0, 0))

  //   const material = new THREE.ShaderMaterial({
  //    side: THREE.DoubleSide,
  //    clipping: true
  //   });

  //   const mesh = new THREE.Mesh(geometry, material);
  //   this.slicers.push(mesh);
  // }
}
