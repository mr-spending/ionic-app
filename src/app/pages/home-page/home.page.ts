import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ActionSheetController, IonAccordionGroup } from '@ionic/angular';
import { AppState } from '@capacitor/app';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

import { BankTransaction, CategoryModel, SpendingListItemModel, SpendingModel } from '../../core/interfaces/models';
import { SpendingActions } from '../../core/state/actions/spending.actions';
import { MainRoutesEnum, PageRoutesEnum } from '../../core/enums/routing.enums';
import { SpendingSelectors } from '../../core/state/selectors/spending.selectors';
import { UserSelectors } from '../../core/state/selectors/user.selectors';
import { BankAccountsSelectors } from '../../core/state/selectors/bank-accounts.selectors';
import { CategoriesSelectors } from '../../core/state/selectors/categories.selectors';
import { EditSpendingModalComponent } from '../components/edit-spending-modal/edit-spending-modal.component';
import { ActionsEnum, ActionsRoleEnum } from '../../core/enums/action-sheet.enums';
import { getCurrentMonthPeriodUNIX } from '../../core/utils/time.utils';
import { AddSpendingModalComponent } from '../components/add-spending-modal/add-spending-modal.component';

@Component({
  selector: 'app-home-page',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  formGroup: FormGroup;
  groupedSpendingList$: Observable<SpendingListItemModel[][]> = this.store.select(SpendingSelectors.selectGroupedSpendingItemList);
  bankTransactions$: Observable<BankTransaction[]> = this.store.select(BankAccountsSelectors.filteredTransactions);
  totalAmount$: Observable<number> = this.store.select(SpendingSelectors.selectTotalAmount);
  currency$: Observable<string> = this.store.select(UserSelectors.selectCurrency);
  categories!: CategoryModel[];
  @ViewChild('accordionGroup', { static: true }) accordionGroup!: IonAccordionGroup;

  private dateYesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
  private dateToday = moment().format('YYYY-MM-DD');

  get isAccordionExpanded() {
    return this.accordionGroup.value === 'form-group';
  }

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private router: Router,
    private actionSheetController: ActionSheetController,
    private modalCtrl: ModalController,
    private translateService: TranslateService,
  ) {
    this.formGroup = this.fb.group({ amount: this.fb.control(null) });
  }

  ngOnInit() {
    this.subscription.add(this.store.select(CategoriesSelectors.selectCategories)
      .subscribe((categories: CategoryModel[]) => this.categories = categories)
    );
    this.updateSpendingList();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  navigateToExpensesList(): void {
    this.router.navigate([`${MainRoutesEnum.Pages}/${PageRoutesEnum.ExpensesList}`]).then();
  }

  async transactionClick(transaction: BankTransaction) {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: this.translateService.instant('general.actions.add'),
          data: {
            action: ActionsEnum.Add,
          },
        },
        {
          text: this.translateService.instant('general.actions.edit'),
          data: {
            action: ActionsEnum.Edit,
          },
        },
        {
          text: this.translateService.instant('general.actions.cancel'),
          role: ActionsRoleEnum.Cancel,
          data: {
            action: ActionsEnum.Cancel,
          },
        },
      ],
    });

    await actionSheet.present();
    const result = await actionSheet.onDidDismiss();

    switch (result.data?.action) {
      case ActionsEnum.Add: this.addTransaction(transaction);
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
    this.store.dispatch(SpendingActions.createSpendingItem({ payload: spendingItem }));
  }

  async spendingClick(item: SpendingModel) {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: this.translateService.instant('general.actions.delete'),
          role: ActionsRoleEnum.Destructive,
          data: {
            action: ActionsEnum.Delete,
          },
        },
        {
          text: this.translateService.instant('general.actions.edit'),
          data: {
            action: ActionsEnum.Edit,
          },
        },
        {
          text: this.translateService.instant('general.actions.cancel'),
          role: ActionsRoleEnum.Cancel,
          data: {
            action: ActionsEnum.Cancel,
          },
        },
      ],
    });

    await actionSheet.present();
    const result = await actionSheet.onDidDismiss();

    switch (result.data?.action) {
      case ActionsEnum.Delete:
        this.removeSpendingItem(item.id);
        break;
      case ActionsEnum.Edit:
        this.openEditSpendingModal(item);
    }
  }

  removeSpendingItem(id: string) {
    this.store.dispatch(SpendingActions.deleteSpendingItem({ payload: id }));
  }

  updateSpendingList() {
    this.store.dispatch(SpendingActions.homeSpendingList({ payload: getCurrentMonthPeriodUNIX() }));
  }

  getSpendingDate(date: string): string {
    let currentValue = moment(date).format('DD MMMM YYYY');
    switch (date) {
      case this.dateToday:
        currentValue = `${this.translateService.instant('general.dates.today')}, ${moment(date).format('DD MMMM')}`;
        break;
      case this.dateYesterday:
        currentValue = `${this.translateService.instant('general.dates.yesterday')}, ${moment(date).format('DD MMMM')}`;
    }
    return currentValue;
  }

  async openAddSpendingModal() {
    const modal = await this.modalCtrl.create({
      component: AddSpendingModalComponent,
      componentProps: { amount: this.formGroup.value.amount, categories: this.categories }
    });
    modal.present();
    await modal.onWillDismiss();
    this.formGroup?.reset();
  }

  async openEditSpendingModal(item: SpendingModel) {
    const modal = await this.modalCtrl.create({
      component: EditSpendingModalComponent,
      componentProps: { spendingItem: item, categories: this.categories }
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === ActionsEnum.Confirm) {
      this.store.dispatch(SpendingActions.updateSpendingItem({ payload: data }));
    }
  }
}
