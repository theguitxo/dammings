import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, finalize, Observable, throwError } from 'rxjs';
import { ErrorsService } from '../services/errors.service';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  private readonly loadingService = inject(LoadingService);
  private readonly errorsService = inject(ErrorsService);

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    this.loadingService.startLoading();

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errorsService.setErrorInfo({
          title: `${error.statusText} (${error.status})`,
          message: error.message,
        });
        this.errorsService.setError();
        return throwError(() => new Error('error'));
      }),
      finalize(() => this.loadingService.stopLoading()),
    );
  }
}
