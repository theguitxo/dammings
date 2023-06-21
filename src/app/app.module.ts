import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { DammingsService } from './services/dammings.service';
import { httpInterceptorProviders } from './http-interceptors';
import { LoadingService } from './services/loading.service';
import { ErrorsService } from './services/errors.service';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './components/home/home.component';
import { DetailComponent } from './components/detail/detail.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    DetailComponent,
    HomeComponent
  ],
  providers: [
    DammingsService,
    ErrorsService,
    LoadingService,
    httpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
