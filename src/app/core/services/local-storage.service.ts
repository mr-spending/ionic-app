import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  setValueByKey(key: string, value: any): void {
    localStorage.setItem(key, value);
  }

  getValueByKey(key: string): any {
    return localStorage.getItem(key);
  }
}
