import { Store } from '@ngrx/store';
import { AppState } from '@capacitor/app';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { finalize, Observable, switchMap } from 'rxjs';

import { LocalStorageService } from '../services/local-storage/local-storage.service';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';
import { UserSelectors } from '../state/selectors/user.selectors';
import { LoadingService } from '../services/loading/loading.service';

@Injectable()
export class Interceptor implements HttpInterceptor {
  private monoBankToken!: string;

  constructor(
    private lsService: LocalStorageService,
    private auth: AuthService,
    private store: Store<AppState>,
    private loader: LoadingService,
  ) {
    this.store.select(UserSelectors.selectMonoToken)
      .subscribe(token => this.monoBankToken = token || '');
  }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.auth.token.pipe(
      switchMap(token => {
        this.loader.show();
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
        return next.handle(request).pipe(
          finalize(() => this.loader.hide())
        );
      })
    );
  }
}
