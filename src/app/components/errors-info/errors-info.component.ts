import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Signal, inject } from "@angular/core";
import { ErrorsService } from "../../services/errors.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { ErrorData } from "../../app.models";

@Component({
  selector: 'dammings-errors-info',
  templateUrl: './errors-info.component.html',
  styleUrls: ['./errors-info.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class ErrorsInfoComponent {
  errorsService = inject(ErrorsService);

  error!: Signal<boolean>;
  errorInfo!: Signal<ErrorData | undefined>;

  constructor() {
    this.initSignals();
  }
  
  initSignals(): void {
    this.error = toSignal(this.errorsService.error, {
      initialValue: false
    });

    this.errorInfo = toSignal(this.errorsService.errorInfo, {
      initialValue: undefined
    });
  }
}
