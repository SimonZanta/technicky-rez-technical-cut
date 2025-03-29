import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EngineComponent } from "./features/engine/component/engine.component";
import { SliceIncrementerComponent } from "./shared/components/slice-incrementer/slice-incrementer.component";
import { SlicerService } from './features/slicer/service/slicer.service';
import { ProgressSpinnerMode, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ModelLoaderService } from './features/engine/service/modelLoader.service';
import { GetLoadingPercentLabelPipe } from "./shared/pipes/getLoadingPercentLabel.pipe";
import { PerformanceCheckComponent } from "./shared/components/performanceCheck/performanceCheck.component";
import { PerformanceChartComponent } from "./shared/components/performance-chart/performance-chart.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, EngineComponent, SliceIncrementerComponent, MatProgressSpinnerModule, GetLoadingPercentLabelPipe, PerformanceCheckComponent, PerformanceChartComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  slicerService = inject(SlicerService)
  modelLoaderService = inject(ModelLoaderService)

  title = 'technicky_rez';
  mode: ProgressSpinnerMode = 'determinate';
}
