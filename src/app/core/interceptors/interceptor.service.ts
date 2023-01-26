import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { Injectable } from '@angular/core';

import { LocalStorageService } from '../services/local-storage.service';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';

@Injectable()
export class Interceptor implements HttpInterceptor {

  constructor(private lsService: LocalStorageService, private auth: AuthService) { }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.auth.token.pipe(
      switchMap(token => {
        if (request.url.includes(environment.baseUrl)) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${ token }`
            }
          });
        }

        const monoBankToken = this.lsService.getMonoBankClientToken();

        if (monoBankToken && request.url.includes(environment.monoBankApiUrl)) {
          request = request.clone({
            setHeaders: {
              'X-Token': monoBankToken
            }
          });
        }
        return next.handle(request);
      })
    );
  }
}
