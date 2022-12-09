import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Guid } from "typescript-guid";
import * as moment from 'moment/moment';

import { SpendingDto } from '../core/dto/spending.dto';
import { DataBaseService } from '../core/services/data-base.service';

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
  ) {
    this.spendingFormGroup = this.fb.group({
      amount: this.fb.control(null, Validators.required),
      category: this.fb.control(null, Validators.required),
    })
  }

  addSpending(): void {
    const spendingItem: SpendingDto = {
      ...this.spendingFormGroup.getRawValue(),
      id: Guid.create().toString(),
      date: moment().toISOString(),
    }
    this.dbService.addSpending(spendingItem);
  }
}
