import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  WritableSignal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DammingsInfo } from '../../app.models';
import { FirstUpperCasePipe } from '../../pipes/first-uppercase.pipe';
import { percentageCorrector } from '../../utils/percentage';
import { PieChartComponent } from '../pie-chart/pie-chart.component';

@Component({
  selector: 'dammings-damm-info',
  templateUrl: './damm-info.component.html',
  styleUrls: ['./damm-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PieChartComponent, TranslateModule, FirstUpperCasePipe],
})
export class DammInfoComponent implements OnInit {
  @Input() dammingInfo!: DammingsInfo;

  private readonly router = inject(Router);

  protected percentage!: WritableSignal<number>;
  protected percentageFormatted = computed<string>(() => {
    const percentageValue = percentageCorrector(this.percentage());
    return `${percentageValue.toLocaleString()} %`;
  });
  protected dateFormatted!: WritableSignal<string>;

  ngOnInit(): void {
    this.percentage = signal(+this.dammingInfo?.percentatge_volum_embassat);
    this.dateFormatted = signal(
      new Date(this.dammingInfo.dia).toLocaleDateString(),
    );
  }

  showDetail(): void {
    this.router.navigate([`/${this.dammingInfo.id}`]);
  }
}
