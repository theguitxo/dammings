import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { FirstUpperCasePipe } from "../../pipes/first-uppercase.pipe";
import { DammingsInfo, HistoricDataTableRow } from "../../app.models";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'dammings-historic-table',
  templateUrl: './historic-table.component.html',
  styleUrls: ['./historic-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FirstUpperCasePipe
  ]
})
export class HistoricTableComponent implements OnInit {

  @Input() info!: DammingsInfo[];

  tableData!: HistoricDataTableRow[];

  ngOnInit(): void {
      this.setTableData();
  }

  private setTableData() {
    const dataList = [...this.info].reverse();
    const tableData = dataList.map((v, i) => {
      const previous = dataList[i - 1] ?? null;
      const percentage = (+v.percentatge_volum_embassat);
      const percentageFormatted = percentage.toFixed(2);
      const diffPercentage = previous ? (+v.percentatge_volum_embassat - +previous.percentatge_volum_embassat): null;
      const diffPercentageFormatted = diffPercentage !== null ? diffPercentage.toFixed(2) : '';
      const volume = +v.volum_embassat;
      const volumeFormatted = volume.toFixed(2);
      const diffVolume = previous ? (+v.volum_embassat - +previous.volum_embassat) : null;
      const diffVolumeFormatted = diffVolume !== null ? diffVolume.toFixed(2) : '';

      return {
        date: (new Date(v.dia)).toLocaleDateString(),
        percentage,
        percentageFormatted,
        diffPercentage,
        diffPercentageFormatted,
        diffPercentageIsNegative: !!(diffPercentage && +diffPercentage < 0),
        volume,
        volumeFormatted,
        diffVolume,
        diffVolumeFormatted,
        diffVolumeIsNegative: !!(diffVolume && +diffVolume < 0)
      }
    });

    this.tableData = tableData;
  }

}
