import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { ErrorData } from '../app.models';

@Injectable()
export class ErrorsService {
  private readonly _error: Subject<boolean> = new Subject<boolean>();
  private readonly _errorInfo: Subject<ErrorData> = new Subject<ErrorData>();

  get error(): Observable<boolean> {
    return this._error.asObservable();
  }

  get errorInfo(): Observable<ErrorData> {
    return this._errorInfo.asObservable();
  }

  setError(): void {
    this._error.next(true);
  }

  resetError(): void {
    this._error.next(false);
  }

  setErrorInfo(info: ErrorData): void {
    this._errorInfo.next(info);
  }
}
