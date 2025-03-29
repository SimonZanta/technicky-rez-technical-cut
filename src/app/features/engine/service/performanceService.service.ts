import { AfterViewInit, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PerformanceServiceService {

  fpsStart = new Date().getTime();
  fpsCounting = 0;
  fps = signal<number>(-1);
  fpsExport = signal<{ fps: number, fpsTime: number }[]>([])
  initialTime = this.fpsStart;
  performanceRunning = signal(false)

  update(){
    if(this.performanceRunning() === false) return
      var thisFrame = new Date().getTime();
      const elapsedTime = thisFrame - this.initialTime;
      
      this.fpsCounting++;
      if (thisFrame - this.fpsStart >= 1000) {     
        this.fpsStart = thisFrame;
        this.fps.set(this.fpsCounting);
        this.fpsCounting = 0;
      }

    this.fpsExport().push({ fps: this.fps(), fpsTime: elapsedTime })
  }
}
