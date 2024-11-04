import { InjectionToken, Injector, Type } from '@angular/core';

export class DialogInjector implements Injector {
  constructor(
    private readonly _parentInjector: Injector,
    private readonly _additionalTokens: WeakMap<any, any>
  ) {}

  get<T>(token: Type<T> | InjectionToken<T>, notFoundValue?: T): T;
  get(token: any, notFoundValue?: any) {
    const value = this._additionalTokens.get(token);

    if (value) return value;

    return this._parentInjector.get<any>(token, notFoundValue);
  }
}
