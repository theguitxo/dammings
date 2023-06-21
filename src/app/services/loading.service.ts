import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class LoadingService {
  private _loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
 
  get loading() {
    return this._loading.asObservable();
  }

  startLoading(): void {
    this._loading.next(true);
  }

  stopLoading(): void {
    this._loading.next(false);
  }
}