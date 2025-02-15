import {Component, inject, signal} from '@angular/core';
import {MatSliderModule} from '@angular/material/slider';
import {GeometryService} from '../../../features/engine/service/geometry.service';
import * as THREE from 'three';

@Component({
  selector: 'app-slice-incrementer',
  standalone: true,
  imports: [MatSliderModule],
  templateUrl: './slice-incrementer.component.html',
  styleUrl: './slice-incrementer.component.scss'
})
export class SliceIncrementerComponent {

  geometryService = inject(GeometryService);

  slice = signal<number>(0.0);
  lastPos = signal<number>(0.0);


  updateSlice(event: any) {
    const oldPos = this.geometryService.slicerGeometries.at(0)?.position;
    let newPos: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    if (oldPos) {
      if (this.lastPos() < event.target.valueAsNumber) {
        newPos = new THREE.Vector3(0.0, 0.0, oldPos.z - Math.abs(event.target.valueAsNumber));
        this.lastPos.set(event.target.valueAsNumber);
      } else {
        newPos = new THREE.Vector3(0.0, 0.0, oldPos.z + Math.abs(event.target.valueAsNumber));
        this.lastPos.set(event.target.valueAsNumber);
      }
    }
    this.geometryService.updateSlicerPosition(newPos);
  }
}
