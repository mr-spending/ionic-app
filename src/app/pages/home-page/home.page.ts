import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable, Subscription, map, timer } from 'rxjs';
import { ActionSheetController } from '@ionic/angular';
import { AppState } from '@capacitor/app';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

import { CategoryModel, GroupedSpendingModel, SpendingModel } from '../../core/interfaces/models';
import { SpendingActions } from '../../core/state/actions/spending.actions';
import { MainRoutesEnum, PageRoutesEnum } from '../../core/enums/routing.enums';
import { SpendingSelectors } from '../../core/state/selectors/spending.selectors';
import { UserSelectors } from '../../core/state/selectors/user.selectors';
import { ActionsEnum, ActionsRoleEnum } from '../../core/enums/action-sheet.enums';
import {
  getCurrentMonth,
  getCurrentMonthPeriodUNIX,
  getMonthPeriodCurrentMonthMinusValueUNIX
} from '../../core/utils/time.utils';
import { ListItemTypeEnum } from '../../core/enums/list-item.enum';
import { SpendingService } from '../../core/services/spending/spending.service';
import { SpendingStatusEnum } from '../../core/enums/spending-status.enum';
import { SpendingBasketModalComponent } from './spending-basket-modal/spending-basket-modal.component';
import { DateFormatEnum } from '../../core/enums/date-format.enums';
import { MonobankAccountSettingsComponent } from 'src/app/shared/components/monobank-account-settings-modal/monobank-account-settings.component';

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
  fullHomepageSpendingList: SpendingModel[] = [];
  fullPendingSpendingList: SpendingModel[] = [];
  subscription: Subscription = new Subscription();
  selectedSpending: string[] = [];
  allNewSpendingsSelected: boolean = false;
  deleteTask: string[] = [];
  isSelectionActive = false;
  countOfAdditionalMonths = 0;
  getCurrentMonth = getCurrentMonth;

  groupedSpendingList$: Observable<GroupedSpendingModel[]> = this.store.select(SpendingSelectors.selectGroupedSpendingItemList);
  pendingSpendingList$: Observable<SpendingModel[]> = this.store.select(SpendingSelectors.selectSortedPendingSpendingList);
  totalAmount$: Observable<number> = this.store.select(SpendingSelectors.selectHomeTotalAmount);
  currency$: Observable<string> = this.store.select(UserSelectors.selectCurrency);

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private router: Router,
    private actionSheetController: ActionSheetController,
    private modalCtrl: ModalController,
    private translateService: TranslateService,
    public spendingService: SpendingService,
  ) {
    this.formGroup = this.fb.group({ amount: this.fb.control(null) });
  }

  ngOnInit() {
    this.subscription.add(this.store.select(UserSelectors.selectUserCategories)
      .subscribe((categories: CategoryModel[] | undefined) => {
        if (categories) this.categories = categories;
      })
    );
    this.subscription.add(
      this.store.select(SpendingSelectors.selectHomeSpendingList).subscribe((spendingList: SpendingModel[]) => {
        this.fullHomepageSpendingList = spendingList;
        if (this.deleteTask.length) {
          this.multiDeleteTransactions(this.deleteTask);
          this.deleteTask = [];
        }
      })
    );
    this.subscription.add(
      this.store.select(SpendingSelectors.selectPendingSpendingList).subscribe((spendingList: SpendingModel[]) => {
        this.fullPendingSpendingList = spendingList;
      })
    );
    this.subscription.add(timer(0, 1000)
      .pipe(map(() => moment().format(DateFormatEnum.DD__MMMM)))
      .subscribe(time => this.currentTime = time)
    );
    this.store.dispatch(SpendingActions.homeSpendingList({ payload: getCurrentMonthPeriodUNIX() }));
    this.store.dispatch(SpendingActions.pendingSpendingList());
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async openSpendingBasketModal(): Promise<void> {
    const modal = await this.modalCtrl.create({ component: SpendingBasketModalComponent, cssClass: 'fullscreen' });
    await modal.present();
    await modal.onWillDismiss();
  }

  async monoAccSettingsOpen(): Promise<void> {
    const modal = await this.modalCtrl.create({ component: MonobankAccountSettingsComponent, cssClass: 'fullscreen' });
    await modal.present();
    await modal.onWillDismiss();
  }

  async transactionClickActionsModal(transaction: SpendingModel): Promise<void> {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: this.translateService.instant('general.actions.add'),
          data: {
            action: ActionsEnum.Add,
          },
        },
        {
          text: this.translateService.instant('general.actions.addAs'),
          data: {
            action: ActionsEnum.AddAs,
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
      case ActionsEnum.Add: this.addTransaction(transaction); break
      case ActionsEnum.AddAs: await this.spendingService.openConfigureSpendingModal({
        type: ActionsEnum.Edit,
        categories: this.categories,
        item: { ...transaction, status: SpendingStatusEnum.Accepted }
      }); break
      case ActionsEnum.Delete: await this.confirmTransactionRemove([transaction.id]); break
    }
  }

  async confirmTransactionRemove(ids: string[], isMultiDelete?: boolean): Promise<void> {
    const actionSheet = await this.actionSheetController.create({
      header: this.translateService.instant('general.messages.areYouSure'),
      buttons: [
        {
          text: this.translateService.instant('general.actions.yes'),
          role: ActionsRoleEnum.Confirm,
        },
        {
          text: this.translateService.instant('general.actions.no'),
          role: ActionsRoleEnum.Cancel,
        },
      ],
    });
    await actionSheet.present();
    const { role } = await actionSheet.onWillDismiss();
    switch (role) {
      case ActionsRoleEnum.Confirm:
        isMultiDelete
          ? this.multiDeleteTransactions(ids)
          : this.deleteTransaction(ids[0]);
        break;
    }
  }

  async mergeTransactions(ids: string[]): Promise<void> {
    const selectedSpending = this.fullHomepageSpendingList.filter(spending => ids.includes(spending.id));
    const selectedPendingSpending = this.fullPendingSpendingList.filter(spending => ids.includes(spending.id));
    if (selectedPendingSpending?.length) selectedSpending.push(...selectedPendingSpending);
    this.deleteTask = this.selectedSpending;
    await this.spendingService.openConfigureSpendingModal({
      type: ActionsEnum.Add,
      categories: this.categories,
      amount: selectedSpending.reduce((acc: number, spending: SpendingModel) => {
        console.log(acc + spending.amount, spending.amount)
        return acc + spending.amount
      }, 0),
      isAmountChangeable: true
    });
    this.isSelectionActive = false;
    this.selectedSpending = [];
  }

  addTransaction(transaction: SpendingModel): void {
    const spendingItem: SpendingModel = { ...transaction, status: SpendingStatusEnum.Accepted };
    this.store.dispatch(SpendingActions.updateSpendingItem({ payload: spendingItem }));
  }

  deleteTransaction(id: string): void {
    this.store.dispatch(SpendingActions.hardDeleteSpendingItem({ payload: id }));
  }

  selectionClick(id: string) {
    this.selectedSpending.includes(id)
      ? this.selectedSpending = this.selectedSpending.filter(item => item !== id)
      : this.selectedSpending.push(id);
    if (!this.selectedSpending.length) {
      this.allNewSpendingsSelected = false
    }
  }

  selectAllNewSpendings(pendingSpendingList: SpendingModel[]){
    if (this.allNewSpendingsSelected) {
      pendingSpendingList.forEach(item => {
        this.selectedSpending = this.selectedSpending.filter(i => i !== item.id)
      })
    } else {
      pendingSpendingList.forEach(item => {
        if (!this.selectedSpending.includes(item.id)) {
          this.selectedSpending.push(item.id)
        }
      })
    }
    this.allNewSpendingsSelected = !this.allNewSpendingsSelected

  }

  multiDeleteTransactions(ids: string[]) {
    this.store.dispatch(SpendingActions.deleteSpendingByIds({ payload: ids }));
    this.selectedSpending = [];
    this.isSelectionActive = false;
  }

  async addSpending(type: ActionsEnum.Add | ActionsEnum.Edit): Promise<void> {
    await this.spendingService.openConfigureSpendingModal({
      type,
      categories: this.categories,
      amount: this.formGroup.value.amount
    });
    this.formGroup?.reset();
  }

  loadMoreData(event: any) {
    this.countOfAdditionalMonths++;
    this.store.dispatch(SpendingActions.homeSpendingList({
      payload: getMonthPeriodCurrentMonthMinusValueUNIX(this.countOfAdditionalMonths)
    }));
    event.target.complete();
  }
}
