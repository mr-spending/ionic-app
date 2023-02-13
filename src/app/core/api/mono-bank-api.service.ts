import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MonoBankApiService {

  baseUrl = environment.baseUrl;
  monoUrl = environment.monoBankApiUrl;

  constructor(private http: HttpClient) { }

  getPersonalClientInfo(): Observable<any> {
    return this.http.get(`${this.monoUrl}personal/client-info`);
  }

  getPersonalStatement(account: string, from: number, to: number): Observable<any> {
    return this.http.get(`${this.monoUrl}personal/statement/${account}/${from}/${to}`);
  }

  setWebHook(): Observable<any> {
    return this.http.post(`${this.monoUrl}personal/webhook`, { webHookUrl: `${this.baseUrl}monobank` });
  }
}
