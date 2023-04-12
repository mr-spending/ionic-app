import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { WebSocketMessageEnum } from '../../enums/spending.enums';


@Injectable({
  providedIn: 'root'
})
export class SocketService {

  newTransaction$ = this.socket.fromEvent<string>(WebSocketMessageEnum.NewTransaction);

  constructor(private socket: Socket) { }

}
