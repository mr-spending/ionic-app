import { NgModule } from '@angular/core';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-page-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { SpendingBasketModalComponent } from './spending-basket-modal/spending-basket-modal.component';
import { SocketService } from 'src/app/core/services/socket/socket.service';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

const config: SocketIoConfig = { url: 'http://localhost:3500', options: {} };

@NgModule({
  providers: [SocketService],
  imports: [
    HomePageRoutingModule,
    SharedModule,
    SocketIoModule.forRoot(config),
  ],
  declarations: [
    HomePage,
    SpendingBasketModalComponent,
  ]
})
export class HomePageModule {}
