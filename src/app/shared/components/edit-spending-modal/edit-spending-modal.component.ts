import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '@capacitor/app';
import { Observable } from 'rxjs';

import { CategoryModel, SpendingModel } from '../../../core/interfaces/models';
import { UserSelectors } from '../../../core/state/selectors/user.selectors';
import { amountStringToNumber } from '../../../core/utils/helper.functions';
import { ActionsEnum } from '../../../core/enums/action-sheet.enums';

@Component({
  selector: 'app-edit-spending-modal',
  templateUrl: './edit-spending-modal.component.html',
  styleUrls: ['./edit-spending-modal.component.scss'],
})
export class EditSpendingModalComponent implements OnInit {
  @Input() spendingItem!: SpendingModel;
  @Input() categories!: CategoryModel[];

  currency$: Observable<string> = this.store.select(UserSelectors.selectCurrency);
  formGroup?: FormGroup;

  constructor(
    private store: Store<AppState>,
    private modalCtrl: ModalController,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.formGroup = this.fb.group({
      amount: this.fb.control(this.spendingItem?.amount, Validators.required),
      category: this.fb.control(this.spendingItem?.category, Validators.required),
      description: this.fb.control(this.spendingItem?.description),
    });
  }

  cancel() {
    return this.modalCtrl.dismiss(null, ActionsEnum.Cancel);
  }

  confirm() {
    const { amount, category, description } = this.formGroup?.value;
    const newItem = {
      ...this.spendingItem,
      amount: (typeof amount !== "number") ? amountStringToNumber(amount) : amount,
      categoryId: category.id,
      description,
    };
    delete newItem.category;
    return this.modalCtrl.dismiss(newItem, ActionsEnum.Confirm);
  }
}
