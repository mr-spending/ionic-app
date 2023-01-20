import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Guid } from 'typescript-guid';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ActionSheetController, IonAccordionGroup } from '@ionic/angular';
import { AppState } from '@capacitor/app';
import { ModalController } from '@ionic/angular';

import { BankTransaction, CategoryModel, SpendingModel } from '../../core/interfaces/models';
import { SpendingActions } from '../../core/state/actions/spending.actions';
import { MainRoutesEnum, PageRoutesEnum } from '../../core/enums/routing.enums';
import { SpendingSelectors } from '../../core/state/selectors/spending.selectors';
import { UserSelectors } from '../../core/state/selectors/user.selectors';
import { BankAccountsSelectors } from '../../core/state/selectors/bank-accounts.selectors';
import { CategoriesSelectors } from '../../core/state/selectors/categories.selectors';
import { EditSpendingModalComponent } from '../../components/edit-spending-modal/edit-spending-modal.component';
import { currencyDirectiveDataToNumber } from '../../core/utils/helper.functions';
import { ActionEnum, ActionRoleEnum, ActionTextEnum } from '../../core/enums/action-sheet.enums';

@Component({
  selector: 'app-create-spending.page',
  templateUrl: 'create-spending.page.html',
  styleUrls: ['create-spending.page.scss']
})
export class CreateSpendingPage implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  formGroup: FormGroup;
  spendingList$: Observable<SpendingModel[]> = this.store.select(SpendingSelectors.selectSpendingListWithParams);
  bankTransactions$: Observable<BankTransaction[]> = this.store.select(BankAccountsSelectors.filteredTransactions);
  totalAmount$: Observable<number> = this.store.select(SpendingSelectors.selectTotalAmount);
  currency$: Observable<string> = this.store.select(UserSelectors.selectCurrency);
  categories!: CategoryModel[];
  @ViewChild('accordionGroup', { static: true }) accordionGroup!: IonAccordionGroup;

  get isAccordionExpanded() {
    return this.accordionGroup.value === 'form-group';
  }

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private router: Router,
    private actionSheetController: ActionSheetController,
    private modalCtrl: ModalController,
  ) {
    this.formGroup = this.fb.group({
      amount: this.fb.control(null, Validators.required),
      category: this.fb.control(null, Validators.required),
      description: this.fb.control(null),
    });
  }

  ngOnInit() {
    this.subscription.add(this.store.select(CategoriesSelectors.selectCategories)
      .subscribe((categories: CategoryModel[]) => this.categories = categories)
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addSpending(): void {
    const groupValue = this.formGroup.value;
    const spendingItem: SpendingModel = {
      amount: currencyDirectiveDataToNumber(groupValue.amount),
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
          text: ActionTextEnum.Add,
          data: {
            action: ActionEnum.Add,
          },
        },
        {
          text: ActionTextEnum.Edit,
          data: {
            action: ActionEnum.Edit,
          },
        },
        {
          text: ActionTextEnum.Cancel,
          role: ActionRoleEnum.Cancel,
          data: {
            action: ActionEnum.Cancel,
          },
        },
      ],
    });

    await actionSheet.present();
    const result = await actionSheet.onDidDismiss();

    switch (result.data.action) {
      case ActionEnum.Add: this.addTransaction(transaction);
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
          text: ActionTextEnum.Delete,
          role: ActionRoleEnum.Destructive,
          data: {
            action: ActionEnum.Delete,
          },
        },
        {
          text: ActionTextEnum.Edit,
          data: {
            action: ActionEnum.Edit,
          },
        },
        {
          text: ActionTextEnum.Cancel,
          role: ActionRoleEnum.Cancel,
          data: {
            action: ActionEnum.Cancel,
          },
        },
      ],
    });

    await actionSheet.present();
    const result = await actionSheet.onDidDismiss();

    switch (result.data.action) {
      case ActionEnum.Delete:
        this.removeSpendingItem(item.id);
        break;
      case ActionEnum.Edit:
        this.openModal(item);
    }
  }

  removeSpendingItem(id: string) {
    this.store.dispatch(SpendingActions.removeSpending({ payload: id }));
  }

  updateSpendingList() {
    this.store.dispatch(SpendingActions.spendingList());
  }

  async openModal(item: SpendingModel) {
    const modal = await this.modalCtrl.create({
      component: EditSpendingModalComponent,
      componentProps: { transaction: item, categories: this.categories }
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === ActionEnum.Confirm) {
      this.store.dispatch(SpendingActions.updateSpendingItem({ payload: data }));
    }
  }
}
