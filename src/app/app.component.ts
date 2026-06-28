import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LANGUAGES } from './app.models';
import { LanguageSelectorComponent } from './components/language-selector/language-selector.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [
      TranslateModule,
      LanguageSelectorComponent,
      RouterModule
    ]
})
export class AppComponent {
  languages = new Map()
    .set('ENGLISH', LANGUAGES.ENGLISH)
    .set('SPANISH', LANGUAGES.SPANISH)
    .set('CATALAN', LANGUAGES.CATALAN);

  constructor(private readonly translate: TranslateService) {
    translate.setDefaultLang(LANGUAGES.ENGLISH);
    translate.use(LANGUAGES.ENGLISH);
  }

  changeLanguage(lang: LANGUAGES): void {
    this.translate.use(lang);
  }
}
