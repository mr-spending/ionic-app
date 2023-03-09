import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private callsInPending = 0;
  private _loading = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this._loading.asObservable();

  constructor() { }

  show() {
    this.callsInPending ++;
    this._loading.next(true);
  }

  hide() {
    this.callsInPending --;
    if (this.callsInPending === 0) this._loading.next(false);
  }
}
