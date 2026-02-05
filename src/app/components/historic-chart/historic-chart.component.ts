import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Input,
  OnInit,
} from '@angular/core';
import {
  DammingsInfo,
  HorizontalLine,
  HorizontalLinesValues,
  ValueLine,
  ValuePoint,
  ValueTooltip,
  VerticalLine,
} from '../../app.models';
import { percentageCorrector } from '../../utils/percentage';

const CHART_HEIGHT = 40;
const CHART_INIT_X = 10;
const CHART_END_X = 94;
const CHART_INIT_Y = 5;
const CHART_END_Y = 45;
const Y_LABELS_POS_X = 3;
const Y_LABELS_POS_Y_TRANSLATION = 0.5;

@Component({
  selector: 'dammings-historic-chart',
  templateUrl: './historic-chart.component.html',
  styleUrls: ['./historic-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class HistoricChartComponent implements OnInit {
  @Input() info!: DammingsInfo[];

  protected verticalLines = computed<VerticalLine[]>(() => {
    const chartWidth = CHART_END_X - CHART_INIT_X;
    const verticalGap = chartWidth / this.horizontalLinesValues().totalItems;
    const centerGap = verticalGap / 2;
    const initialX = CHART_INIT_X + centerGap;
    return this.info.map((item, i) => ({
      text: new Date(item.dia).toLocaleDateString(),
      xLine: initialX + i * verticalGap,
    }));
  });

  protected horizontalLines = computed<HorizontalLine[]>(() => {
    return this.horizontalLinesValues().chartLabels.map((v, i) => ({
      y:
        CHART_INIT_Y +
        i * (CHART_HEIGHT / this.horizontalLinesValues().totalItems),
      x1: CHART_INIT_X,
      x2: CHART_END_X,
      yText:
        CHART_INIT_Y +
        i * (CHART_HEIGHT / this.horizontalLinesValues().totalItems) +
        Y_LABELS_POS_Y_TRANSLATION,
      xText: Y_LABELS_POS_X,
      text: v,
    }));
  });

  protected yPoints = computed<number[]>(() => {
    return this.info.map((item) => {
      const relativeValue =
        ((percentageCorrector(+item.percentatge_volum_embassat) -
          this.horizontalLinesValues().init) *
          100) /
        this.horizontalLinesValues().gapInitEnd;
      return CHART_END_Y - (relativeValue * CHART_HEIGHT) / 100;
    });
  });

  protected lines = computed<ValueLine[]>(() => {
    return this.yPoints()
      .slice(0, this.yPoints.length - 1)
      .map((_v, i) => ({
        x1: this.verticalLines()[i].xLine,
        x2: this.verticalLines()[i + 1].xLine,
        y1: this.yPoints()[i],
        y2: this.yPoints()[i + 1],
      }));
  });

  protected valuePoints = computed<ValuePoint[]>(() => {
    return this.yPoints().map((v, i) => ({
      cx: this.verticalLines()[i].xLine,
      cy: v,
    }));
  });

  protected valueTooltips = computed<ValueTooltip[]>(() => {
    return this.info.map((v, i) => ({
      x: this.verticalLines()[i].xLine,
      y: this.yPoints()[i],
      text: (+v.percentatge_volum_embassat).toFixed(2).replace('.', ','),
      show: false,
    }));
  });

  protected horizontalLinesValues = computed<HorizontalLinesValues>(() => {
    const values = this.info
      .map((item) => percentageCorrector(+item.percentatge_volum_embassat))
      .sort((a, b) => (a > b ? 1 : -1));

    const totalItems = values.length;
    const min = +values.shift()!;
    const max = +values.pop()!;
    const init = min - (max - min) / totalItems;
    const end = max + (max - min) / totalItems;
    const chartGap = (end - init) / totalItems;

    return {
      totalItems,
      init,
      end,
      gapInitEnd: end - init > 0 ? end - init : 1,
      chartGap,
      chartLabels: new Array(totalItems + 1)
        .fill('')
        .map((_v, i) => `${(end - i * chartGap).toFixed(2)}%`),
    };
  });

  ngOnInit(): void {
    this.info.reverse();
  }

  protected showTooltip(i: number): void {
    this.valueTooltips()[i].show = true;
  }

  protected hideTooltip(i: number): void {
    this.valueTooltips()[i].show = false;
  }
}
