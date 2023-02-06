import { Component, Input, OnInit } from '@angular/core';

import { BankTransaction, CategoryModel, SpendingModel } from '../../../core/interfaces/models';
import { ListItemTypeEnum } from '../../../core/enums/list-item.enum';

@Component({
  selector: 'app-transactions-list-item',
  templateUrl: './transactions-list-item.component.html',
  styleUrls: ['./transactions-list-item.component.scss'],
})
export class TransactionListItemComponent implements OnInit {
  @Input() currency!: string | null;
  @Input() spending!: SpendingModel | BankTransaction;
  @Input() type!: ListItemTypeEnum;
  @Input() amount!: number;
  @Input() name!: string;
  @Input() description!: string;
  @Input() category!: CategoryModel;
  @Input() date?: string;


  listItemTypeEnum = ListItemTypeEnum;
  background = '#fc6183';
  icon = 'card-outline';

  ngOnInit() {
    if (this.type === ListItemTypeEnum.spending) {
      this.background = this.spending.category?.icon.background || '';
      this.icon = this.spending.category?.icon.iconType || '';
    }
  }
}
