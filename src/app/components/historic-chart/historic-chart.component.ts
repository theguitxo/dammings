import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { DammingsInfo, HorizontalLine, HorizontalLinesValues, ValueLine, ValuePoint, ValueTooltip, VerticalLine } from '../../app.models';
import { CommonModule } from '@angular/common';

const CHART_HEIGHT = 40;
const CHART_INIT_X = 10;
const CHART_END_X = 94;
const CHART_INIT_Y = 5;
const CHART_END_Y = 45;
const Y_LABELS_POS_X = 3;
const Y_LABELS_POS_Y_TRANSLATION = .5;

@Component({
  selector: 'dammings-historic-chart',
  templateUrl: './historic-chart.component.html',
  styleUrls: ['./historic-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule]
})
export class HistoricChartComponent implements OnInit {

  @Input() info!: DammingsInfo[];

  verticalLines!: VerticalLine[];
  horizontalLines!: HorizontalLine[];
  yPoints!: number[];
  lines!: ValueLine[];
  valuePoints!: ValuePoint[];
  valueTooltips!: ValueTooltip[];
  horizontalLinesValues!: HorizontalLinesValues;

  ngOnInit(): void {
    this.info.reverse();
    this.setHorizontalLinesValues();
    this.setHorizontalLines();
    this.setYPoints();
    this.setVerticalLines();
    this.setLines();
    this.setValuePoints();
    this.setValueTooltips();
  }

  showTooltip(i: number): void {
    this.valueTooltips[i].show = true;
  }
  
  hideTooltip(i: number): void {
    this.valueTooltips[i].show = false;
  }

  private setHorizontalLinesValues(): void {
    const values = this.info.map(item => item.percentatge_volum_embassat).sort()!;
    const totalItems = values.length;
    const min = +values.shift()!;
    const max = +values.pop()!;
    const init = min - ((max - min) / totalItems);
    const end = max + ((max - min) / totalItems);
    const chartGap = (end - init) / totalItems;

    this.horizontalLinesValues = {
      totalItems,
      init,
      end,
      gapInitEnd: (end - init) > 0 ? end - init : 1,
      chartGap,
      chartLabels: new Array(totalItems + 1).fill('').map((_v, i) => `${(end - (i * chartGap)).toFixed(2)}%`)
    };

    console.log(this.horizontalLinesValues);
  }

  private setHorizontalLines(): void {
    this.horizontalLines = this.horizontalLinesValues.chartLabels.map((v, i) => ({
      y: CHART_INIT_Y + (i * (CHART_HEIGHT / this.horizontalLinesValues.totalItems)),
      x1: CHART_INIT_X,
      x2: CHART_END_X,
      yText: (CHART_INIT_Y + (i * (CHART_HEIGHT / this.horizontalLinesValues.totalItems))) + Y_LABELS_POS_Y_TRANSLATION,
      xText: Y_LABELS_POS_X,
      text: v
    }));
  }

  private setYPoints(): void {
    this.yPoints = this.info.map(item => {
      const relativeValue = ((+item.percentatge_volum_embassat - this.horizontalLinesValues.init) * 100) / this.horizontalLinesValues.gapInitEnd;
      return CHART_END_Y - ((relativeValue * CHART_HEIGHT) / 100);
    }); 
  }

  private setVerticalLines(): void {
    const chartWidth = CHART_END_X - CHART_INIT_X;
    const verticalGap = chartWidth / this.horizontalLinesValues.totalItems;
    const centerGap = verticalGap / 2;
    const initialX = CHART_INIT_X + centerGap;
    this.verticalLines = this.info.map((item, i) => ({
      text: new Date(item.dia).toLocaleDateString(),
      xLine: initialX + (i * verticalGap)
    }));
  }

  private setLines(): void {
    this.lines = this.yPoints.slice(0, this.yPoints.length - 1).map((_v, i) => ({
      x1: this.verticalLines[i].xLine,
      x2: this.verticalLines[i + 1].xLine,
      y1: this.yPoints[i],
      y2: this.yPoints[i + 1]
    }));

    console.log(this.yPoints);

    console.log(this.lines);
  }

  private setValuePoints(): void {
    this.valuePoints = this.yPoints.map((v, i) => ({
      cx: this.verticalLines[i].xLine,
      cy: v
    }));
  }

  private setValueTooltips(): void {
    this.valueTooltips = this.info.map((v, i) => ({
      x: this.verticalLines[i].xLine,
      y: this.yPoints[i],
      text: (+v.percentatge_volum_embassat).toFixed(2).replace('.', ','),
      show: false
    }));
  }
}
