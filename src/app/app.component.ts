import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LANGUAGES } from './app.models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  languages = new Map()
    .set('ENGLISH', LANGUAGES.ENGLISH)
    .set('SPANISH', LANGUAGES.SPANISH)
    .set('CATALAN', LANGUAGES.CATALAN);

  constructor(private translate: TranslateService) {
    translate.setDefaultLang(LANGUAGES.ENGLISH);
    translate.use(LANGUAGES.ENGLISH);
  }

  changeLanguage(lang: LANGUAGES): void {
    this.translate.use(lang);
  }
}
