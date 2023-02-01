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
import { Guid } from 'typescript-guid';
import { SpendingActions } from '../../../core/state/actions/spending.actions';

@Component({
  selector: 'app-edit-spending-modal',
  templateUrl: './add-spending-modal.component.html',
  styleUrls: ['./add-spending-modal.component.scss'],
})
export class AddSpendingModalComponent implements OnInit {
  @Input() amount!: number;
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
      amount: this.fb.control(this.amount, Validators.required),
      category: this.fb.control(null, Validators.required),
      description: this.fb.control(null),
    });
  }

  cancel() {
    return this.modalCtrl.dismiss(null, ActionsEnum.Cancel);
  }

  confirm() {
    const groupValue = this.formGroup?.value;
    const spendingItem: SpendingModel = {
      amount: amountStringToNumber(groupValue.amount),
      category: groupValue.category.name,
      description: groupValue.description,
      id: Guid.create().toString(),
      categoryId: groupValue.category.id,
      time: Math.floor(new Date().getTime() / 1000)
    }
    this.store.dispatch(SpendingActions.createSpendingItem({ payload: spendingItem }));
    this.formGroup?.reset();
    return this.modalCtrl.dismiss('', ActionsEnum.Confirm);
  }
}
