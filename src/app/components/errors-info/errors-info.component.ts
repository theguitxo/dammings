import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ErrorData } from '../../app.models';
import { ErrorsService } from '../../services/errors.service';

@Component({
  selector: 'dammings-errors-info',
  templateUrl: './errors-info.component.html',
  styleUrls: ['./errors-info.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorsInfoComponent {
  private readonly errorsService = inject(ErrorsService);

  protected error!: Signal<boolean>;
  protected errorInfo!: Signal<ErrorData | undefined>;

  constructor() {
    this.initSignals();
  }

  initSignals(): void {
    this.error = toSignal(this.errorsService.error, {
      initialValue: false,
    });

    this.errorInfo = toSignal(this.errorsService.errorInfo, {
      initialValue: undefined,
    });
  }
}
