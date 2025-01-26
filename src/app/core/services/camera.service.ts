import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  public camera!: THREE.PerspectiveCamera | THREE.OrthographicCamera
 
}
