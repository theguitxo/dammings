import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'dammings-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule],
})
export class LoadingSpinnerComponent {
  private readonly loadingService = inject(LoadingService);
  protected loading!: Signal<boolean>;

  constructor() {
    this.loading = toSignal(this.loadingService.loading, {
      requireSync: true,
    });
  }
}
