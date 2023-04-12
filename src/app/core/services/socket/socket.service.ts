import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';


@Injectable({
  providedIn: 'root'
})
export class SocketService {

  newTransactions$ = this.socket.fromEvent<any>('newTransaction');

  constructor(private socket: Socket) { }

}