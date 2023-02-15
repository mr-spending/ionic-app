import { Component, Input, OnInit } from '@angular/core';

import { BankTransaction, SpendingModel } from '../../../core/interfaces/models';
import { ListItemTypeEnum } from '../../../core/enums/list-item.enum';

@Component({
  selector: 'app-spending-list-item',
  templateUrl: './spending-list-item.component.html',
  styleUrls: ['./spending-list-item.component.scss'],
})
export class SpendingListItemComponent implements OnInit {
  @Input() currency!: string | null;
  @Input() spending!: SpendingModel | BankTransaction;
  @Input() type!: ListItemTypeEnum.bankTransaction | ListItemTypeEnum.spending;
  @Input() showIcon = true;
  @Input() showCategory = true;

  listItemTypeEnum = ListItemTypeEnum;
  background = '#fc6183';
  icon = 'card-outline';

  ngOnInit() {
    if (this.isSpendingModel(this.spending)) {
      this.background = this.spending.category?.icon.background || '';
      this.icon = this.spending.category?.icon.iconType || '';
    }
  }

  isSpendingModel(spending: SpendingModel | BankTransaction): spending is SpendingModel {
    return 'category' in spending;
  }
}
