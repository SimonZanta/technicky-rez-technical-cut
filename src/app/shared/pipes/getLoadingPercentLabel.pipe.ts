import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'appGetLoadingPercentLabel',
  standalone: true,
})
export class GetLoadingPercentLabelPipe implements PipeTransform {

  transform(value: number): string {
    let valueRoudned = Math.round(value).toString()

    if (value % 1 !== 0) {
      valueRoudned = value.toFixed(2)
    }
    return `${valueRoudned}%`;
  }

}
