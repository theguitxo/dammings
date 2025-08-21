import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  Injector,
  Input,
  OnInit,
  Signal,
  computed,
  effect,
  inject,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DammingsInfo } from '../../app.models';
import { DammingsService } from '../../services/dammings.service';
import { ErrorsService } from '../../services/errors.service';
import { ErrorsInfoComponent } from '../errors-info/errors-info.component';
import { HistoricChartComponent } from '../historic-chart/historic-chart.component';
import { HistoricTableComponent } from '../historic-table/historic-table.component';

@Component({
  selector: 'dammings-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ErrorsInfoComponent,
    HistoricChartComponent,
    HistoricTableComponent,
    TranslateModule,
  ],
})
export class DetailComponent implements OnInit {
  @Input() id!: string;

  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly dammingsService = inject(DammingsService);
  private readonly cd = inject(ChangeDetectorRef);

  errorsService = inject(ErrorsService);

  showHistoricData!: Signal<boolean>;
  stationsData!: Signal<DammingsInfo[]>;
  stationName!: string;

  ngOnInit(): void {
    this.setSignals();
    this.checkLoadedData();
    this.checkValidID();
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  private setSignals(): void {
    effect(
      () => {
        if (this.stationsData()?.length) {
          this.stationName = this.stationsData()[0].estaci;
          this.cd.markForCheck();
        }
      },
      {
        injector: this.injector,
      }
    );

    this.stationsData = toSignal(this.dammingsService.lastSevenDaysData, {
      initialValue: [],
      injector: this.injector,
    });

    this.showHistoricData = computed(() => this.stationsData().length > 0);
  }

  private checkLoadedData(): void {
    this.dammingsService.dataLoaded
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value: boolean) => {
        if (!value) {
          this.router.navigate(['/']);
        }
      });
  }

  private checkValidID(): void {
    if (this.dammingsService.getIDisValid(this.id)) {
      this.dammingsService.loadLastSevenDays(this.id);
    } else {
      this.errorsService.setErrorInfo({
        title: 'ID Error',
        message: 'Station ID not exists',
      });
      this.errorsService.setError();
    }
  }
}
