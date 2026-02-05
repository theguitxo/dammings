import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  OnInit,
  Signal,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DammingsInfo } from '../../app.models';
import { DammingsService } from '../../services/dammings.service';
import { DammInfoComponent } from '../damm-info/damm-info.component';
import { ErrorsInfoComponent } from '../errors-info/errors-info.component';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'dammmings-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoadingSpinnerComponent, ErrorsInfoComponent, DammInfoComponent],
})
export class HomeComponent implements OnInit {
  private readonly dammingsService = inject(DammingsService);
  private readonly injector = inject(Injector);

  protected dataLoaded!: Signal<boolean>;
  protected errorLoading!: Signal<boolean>;
  protected stationsData!: Signal<DammingsInfo[]>;
  protected showData!: Signal<boolean>;

  ngOnInit(): void {
    this.dataLoaded = toSignal(this.dammingsService.dataLoaded, {
      requireSync: true,
      injector: this.injector,
    });
    this.errorLoading = toSignal(this.dammingsService.errorLoading, {
      requireSync: true,
      injector: this.injector,
    });
    this.stationsData = toSignal(this.dammingsService.lastAllStationData, {
      requireSync: true,
      injector: this.injector,
    });

    this.showData = computed(() => this.dataLoaded() && !this.errorLoading());

    if (!this.dataLoaded()) {
      this.dammingsService.loadDammingsData();
    }
  }
}
