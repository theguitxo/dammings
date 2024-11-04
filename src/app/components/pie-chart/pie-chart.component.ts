import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  Renderer2,
  ViewChild,
  inject,
} from '@angular/core';
import { percentageCorrector } from '../../utils/percentage';

@Component({
  selector: 'dammings-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PieChartComponent implements AfterViewInit {
  @ViewChild('backgroundContainer') backgroundContainer!: ElementRef;
  @ViewChild('backgroundChart') backgroundChart!: ElementRef;
  @ViewChild('percentContainer') percentContainer!: ElementRef;
  @ViewChild('percentChart') percentChart!: ElementRef;

  @Input() percentage!: number;

  renderer = inject(Renderer2);

  backgroundBoundings!: DOMRect;
  percentBoundings!: DOMRect;

  ngAfterViewInit(): void {
    this.setGraphsSizes(this.backgroundContainer);
    this.setGraphsSizes(this.percentContainer);
    this.setGraphPercent();
  }

  private setGraphsSizes(element: ElementRef): void {
    const boundings = element?.nativeElement?.getBoundingClientRect();
    if (boundings) {
      this.renderer.setStyle(
        element?.nativeElement,
        'height',
        `${boundings.width}px`
      );
    }
  }

  private setGraphPercent(): void {
    const boundings = this.percentChart?.nativeElement?.getBoundingClientRect();
    if (boundings) {
      const percentageValue = percentageCorrector(this.percentage);
      const diameter = boundings.width;
      const perimeter = diameter * Math.PI;
      const value = (perimeter * percentageValue) / 100;

      this.renderer.setStyle(
        this.percentChart?.nativeElement,
        'strokeDashoffset',
        `${value / 2}`
      );
      this.renderer.setStyle(
        this.percentChart?.nativeElement,
        'strokeDasharray',
        `${value} ${perimeter - value}`
      );
    }
  }
}
