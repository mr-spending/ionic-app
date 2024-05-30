import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '@capacitor/app';
import { Observable, take } from 'rxjs';

import { CategoryModel, SpendingModel } from '../../../core/interfaces/models';
import { UserSelectors } from '../../../core/state/selectors/user.selectors';
import { amountStringToNumber } from '../../../core/utils/helper.functions';
import { ActionsEnum } from '../../../core/enums/action-sheet.enums';
import { SpendingActions } from '../../../core/state/actions/spending.actions';
import { EditCategoryModalComponent } from '../../../pages/settings-page/edit-category-modal/edit-category-modal.component';

@Component({
  selector: 'app-configure-spending-modal',
  templateUrl: './configure-spending-modal.component.html',
  styleUrls: ['./configure-spending-modal.component.scss'],
})
export class ConfigureSpendingModalComponent implements OnInit {
  @ViewChild('inputElement') inputElement!: ElementRef;
  
  @Input() amount!: number | undefined;
  @Input() spendingItem!: SpendingModel | undefined;
  @Input() categories!: CategoryModel[];
  @Input() type!: ActionsEnum.Add | ActionsEnum.Edit;
  @Input() isAmountChangeable = false;

  currency$: Observable<string> = this.store.select(UserSelectors.selectCurrency);
  actionsEnum = ActionsEnum;
  formGroup?: FormGroup;
  selectedCategory: CategoryModel | null = this.spendingItem?.category ||  null

  constructor(
    private store: Store<AppState>,
    private modalCtrl: ModalController,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.formGroup = this.fb.group({
      amount: this.fb.control(this.spendingItem?.amount || this.amount, Validators.required),
      category: this.fb.control(this.spendingItem?.category || null, Validators.required),
      description: this.fb.control(this.spendingItem?.description || null),
    });
    this.selectedCategory = this.spendingItem?.category || null
  }

  ionViewDidEnter() {
    this.inputElement.nativeElement.focus();
  }

  async addCategory() {
    const modal = await this.modalCtrl.create({
      component: EditCategoryModalComponent,
      componentProps: { type: ActionsEnum.Add },
      cssClass: 'fullscreen'
    });
    await modal.present();
    await modal.onWillDismiss();
    this.store.select(UserSelectors.selectUserCategories)
      .pipe(take(2))
      .subscribe((categories: CategoryModel[] | undefined) => {
        if (categories) this.categories = categories;
      });
  }

  cancel() {
    return this.modalCtrl.dismiss(null, ActionsEnum.Cancel);
  }

  confirm() {
    const { amount, category, description } = this.formGroup?.value;
    let newAmount = amount * 100;
    switch (this.type) {
      case ActionsEnum.Add: {
        const newItem = {
          amount: amountStringToNumber(newAmount),
          description: description,
          categoryId: category.id,
          time: Math.floor(new Date().getTime() / 1000)
        };
        this.store.dispatch(SpendingActions.createSpendingItem({ payload: newItem as SpendingModel }));
        break;
      }
      case ActionsEnum.Edit: {
        const newItem = {
          ...this.spendingItem,
          amount: (typeof newAmount !== "number") ? amountStringToNumber(newAmount) : newAmount,
          categoryId: category.id,
          description
        };
        delete newItem.category;
        this.store.dispatch(SpendingActions.updateSpendingItem({ payload: newItem as SpendingModel }));
      }
    }
    this.formGroup?.reset();
    return this.modalCtrl.dismiss(null, ActionsEnum.Confirm);
  }

  selectCategory(category: CategoryModel) {
    this.formGroup?.get('category')!.setValue(category);
    this.selectedCategory = category;
  }


}
