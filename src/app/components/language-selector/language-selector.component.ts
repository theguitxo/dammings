import { ChangeDetectionStrategy, Component, OnInit, signal } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LANGUAGES } from "../../app.models";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'dammings-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class LanguageSelectorComponent implements OnInit {

  flags = new Map()
    .set(LANGUAGES.ENGLISH, 'assets/images/languages/english.png')
    .set(LANGUAGES.SPANISH, 'assets/images/languages/spanish.png')
    .set(LANGUAGES.CATALAN, 'assets/images/languages/catalan.png');

  selectedFlag = signal<string>('');

  constructor(
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.selectedFlag.set(this.flags.get(this.translate.currentLang));
  }
}
