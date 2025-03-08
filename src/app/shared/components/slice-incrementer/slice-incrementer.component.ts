import { Component, computed, effect, inject, model, signal } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GeometryService } from '../../../features/engine/service/geometry.service';
import * as THREE from 'three';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-slice-incrementer',
  standalone: true,
  imports: [MatSliderModule, FormsModule, MatIcon, MatTooltipModule],
  templateUrl: './slice-incrementer.component.html',
  styleUrl: './slice-incrementer.component.scss'
})
export class SliceIncrementerComponent {

  geometryService = inject(GeometryService);

  min = model<number>(-1)
  max = model<number>(1)

  step = computed<number>(() => {
    // return Math.max(this.min(), this.max()) - Math.min(this.min(), this.max())
    return 0.01
  })

  slice = 0.0;
  lastPos = signal<number>(0.0);

  thumbLabel = false

  updateSlice() {
    const newPos = new THREE.Vector3(0.0, 0.0, this.slice);
    this.geometryService.updateSlicerPosition(newPos);
  }

  updateShowingLabel(updateWay: 'down' | 'up') {
    switch (updateWay) {
      case 'down':
        this.thumbLabel = true
        break;
      case 'up':
        setTimeout(() => {
          this.thumbLabel = false
        }, 500);
        break
    }
  }
}
