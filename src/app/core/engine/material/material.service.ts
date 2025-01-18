import { inject, Injectable, signal } from '@angular/core';
import vertexShader from '../shaders/vertexShader.glsl'
import fragmentShader from '../shaders/fragmentShader.glsl'
import * as THREE from 'three';
import { SlicerService } from '../slicer/slicer.service';
import { GeometryService } from '../geometry/geometry.service';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  slicerService = inject(SlicerService);

  public readonly material = signal<THREE.ShaderMaterial>(new THREE.ShaderMaterial());

  initMaterial(slicePlane: THREE.Vector4){
    this.material.set(new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        slicePlane: { value: slicePlane }
      }
    }));
  }

  updateMaterial(position: THREE.Vector3, geometry: THREE.Mesh[]){
    this.material.update(material => {
      material.uniforms['slicePlane'].value = this.slicerService.setSlicePlane(position);
      return material;
  });
    this.updateGeometryMaterial(geometry);
  }

  updateGeometryMaterial(geometry: THREE.Mesh[]){
    geometry.forEach(mesh => {
      mesh.material = this.material();
    });
  }
}
