import { Injectable } from '@angular/core';

import { MONO_BANK_CLIENT_TOKEN } from '../constants/local-storage.constants';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  setMonoBankClientToken(token: string): void {
    localStorage.setItem(MONO_BANK_CLIENT_TOKEN, token);
  }

  getMonoBankClientToken(): string | null {
    return localStorage.getItem(MONO_BANK_CLIENT_TOKEN);
  }
}
