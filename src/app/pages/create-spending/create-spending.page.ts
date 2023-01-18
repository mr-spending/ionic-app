import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Guid } from 'typescript-guid';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ActionSheetController, IonAccordionGroup } from '@ionic/angular';
import { AppState } from '@capacitor/app';

import { BankTransaction, CategoryModel, SpendingModel } from '../../core/interfaces/models';
import { SpendingActions } from '../../core/state/actions/spending.actions';
import { MainRoutesEnum, PageRoutesEnum } from '../../core/enums/routing.enums';
import { SpendingSelectors } from '../../core/state/selectors/spending.selectors';
import { UserSelectors } from '../../core/state/selectors/user.selectors';
import { BankAccountsSelectors } from '../../core/state/selectors/bank-accounts.selectors';
import { CategoriesSelectors } from '../../core/state/selectors/categories.selectors';

@Component({
  selector: 'app-create-spending.page',
  templateUrl: 'create-spending.page.html',
  styleUrls: ['create-spending.page.scss']
})
export class CreateSpendingPage {
  formGroup: FormGroup;
  spendingList$: Observable<SpendingModel[]> = this.store.select(SpendingSelectors.selectSpendingListWithParams);
  bankTransactions$: Observable<BankTransaction[]> = this.store.select(BankAccountsSelectors.filteredTransactions);
  totalAmount$: Observable<number> = this.store.select(SpendingSelectors.selectTotalAmount);
  currency$: Observable<string> = this.store.select(UserSelectors.selectCurrency);
  categories$: Observable<CategoryModel[]> = this.store.select(CategoriesSelectors.selectCategories);
  @ViewChild('accordionGroup', { static: true }) accordionGroup!: IonAccordionGroup;

  get isAccordionExpanded() {
    return this.accordionGroup.value === 'form-group';
  }

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private router: Router,
    private actionSheetController: ActionSheetController
  ) {
    this.formGroup = this.fb.group({
      amount: this.fb.control(null, Validators.required),
      category: this.fb.control({ id: "4e9b14f4-465c-4bbc-9338-42ddbe5fadf7", name: "other" }, Validators.required),
      description: this.fb.control(null),
    });
  }

  addSpending(): void {
    const groupValue = this.formGroup.value;
    console.log(groupValue.ca)
    const spendingItem: SpendingModel = {
      amount: Number(groupValue.amount.replace(/[^0-9.-]+/g,"")) * 100,
      category: groupValue.category.name,
      description: groupValue.description,
      id: Guid.create().toString(),
      categoryId: groupValue.category.id,
      time: Math.floor(new Date().getTime() / 1000)
    }
    this.store.dispatch(SpendingActions.addSpending({ payload: spendingItem }));
    this.formGroup.reset();
  }

  navigateToExpensesList(): void {
    this.router.navigate([`${MainRoutesEnum.Pages}/${PageRoutesEnum.ExpensesList}`]).then();
  }

  toggleAccordion = () => {
    const nativeEl = this.accordionGroup;
    if (nativeEl.value === 'form-group') {
      nativeEl.value = undefined;
    } else {
      nativeEl.value = 'form-group';
    }
  };

  async transactionClick(transaction: BankTransaction) {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: 'Add',
          // role: 'destructive',
          data: {
            action: 'add',
          },
        },
        {
          text: 'Edit',
          data: {
            action: 'edit',
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ],
    });

    await actionSheet.present();
    const result = await actionSheet.onDidDismiss();

    switch (result.data.action) {
      case 'add': this.addTransaction(transaction);
    }
  }

  addTransaction(transaction: BankTransaction): void {
    const spendingItem: SpendingModel = {
      id: transaction.id,
      amount: transaction.amount,
      time: transaction.time,
      category: '',
      description: transaction.description ?? '',
      currencyCode: transaction.currencyCode,
      comment: transaction.comment ?? '',
      accountId: transaction.accountId,
      accountType: transaction.accountType,
    }
    this.store.dispatch(SpendingActions.addSpending({ payload: spendingItem }));
  }

  async spendingClick(item: SpendingModel) {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          data: {
            action: 'delete',
          },
        },
        {
          text: 'Edit',
          data: {
            action: 'edit',
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ],
    });

    await actionSheet.present();
    const result = await actionSheet.onDidDismiss();

    switch (result.data.action) {
      case 'delete': this.removeSpendingItem(item.id);
    }
  }

  removeSpendingItem(id: string) {
    this.store.dispatch(SpendingActions.removeSpending({ payload: id }));
  }

  updateSpendingList() {
    this.store.dispatch(SpendingActions.spendingList());
  }
}
