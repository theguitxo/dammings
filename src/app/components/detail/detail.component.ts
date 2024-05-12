import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, Injector, Input, OnInit, Signal, computed, effect, inject } from '@angular/core';
import { DammingsService } from '../../services/dammings.service';
import { Router } from '@angular/router';
import { ErrorsService } from '../../services/errors.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { DammingsInfo } from '../../app.models';
import { ErrorsInfoComponent } from '../errors-info/errors-info.component';
import { HistoricChartComponent } from '../historic-chart/historic-chart.component';
import { TranslateModule } from '@ngx-translate/core';
import { FirstUpperCasePipe } from '../../pipes/first-uppercase.pipe';
import { HistoricTableComponent } from '../historic-table/historic-table.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dammings-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    ErrorsInfoComponent,
    HistoricChartComponent,
    HistoricTableComponent,
    TranslateModule,
    FirstUpperCasePipe
  ]
})
export class DetailComponent implements OnInit {
  @Input() id!: string;

  private injector = inject(Injector);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private dammingsService = inject(DammingsService);
  private cd = inject(ChangeDetectorRef);

  errorsService = inject(ErrorsService);

  showHistoricData!: Signal<boolean>;
  stationsData!: Signal<DammingsInfo[]>;
  stationName!: string

  ngOnInit(): void {
    this.setSignals();
    this.checkLoadedData();
    this.checkValidID();
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  private setSignals(): void {
    effect(() => {
      if(this.stationsData()?.length) {
        this.stationName = this.stationsData()[0].estaci;
        this.cd.markForCheck();
      }
    }, {
      injector: this.injector
    });

    this.stationsData = toSignal(this.dammingsService.lastSevenDaysData, {
      initialValue: [],
      injector: this.injector
    });

    this.showHistoricData = computed(() => this.stationsData().length > 0);
  }

  private checkLoadedData(): void {
    this.dammingsService.dataLoaded.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value: boolean) => {
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
        message: 'Station ID not exists'
      });
      this.errorsService.setError();
    }
  }
}
