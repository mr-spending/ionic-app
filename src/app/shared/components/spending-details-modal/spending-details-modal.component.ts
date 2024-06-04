import { Component, Input, OnInit } from '@angular/core';
import { AppState } from '@capacitor/app';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ActionsEnum } from 'src/app/core/enums/action-sheet.enums';
import { CategoryModel } from 'src/app/core/interfaces/models';
import { UserSelectors } from 'src/app/core/state/selectors/user.selectors';

@Component({
  selector: 'app-spending-details-modal',
  templateUrl: './spending-details-modal.component.html',
  styleUrls: ['./spending-details-modal.component.scss'],
})
export class SpendingDetailsModalComponent implements OnInit {
  @Input() amount!: number 
  @Input() description!: string 
  @Input() category!: CategoryModel
  @Input() date!: Date

  actionsEnum = ActionsEnum;

  currency$: Observable<string> = this.store.select(UserSelectors.selectCurrency);
  

  constructor(
    private store: Store<AppState>,
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {}

  cancel() {
    return this.modalCtrl.dismiss(null, ActionsEnum.Cancel);
  }


}
