import { Component, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { ReducerState } from '../core/state/state.reducer';
import { UserModel } from '../core/interfaces/models';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnDestroy {

  subscription: Subscription = new Subscription();

  constructor(private afAuth: AngularFireAuth) {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  logOut() {
    this.afAuth.signOut().then();
  }
}
