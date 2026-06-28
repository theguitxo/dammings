import { HttpClient, provideHttpClient, withInterceptorsFromDi, withXhr } from "@angular/common/http";
import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { provideRouter, withComponentInputBinding } from "@angular/router";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { appRoutes } from "./app.routes";
import { DialogService } from "./modules/dialog/dialog.service";
import { DammingsService } from "./services/dammings.service";
import { ErrorsService } from "./services/errors.service";
import { LoadingService } from "./services/loading.service";

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(appRoutes, withComponentInputBinding()),
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        importProvidersFrom([
            TranslateModule.forRoot({
                loader: {
                    provide: TranslateLoader,
                    useFactory: HttpLoaderFactory,
                    deps: [HttpClient]
                }
            }),
        ]),
        DammingsService,
        ErrorsService,
        LoadingService,
        DialogService
    ]
}