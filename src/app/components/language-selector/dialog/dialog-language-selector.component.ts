import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DialogLanguageDialogData } from '../../../app.models';
import { DialogConfig } from '../../../modules/dialog/dialog-config';
import { DialogRef } from '../../../modules/dialog/dialog-ref';
import { FirstUpperCasePipe } from '../../../pipes/first-uppercase.pipe';

@Component({
  selector: 'dammings-dialog-language-selector',
  templateUrl: './dialog-language-selector.component.html',
  styleUrls: ['./dialog-language-selector.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule, FirstUpperCasePipe],
})
export class DialogLanguageSelectorComponent {
  constructor(
    public config: DialogConfig<DialogLanguageDialogData>,
    private readonly dialog: DialogRef
  ) {}

  changeLang(lang: string): void {
    this.dialog.close(lang);
  }

  onCancel(): void {
    this.dialog.close(null);
  }

  changeSource(event: Event): void {
    (event.target as HTMLImageElement).src =
      'assets/images/languages/default.png';
  }
}
