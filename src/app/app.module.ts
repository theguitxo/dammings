import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppComponent } from './app.component';
import { DammingsService } from './services/dammings.service';
import { httpInterceptorProviders } from './http-interceptors';
import { LoadingService } from './services/loading.service';
import { ErrorsService } from './services/errors.service';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './components/home/home.component';
import { DetailComponent } from './components/detail/detail.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LanguageSelectorComponent } from './components/language-selector/language-selector.component';
import { DialogModule } from './modules/dialog/dialog.module';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({ declarations: [
        AppComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        DetailComponent,
        HomeComponent,
        LanguageSelectorComponent,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        DialogModule], providers: [
        DammingsService,
        ErrorsService,
        LoadingService,
        httpInterceptorProviders,
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule { }
