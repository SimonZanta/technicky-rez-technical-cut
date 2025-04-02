import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { PerformanceServiceService } from '../../../features/engine/service/performanceService.service';
import { PerformanceChartComponent } from "../performance-chart/performance-chart.component";
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-performance-check',
  standalone: true,
  imports: [PerformanceChartComponent, MatButton],
  templateUrl: './performanceCheck.component.html',
  styleUrls: ['./performanceCheck.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerformanceCheckComponent{

  performance = inject(PerformanceServiceService)

  exportFps(){
    let csvContent = "data:text/csv;charset=utf-8,\n"
    + ['fps', 'time'].join(",") + "\n"
    + [...this.performance.fpsExport()].map(e => [e.fps, e.fpsTime].join(",")).join("\n");
    this.downloadBlob(csvContent, 'export.csv')
  }
  downloadBlob(content: string, filename: string) {
    // Create a blob
    var blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
  
    // Create a link to download it
    var pom = document.createElement('a');
    pom.href = url;
    pom.setAttribute('download', filename);
    pom.click();
  }
 }
