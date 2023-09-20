import { Injectable, inject } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, catchError, last, of, take } from "rxjs";
import { DammingsInfo } from "../app.models";

@Injectable()
export class DammingsService {
  private dammingsInfoUrl = 'https://analisi.transparenciacatalunya.cat/resource/gn9e-3qhr.json';
  private http = inject(HttpClient);

  private _dataLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _errorLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private _stationNames!: string[];
  private _totalStations!: number;

  private _lastAllStationData: BehaviorSubject<DammingsInfo[]> = new BehaviorSubject<DammingsInfo[]>([]);
  private _lastSevenDaysData: Subject<DammingsInfo[]> = new Subject<DammingsInfo[]>();

  private _info: DammingsInfo[] = [];

  get dataLoaded(): Observable<boolean> {
    return this._dataLoaded.asObservable();
  }

  get errorLoading(): Observable<boolean> {
    return this._errorLoading.asObservable();
  }

  get totalStations(): number {
    return this._totalStations;
  }

  get stationNames(): string[] {
    return this._stationNames;
  }

  get lastAllStationData(): Observable<DammingsInfo[]> {
    return this._lastAllStationData.asObservable();
  }

  get lastSevenDaysData(): Observable<DammingsInfo[]> {
    return this._lastSevenDaysData.asObservable();
  }

  /**
   * Loads the data about the dammings
   */
  loadDammingsData(): void {
    this._dataLoaded.next(false);
    this._errorLoading.next(false);

    this.http.get<DammingsInfo[]>(this.dammingsInfoUrl)
      .pipe(
        take(1),
        catchError(() => this.errorLoadingData()))
      .subscribe((data: DammingsInfo[]) => this.setDammingsData(data));
  }

  loadLastSevenDays(id: string): void {
    const dates = (new Array(7)).fill(null).map((_v, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (i + 1));
      return date.toISOString().split('T')[0];
    });

    const stationData = this._info.filter(item => {
      const date = item.dia.split('T')[0];
      return (item.id === id && dates.includes(date));
    });
    
    const values = Array.from(new Set(stationData.map(d => JSON.stringify(d)))).map(d => JSON.parse(d));

    this._lastSevenDaysData.next(values);
  }

  getIDisValid(id: string): boolean {
    return this._info.some(item => item.id === id);
  }

  /**
   * Sets the data using the loaded information
   * @param data 
   */
  private setDammingsData(data: DammingsInfo[]): void {
    this._info = data;

    this.setStationNamesList();

    this._totalStations = this._stationNames?.length ?? 0;

    this.setStationsID();

    this._lastAllStationData.next(this.getLastAllStationsData());

    this._dataLoaded.next(true);
  }

  private getLastAllStationsData(): any[] {
    const last2Days = Array.from(new Set(this._info.map(i => i.dia))).slice(0, 2).sort((a, b) => a < b ? 1 : -1);

    const firstDayList: DammingsInfo[] = [];
    const secondDayList: DammingsInfo[] = [];

    this.stationNames.forEach(name => {
      const first = this._info.find(item => item.estaci === name && item.dia === last2Days[0]);
      const second = this._info.find(item => item.estaci === name && item.dia === last2Days[1]);

      if (first) {
        firstDayList.push(first);
      }

      if (second) {
        secondDayList.push(second);
      }
    });

    const result = secondDayList.map(second => {
      const inFirst = firstDayList.find(first => first.estaci === second.estaci);
      return inFirst ?? second;
    });

    return result.sort((a, b) => a.estaci < b.estaci ? -1 : 1);
  }

  private errorLoadingData(): Observable<DammingsInfo[]> {
    this._errorLoading.next(true);
    return of([]);
  }

  private setStationNamesList(): void {
    const names = this._info.map(item => item.estaci);
    this._stationNames = Array.from(new Set(names));
  }

  private setStationsID(): void {
    const iDlist = new Map<string, string>();
    this.stationNames.forEach((station: string) => iDlist.set(station, Math.random().toString(36).substring(2)));
    this._info.forEach((info: DammingsInfo) => info.id = iDlist.get(info.estaci));
  }
}
