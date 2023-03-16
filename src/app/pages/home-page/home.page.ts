import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable, Subscription, map, timer } from 'rxjs';
import { ActionSheetController } from '@ionic/angular';
import { AppState } from '@capacitor/app';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

import { BankTransaction, CategoryModel, GroupedSpendingModel, SpendingModel } from '../../core/interfaces/models';
import { SpendingActions } from '../../core/state/actions/spending.actions';
import { MainRoutesEnum, PageRoutesEnum } from '../../core/enums/routing.enums';
import { SpendingSelectors } from '../../core/state/selectors/spending.selectors';
import { UserSelectors } from '../../core/state/selectors/user.selectors';
import { BankAccountsSelectors } from '../../core/state/selectors/bank-accounts.selectors';
import { CategoriesSelectors } from '../../core/state/selectors/categories.selectors';
import { ActionsEnum, ActionsRoleEnum } from '../../core/enums/action-sheet.enums';
import { getCurrentMonthPeriodUNIX } from '../../core/utils/time.utils';
import { ListItemTypeEnum } from '../../core/enums/list-item.enum';
import { SpendingService } from '../../core/services/spending/spending.service';

@Component({
  selector: 'app-home-page',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit, OnDestroy {
  formGroup: FormGroup;
  categories!: CategoryModel[];
  currentTime!: string;

  listItemTypeEnum = ListItemTypeEnum;
  actionsEnum = ActionsEnum;
  subscription: Subscription = new Subscription();

  groupedSpendingList$: Observable<GroupedSpendingModel[]> = this.store.select(SpendingSelectors.selectGroupedSpendingItemList);
  bankTransactions$: Observable<BankTransaction[]> = this.store.select(BankAccountsSelectors.filteredTransactions);
  totalAmount$: Observable<number> = this.store.select(SpendingSelectors.selectHomeTotalAmount);
  currency$: Observable<string> = this.store.select(UserSelectors.selectCurrency);

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private router: Router,
    private actionSheetController: ActionSheetController,
    private modalCtrl: ModalController,
    private translateService: TranslateService,
    public spendingService : SpendingService,
  ) {
    this.formGroup = this.fb.group({ amount: this.fb.control(null) });
  }

  ngOnInit() {
    this.subscription.add(this.store.select(UserSelectors.selectUserCategories)
      .subscribe((categories: CategoryModel[] | undefined) => {
        if (categories) this.categories = categories
      }),
    );
    this.subscription.add(timer(0, 1000)
      .pipe(map(() => moment().format('DD MMMM')))
      .subscribe(time => this.currentTime = time)
    );
    this.store.dispatch(SpendingActions.homeSpendingList({ payload: getCurrentMonthPeriodUNIX() }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  navigateToStatisticsPage(): void {
    this.router.navigate([`${MainRoutesEnum.Pages}/${PageRoutesEnum.Statistics}`]).then();
  }

  async transactionClick(transaction: BankTransaction): Promise<void> {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: this.translateService.instant('general.actions.add'),
          data: {
            action: ActionsEnum.Add,
          },
        },
        // {
        //   text: this.translateService.instant('general.actions.delete'),
        //   role: ActionsRoleEnum.Destructive,
        //   data: {
        //     action: ActionsEnum.Delete,
        //   },
        // },
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
      id: '',
      bankId: transaction.id,
      amount: transaction.amount,
      time: transaction.time,
      description: transaction.description ?? '',
      currencyCode: +transaction.currencyCode,
      comment: transaction.comment ?? '',
      accountId: transaction.accountId,
      accountType: transaction.accountType,
      categoryId: this.categories.find(item => item.name === 'Other')?.id
    }
    this.store.dispatch(SpendingActions.createSpendingItem({ payload: spendingItem }));
  }

  async addSpending(type: ActionsEnum.Add | ActionsEnum.Edit): Promise<void> {
    await this.spendingService.openConfigureSpendingModal({
      type,
      categories: this.categories,
      amount: this.formGroup.value.amount
    })
    this.formGroup?.reset();
  }
}
