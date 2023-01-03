import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MonoBankApiService {

  url = environment.monoBankApiUrl;

  constructor(private http: HttpClient) { }

  getPersonalClientInfo(): Observable<any> {
    return this.http.get(`${this.url}personal/client-info`);
  }

  getPersonalStatement(account: string, from: number, to: number): Observable<any> {
    return this.http.get(`${this.url}personal/statement/${account}/${from}/${to}`);
  }
}
