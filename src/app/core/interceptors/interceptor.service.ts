import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { Injectable } from '@angular/core';

import { LocalStorageService } from '../services/local-storage/local-storage.service';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '@capacitor/app';
import { UserSelectors } from '../state/selectors/user.selectors';

@Injectable()
export class Interceptor implements HttpInterceptor {
  private monoBankToken!: string;

  constructor(
    private lsService: LocalStorageService,
    private auth: AuthService,
    private store: Store<AppState>,
  ) {
    this.store.select(UserSelectors.selectMonoToken)
      .subscribe(token => this.monoBankToken = token || '');
  }


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

        if (this.monoBankToken && request.url.includes(environment.monoBankApiUrl)) {
          request = request.clone({
            setHeaders: {
              'X-Token': this.monoBankToken
            }
          });
        }
        return next.handle(request);
      })
    );
  }
}
