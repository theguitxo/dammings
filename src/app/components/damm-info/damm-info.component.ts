import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from "@angular/core";
import { DammingsInfo } from "../../app.models";
import { PieChartComponent } from "../pie-chart/pie-chart.component";
import { Router } from "@angular/router";

@Component({
  selector: 'dammings-damm-info',
  templateUrl: './damm-info.component.html',
  styleUrls: ['./damm-info.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, PieChartComponent]
})
export class DammInfoComponent implements OnInit {
  
  @Input() dammingInfo!: DammingsInfo;

  percentage!: number;

  percentageFormatted!: string;
  dateFormatted!: string;

  router = inject(Router);

  ngOnInit(): void {
    this.percentage = +this.dammingInfo?.percentatge_volum_embassat;
    this.percentageFormatted = `${this.percentage.toLocaleString()} %`;
    this.dateFormatted = (new Date(this.dammingInfo.dia)).toLocaleDateString();
  }

  showDetail(): void {
    this.router.navigate([`/${this.dammingInfo.id}`]);
  }
}