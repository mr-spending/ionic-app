import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { LocalStorageService } from '../services/local-storage.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class Interceptor implements HttpInterceptor {

  constructor(private lsService: LocalStorageService) { }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const monoBankToken = this.lsService.getMonoBankClientToken();

    if (monoBankToken && request.url.includes(environment.monoBankApiUrl)) {
      request = request.clone({
        setHeaders: {
          'X-Token': monoBankToken
        }
      });
    }

    return next.handle(request);
  }


}
