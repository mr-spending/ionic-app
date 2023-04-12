import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable, Subscription, map, timer } from 'rxjs';
import { ActionSheetController } from '@ionic/angular';
import { AppState } from '@capacitor/app';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { SocketService } from '../../core/services/socket/socket.service';
import * as moment from 'moment';

import { CategoryModel, GroupedSpendingModel, SpendingModel } from '../../core/interfaces/models';
import { SpendingActions } from '../../core/state/actions/spending.actions';
import { MainRoutesEnum, PageRoutesEnum } from '../../core/enums/routing.enums';
import { SpendingSelectors } from '../../core/state/selectors/spending.selectors';
import { UserSelectors } from '../../core/state/selectors/user.selectors';
import { ActionsEnum, ActionsRoleEnum } from '../../core/enums/action-sheet.enums';
import { getCurrentMonthPeriodUNIX } from '../../core/utils/time.utils';
import { ListItemTypeEnum } from '../../core/enums/list-item.enum';
import { SpendingService } from '../../core/services/spending/spending.service';
import { SpendingBasketModalComponent } from './spending-basket-modal/spending-basket-modal.component';
import { SpendingStatusEnum } from '../../core/enums/spending-status.enum';

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
    public spendingService : SpendingService,
    private socketService: SocketService,
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
    
    this.subscription.add( this.socketService.newTransactions$.subscribe((_message: string) => {
      this.store.dispatch(SpendingActions.pendingSpendingList());
    }))

    this.store.dispatch(SpendingActions.homeSpendingList({ payload: getCurrentMonthPeriodUNIX() }));
    this.store.dispatch(SpendingActions.pendingSpendingList());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  navigateToStatisticsPage(): void {
    this.router.navigate([`${MainRoutesEnum.Pages}/${PageRoutesEnum.Statistics}`]).then();
  }

  async openSpendingBasketModal(): Promise<void> {
    const modal = await this.modalCtrl.create({ component: SpendingBasketModalComponent });
    modal.present();
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
      case ActionsEnum.Delete: await this.confirmTransactionRemove(transaction.id); break
    }
  }

  async confirmTransactionRemove(id: string): Promise<void> {
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
    actionSheet.present();
    const { role } = await actionSheet.onWillDismiss();
    switch (role) {
      case ActionsRoleEnum.Confirm: this.deleteTransaction(id); break
    }
  }

  addTransaction(transaction: SpendingModel): void {
    const spendingItem: SpendingModel = { ...transaction, status: SpendingStatusEnum.Accepted }
    this.store.dispatch(SpendingActions.updateSpendingItem({ payload: spendingItem }));
  }

  deleteTransaction(id: string): void {
    this.store.dispatch(SpendingActions.hardDeleteSpendingItem({ payload: id }));
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
