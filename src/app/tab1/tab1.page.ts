import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Guid } from "typescript-guid";
import * as moment from 'moment/moment';

import { DataBaseService } from '../core/dataBase/data-base.service';
import { AuthService } from '../auth/services/auth.service';
import { SpendingEntity } from '../core/interface/entities';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  spendingFormGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dbService: DataBaseService,
    private authService: AuthService,
    private afAuth: AngularFireAuth,
  ) {
    this.spendingFormGroup = this.fb.group({
      amount: this.fb.control(null, Validators.required),
      category: this.fb.control(null, Validators.required),
    });
  }

  addSpending(): void {
    const spendingItem: SpendingEntity = {
      ...this.spendingFormGroup.getRawValue(),
      id: Guid.create().toString(),
      date: moment().toISOString(),
      uid: localStorage.getItem('uid'),
    }
    this.dbService.createSpending(spendingItem, localStorage.getItem('uid')!);
  }

  signOut(): void {
    this.authService.signOut().then();
  }

  getSpending() {
    // this.dbService.getSpending('bd25a8b3-85da-4f71-4d21-f030bc032685').subscribe(res => {
    //   console.log(res);
    // })

  }

  test() {
    this.dbService.getSpending('c1ee6b09-65c4-5c79-78e0-e9967ab4b4b4', localStorage.getItem('uid')!).subscribe(res => {
      console.log(res);
    })
  }
}
