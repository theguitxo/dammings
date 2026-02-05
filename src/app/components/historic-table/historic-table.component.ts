import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DammingsInfo, HistoricDataTableRow } from '../../app.models';
import { FirstUpperCasePipe } from '../../pipes/first-uppercase.pipe';
import { percentageCorrector } from '../../utils/percentage';

@Component({
  selector: 'dammings-historic-table',
  templateUrl: './historic-table.component.html',
  styleUrls: ['./historic-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule, FirstUpperCasePipe],
})
export class HistoricTableComponent implements OnInit {
  @Input() info!: DammingsInfo[];

  protected tableData!: WritableSignal<HistoricDataTableRow[]>;

  ngOnInit(): void {
    this.setTableData();
  }

  private setTableData() {
    const tableData = this.info.map((v, i) => {
      const previous = this.info[i - 1] ?? null;
      const percentage = percentageCorrector(+v.percentatge_volum_embassat);
      const percentageFormatted = percentage.toFixed(2);
      const diffPercentage = previous
        ? percentageCorrector(+v.percentatge_volum_embassat) -
          percentageCorrector(+previous.percentatge_volum_embassat)
        : null;
      const diffPercentageFormatted =
        diffPercentage !== null ? diffPercentage.toFixed(2) : '';
      const volume = +v.volum_embassat;
      const volumeFormatted = volume.toFixed(2);
      const diffVolume = previous
        ? +v.volum_embassat - +previous.volum_embassat
        : null;
      const diffVolumeFormatted =
        diffVolume !== null ? diffVolume.toFixed(2) : '';

      return {
        date: new Date(v.dia).toLocaleDateString(),
        percentage,
        percentageFormatted,
        diffPercentage,
        diffPercentageFormatted,
        diffPercentageIsNegative: !!(diffPercentage && +diffPercentage < 0),
        volume,
        volumeFormatted,
        diffVolume,
        diffVolumeFormatted,
        diffVolumeIsNegative: !!(diffVolume && +diffVolume < 0),
      };
    });

    this.tableData = signal(tableData);
  }
}
