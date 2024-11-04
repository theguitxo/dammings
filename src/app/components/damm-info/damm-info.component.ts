import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  inject,
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
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PieChartComponent, TranslateModule, FirstUpperCasePipe],
})
export class DammInfoComponent implements OnInit {
  @Input() dammingInfo!: DammingsInfo;

  percentage!: number;

  percentageFormatted!: string;
  dateFormatted!: string;

  router = inject(Router);

  ngOnInit(): void {
    this.percentage = +this.dammingInfo?.percentatge_volum_embassat;
    const percentageValue = percentageCorrector(this.percentage);
    this.percentageFormatted = `${percentageValue.toLocaleString()} %`;
    this.dateFormatted = new Date(this.dammingInfo.dia).toLocaleDateString();
  }

  showDetail(): void {
    this.router.navigate([`/${this.dammingInfo.id}`]);
  }
}
