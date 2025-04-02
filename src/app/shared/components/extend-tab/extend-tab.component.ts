import { ChangeDetectionStrategy, Component, input, model, signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-extend-tab',
  standalone: true,
  imports: [MatIcon, MatIconButton],
  templateUrl: './extend-tab.component.html',
  styleUrls: ['./extend-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExtendTabComponent { 
  isExpanded = model(true)
  isRight = input(false)
  label = input.required<string>()
}
