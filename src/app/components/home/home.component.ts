import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit, Signal, computed, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { DammingsInfo } from "../../app.models";
import { DammingsService } from "../../services/dammings.service";
import { ErrorsService } from "../../services/errors.service";
import { LoadingService } from "../../services/loading.service";
import { CommonModule } from "@angular/common";
import { LoadingSpinnerComponent } from "../loading-spinner/loading-spinner.component";
import { ErrorsInfoComponent } from "../errors-info/errors-info.component";
import { DammInfoComponent } from "../damm-info/damm-info.component";
import { HistoricChartComponent } from "../historic-chart/historic-chart.component";
import { isMobileDevice } from "../../app.utils";

@Component({
  selector: 'dammmings-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    LoadingSpinnerComponent,
    ErrorsInfoComponent,
    DammInfoComponent,
    HistoricChartComponent
  ]
})
export class HomeComponent implements OnInit {

  loadingService = inject(LoadingService);
  dammingsService = inject(DammingsService);
  errorsService = inject(ErrorsService);

  dataLoaded!: Signal<boolean>;
  errorLoading!: Signal<boolean>;
  stationsData!: Signal<DammingsInfo[]>;
  showData!: Signal<boolean>;

  private injector = inject(Injector);

  constructor(
    private readonly cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.dataLoaded = toSignal(this.dammingsService.dataLoaded, {
      requireSync: true,
      injector: this.injector
    });
    this.errorLoading = toSignal(this.dammingsService.errorLoading, {
      requireSync: true,
      injector: this.injector
    });
    this.stationsData = toSignal(this.dammingsService.lastAllStationData, {
      requireSync: true,
      injector: this.injector
    });

    this.showData = computed(() => (this.dataLoaded() && !this.errorLoading()));

    if (!this.dataLoaded()) {
      this.dammingsService.loadDammingsData();
    }
  }
}