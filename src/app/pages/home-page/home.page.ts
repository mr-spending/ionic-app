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

import { BankTransaction, CategoryModel, SpendingModel } from '../../core/interfaces/models';
import { SpendingActions } from '../../core/state/actions/spending.actions';
import { MainRoutesEnum, PageRoutesEnum } from '../../core/enums/routing.enums';
import { SpendingSelectors } from '../../core/state/selectors/spending.selectors';
import { UserSelectors } from '../../core/state/selectors/user.selectors';
import { BankAccountsSelectors } from '../../core/state/selectors/bank-accounts.selectors';
import { CategoriesSelectors } from '../../core/state/selectors/categories.selectors';
import { ConfigureSpendingModalComponent } from '../../shared/components/configure-spending-modal/configure-spending-modal.component';
import { ActionsEnum, ActionsRoleEnum } from '../../core/enums/action-sheet.enums';
import { getCurrentMonthPeriodUNIX } from '../../core/utils/time.utils';
import { ListItemTypeEnum } from '../../core/enums/list-item.enum';

@Component({
  selector: 'app-home-page',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  formGroup: FormGroup;
  groupedSpendingList$: Observable<SpendingModel[][]> = this.store.select(SpendingSelectors.selectGroupedSpendingItemList);
  bankTransactions$: Observable<BankTransaction[]> = this.store.select(BankAccountsSelectors.filteredTransactions);
  totalAmount$: Observable<number> = this.store.select(SpendingSelectors.selectTotalAmount);
  currency$: Observable<string> = this.store.select(UserSelectors.selectCurrency);
  categories!: CategoryModel[];
  currentTime: any;
  intervalId: any;
  listItemTypeEnum = ListItemTypeEnum;
  actionsEnum = ActionsEnum;
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
    private translateService: TranslateService,
  ) {
    this.formGroup = this.fb.group({ amount: this.fb.control(null) });
  }

  ngOnInit() {
    this.subscription.add(this.store.select(CategoriesSelectors.selectCategories)
      .subscribe((categories: CategoryModel[]) => this.categories = categories)
    );
    this.updateSpendingList();
    this.intervalId = setInterval(() => {
      this.currentTime = moment().format('DD MMMM  HH:mm');
    }, 1000);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    clearInterval(this.intervalId);
  }

  navigateToStatisticsPage(): void {
    this.router.navigate([`${MainRoutesEnum.Pages}/${PageRoutesEnum.Statistics}`]).then();
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
          text: this.translateService.instant('general.actions.delete'),
          role: ActionsRoleEnum.Destructive,
          data: {
            action: ActionsEnum.Delete,
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
      description: transaction.description ?? '',
      currencyCode: transaction.currencyCode,
      comment: transaction.comment ?? '',
      accountId: transaction.accountId,
      accountType: transaction.accountType,
      categoryId: '4e9b14f4-465c-4bbc-9338-42ddbe5fadf7'
    }
    this.store.dispatch(SpendingActions.createSpendingItem({ payload: spendingItem }));
  }

  async spendingClick(item: SpendingModel) {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: this.translateService.instant('general.actions.edit'),
          data: {
            action: ActionsEnum.Edit,
          },
        },
        {
          text: this.translateService.instant('general.actions.delete'),
          role: ActionsRoleEnum.Destructive,
          data: {
            action: ActionsEnum.Delete,
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
        this.openConfigureSpendingModal(ActionsEnum.Edit, item);
    }
  }

  removeSpendingItem(id: string) {
    this.store.dispatch(SpendingActions.deleteSpendingItem({ payload: id }));
  }

  updateSpendingList() {
    this.store.dispatch(SpendingActions.homeSpendingList({ payload: getCurrentMonthPeriodUNIX() }));
  }

  getSpendingDate(date: string): string {
    const dateToday = moment().format('YYYY-MM-DD');
    const dateYesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
    let currentValue = moment(date).format('DD MMMM YYYY');
    switch (date) {
      case dateToday:
        currentValue = `${this.translateService.instant('general.dates.today')}, ${moment(date).format('DD MMMM')}`;
        break;
      case dateYesterday:
        currentValue = `${this.translateService.instant('general.dates.yesterday')}, ${moment(date).format('DD MMMM')}`;
    }
    return currentValue;
  }

  async openConfigureSpendingModal(type: ActionsEnum.Add | ActionsEnum.Edit, item?: SpendingModel) {
    const modal = await this.modalCtrl.create({
      component: ConfigureSpendingModalComponent,
      componentProps: {
        amount: this.formGroup.value.amount,
        categories: this.categories,
        spendingItem: item,
        type
      }
    });
    modal.present();
    await modal.onWillDismiss();
    this.formGroup?.reset();
  }
}
