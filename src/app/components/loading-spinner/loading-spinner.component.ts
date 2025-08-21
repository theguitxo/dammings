import { ChangeDetectionStrategy, Component, Signal, inject } from "@angular/core";
import { LoadingService } from "../../services/loading.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    selector: 'dammings-loading-spinner',
    templateUrl: './loading-spinner.component.html',
    styleUrls: ['./loading-spinner.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        TranslateModule
    ]
})
export class LoadingSpinnerComponent {
  loadingService = inject(LoadingService);
  loading!: Signal<boolean>;

  constructor() {
    this.loading = toSignal(this.loadingService.loading, {
      requireSync: true
    });
  }
}
