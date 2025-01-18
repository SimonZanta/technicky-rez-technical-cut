import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EngineComponent } from "./core/engine/engine.component";
import { SliceIncrementerComponent } from "./core/ui/slice-incrementer/slice-incrementer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, EngineComponent, SliceIncrementerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'technicky_rez';
}
