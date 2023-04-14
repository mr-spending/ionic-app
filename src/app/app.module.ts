import { NgModule } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormBuilder } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { Interceptor } from './core/interceptors/interceptor.service';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const config: SocketIoConfig = { url: 'http://localhost:3500', options: {} };

@NgModule({
  declarations: [AppComponent],
  imports: [
    IonicModule.forRoot(),
    AppRoutingModule,
    CoreModule,
    CommonModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    SocketIoModule.forRoot(config)
  ],
  providers: [
    FormBuilder,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
