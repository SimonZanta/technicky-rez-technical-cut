import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
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
  protected isExpanded = signal(true)
  isRight = input(false)
  label = input.required<string>()
}
