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

  initGeometry(){
    this.createObjectGeometry(new THREE.BoxGeometry(1, 1, 1))
    this.createObjectGeometry(new THREE.BoxGeometry(0.5, 0.5, 0.5))
  }

  createObjectGeometry(object: BufferGeometry){
    const mesh = new THREE.Mesh(object, this.materialService.material());
    this.geometry.push(mesh);
  }


}
