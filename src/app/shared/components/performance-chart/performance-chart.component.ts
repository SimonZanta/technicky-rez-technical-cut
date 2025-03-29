import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, signal, viewChild, ViewChild } from '@angular/core';
import { PerformanceServiceService } from '../../../features/engine/service/performanceService.service';

@Component({
  selector: 'app-performance-chart',
  standalone: true,
  imports: [],
  templateUrl: `./performance-chart.component.html`,
  styleUrl: './performance-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerformanceChartComponent {
  // @ViewChild('fpsCanvas') fpsCanvasRef!: ElementRef<HTMLCanvasElement>;
  fpsCanvasRef = viewChild<ElementRef<HTMLCanvasElement>>('fpsCanvas')
  performance = inject(PerformanceServiceService)
  

  private ctx!: CanvasRenderingContext2D;
  private fpsValues: number[] = [];
  private maxFpsValues: number = 100; // Number of values to keep in history
  
  public currentFps = signal<number>(0);
  public minFps = signal<number>(Infinity);
  public maxFps = signal<number>(0);
  public avgFps = signal<number>(0);

  chartIsLoaded = false

  public readonly INFINITY = Infinity;
  
  ngAfterViewInit(): void {
    const canvas = this.fpsCanvasRef()?.nativeElement;
    if(!canvas) return;
    this.ctx = canvas.getContext('2d')!;
    
    // Set canvas size to match its display size
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    this.chartIsLoaded = true
  }

  constructor(){
    setInterval(() => {
      if(this.performance.performanceRunning())
        this.update(this.performance.fps())
    }, 100);
  }
  
  private update(fps: number): void {
      if(!this.chartIsLoaded) return;

        // Update stats
        this.currentFps.set(fps);
        this.minFps.set(Math.min(this.minFps(), fps));
        this.maxFps.set(Math.max(this.maxFps(), fps));
        
        // Add to history and limit size
        this.fpsValues.push(fps);
        if (this.fpsValues.length > this.maxFpsValues) {
          this.fpsValues.shift();
        }
        
        // Calculate average
        this.avgFps.set(Math.round(
          this.fpsValues.reduce((sum, value) => sum + value, 0) / this.fpsValues.length
        ));
        
        // Draw chart
        this.drawChart();
  
  }
  
  private drawChart(): void {
    const canvas = this.fpsCanvasRef()?.nativeElement;

    if(!canvas) return;

    const ctx = this.ctx;
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.fillStyle = '#3A404E';
    ctx.fillRect(0, 0, width, height);
    
    if (this.fpsValues.length <= 1) return;
    
    // Draw grid lines
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines - every 30 FPS
    for (let fps = 30; fps <= 120; fps += 30) {
      const y = height - (height * (fps / 120));
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
      
      // Label
      ctx.fillStyle = '#D4D8E1';
      ctx.font = '10px Arial';
      ctx.fillText(`${fps} fps`, 5, y - 2);
    }
    
    // Find min/max for better visualization
    const maxValue = Math.min(Math.max(...this.fpsValues, 60), 120);
    
    // Draw FPS line
    ctx.strokeStyle = '#FF8C00';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    this.fpsValues.forEach((fps, index) => {
      const x = width * (index / (this.maxFpsValues - 1));
      const y = height - (height * (Math.min(fps, 120) / 120));
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    // Draw danger zone (below 30 FPS)
    ctx.fillStyle = 'rgba(244, 67, 54, 0.1)';
    const y30fps = height - (height * (30 / 120));
    ctx.fillRect(0, y30fps, width, height - y30fps);
  }
 }
