import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { DialogConfig } from '../../../modules/dialog/dialog-config';
import { DialogRef } from '../../../modules/dialog/dialog-ref';
import { DialogLanguageDialogData } from '../../../app.models';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FirstUpperCasePipe } from '../../../pipes/first-uppercase.pipe';

@Component({
  selector: 'dammings-dialog-language-selector',
  templateUrl: './dialog-language-selector.component.html',
  styleUrls: ['./dialog-language-selector.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    TranslateModule,
    FirstUpperCasePipe
  ]
})
export class DialogLanguageSelectorComponent {
  constructor(
    public config: DialogConfig<DialogLanguageDialogData>,
    private readonly dialog: DialogRef,
    private readonly translate: TranslateService
  ){}

  changeLang(lang: string): void {
    this.translate.use(lang);
    this.onClose();
  }

  onClose(): void {
    this.dialog.close();
  }
}