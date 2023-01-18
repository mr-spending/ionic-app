import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '@capacitor/app';
import { Observable } from 'rxjs';

import { CategoryModel, SpendingModel } from '../../core/interfaces/models';
import { UserSelectors } from '../../core/state/selectors/user.selectors';

@Component({
  selector: 'app-edit-spending-modal',
  templateUrl: './edit-spending-modal.component.html',
  styleUrls: ['./edit-spending-modal.component.scss'],
})
export class EditSpendingModalComponent implements OnInit {
  @Input() transaction: SpendingModel | undefined = undefined;
  @Input() categories: CategoryModel[] | undefined = undefined;
  currency$: Observable<string> = this.store.select(UserSelectors.selectCurrency);
  formGroup: FormGroup | undefined = undefined;

  constructor(
    private store: Store<AppState>,
    private modalCtrl: ModalController,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.formGroup = this.fb.group({
      amount: this.fb.control(this.transaction?.amount, Validators.required),
      category: this.fb.control(this.transaction?.category, Validators.required),
      description: this.fb.control(this.transaction?.description),
    });
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    const { amount, category, description } = this.formGroup?.value;
    return this.modalCtrl.dismiss({
      ...this.transaction,
      amount: Number(amount.replace(/[^0-9.-]+/g,"")) * 100,
      category,
      categoryId: this.categories?.find(c => c.name === category)?.id,
      description,
    }, 'confirm');
  }
}
