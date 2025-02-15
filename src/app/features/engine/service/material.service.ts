import {inject, Injectable, signal} from '@angular/core';
import vertexShader from '../shaders/slicerShader/vertexShader.glsl'
import fragmentShader from '../shaders/slicerShader/fragmentShader.glsl'
import * as THREE from 'three';
import {SlicerService} from '../../slicer/service/slicer.service';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  slicerService = inject(SlicerService);

  public readonly material = signal<THREE.ShaderMaterial>(new THREE.ShaderMaterial());

  initMaterial(slicePlane: THREE.Vector4) {
    this.material.set(new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: THREE.FrontSide,
      uniforms: {
        slicePlane: {value: slicePlane}
      },
      clippingPlanes: [this.slicerService.slicerPlane],
      clipping: true,
    }));
  }
}
