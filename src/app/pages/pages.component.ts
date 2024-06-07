import {
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Subscription, take } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { AppState } from '@capacitor/app';
import * as moment from 'moment';
import { ActionSheetController, GestureController, GestureDetail } from '@ionic/angular';
import { Router } from '@angular/router';

import { AuthService } from '../auth/services/auth.service';
import { PageRoutesEnum } from '../core/enums/routing.enums';
import { UserSelectors } from '../core/state/selectors/user.selectors';
import { BankAccountsActions } from '../core/state/actions/bank-accounts.actions';
import { SpendingActions } from '../core/state/actions/spending.actions';
import { ViewPeriod } from '../core/enums/time.enum';
import { TabModel } from '../core/interfaces/models';


@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnDestroy {
  @ViewChild('tabsRef', { static: false, read: ElementRef })
  tabsRef!: ElementRef;

  subscription: Subscription = new Subscription();
  tabs = [
    {
      route: PageRoutesEnum.CreateSpending,
      icon: 'home',
      nameKey: 'home.title',
    },
    {
      route: PageRoutesEnum.Statistics,
      icon: 'list-outline',
      nameKey: 'statistics.title',
    },
  ];
  selectedTab: string = this.tabs[0].route;

  constructor(
    private authService: AuthService,
    private translateService: TranslateService,
    private store: Store<AppState>,
    private gestureCtrl: GestureController,
    private actionSheetCtrl: ActionSheetController,
    private router: Router,
  ) {
    this.store.dispatch(
      SpendingActions.updateStatTimePeriod({
        payload: {
          startDate: moment().startOf(ViewPeriod.Month).unix(),
          endDate: moment().endOf(ViewPeriod.Month).unix(),
        },
      })
    );
    this.subscription.add(
      this.store
        .select(UserSelectors.selectUser)
        .pipe(take(2))
        .subscribe(
          (value) =>
            value?.monoBankAccounts?.length &&
            this.store.dispatch(BankAccountsActions.checkWebHook())
        )
    );
  }

  ngAfterViewInit() {
    this.setupSwipeGesture();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  setupSwipeGesture() {
    const gesture = this.gestureCtrl.create({
      el: this.tabsRef.nativeElement,
      gestureName: 'swipe',
      onEnd: (ev) => this.onSwipe(ev),
      gesturePriority: 500
    }, true);
    gesture.enable(true);
  }

  onSwipe(ev: GestureDetail) {
    if (ev.deltaX > 100) {
      this.swipePrev();
    } else if (ev.deltaX < -100) {
      this.swipeNext();
    }
  }

  swipeNext() {
    const currentIndex = this.tabs.findIndex(
      (tab) => tab.route === this.selectedTab
    );
    const nextIndex = (currentIndex + 1) % this.tabs.length;
    this.selectTab(this.tabs[nextIndex]);
  }

  swipePrev() {
    const currentIndex = this.tabs.findIndex(
      (tab) => tab.route === this.selectedTab
    );
    const prevIndex = (currentIndex - 1 + this.tabs.length) % this.tabs.length;
    this.selectTab(this.tabs[prevIndex]);
  }

  selectTab(tab: TabModel) {
    this.selectedTab = tab.route;
    
    this.router.navigateByUrl('pages/' + this.selectedTab);
    
  }

  async onMoreOpen() {
    const actionSheet = await this.actionSheetCtrl.create({
      header:this.translateService.instant('general.more'),
      buttons: [
        {
          text: this.translateService.instant('settings.title'),
          handler: () => {
            this.router.navigateByUrl('pages/' + PageRoutesEnum.Setting);
          },
        },
        {
          text: this.translateService.instant('user.title'),
          handler: () => {
            this.router.navigateByUrl('pages/' + PageRoutesEnum.User);
          },
        }
      ]
    });
    await actionSheet.present();
  }
}
