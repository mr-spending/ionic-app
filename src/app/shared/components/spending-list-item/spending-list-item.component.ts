import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';

import { SpendingModel } from '../../../core/interfaces/models';
import { ListItemTypeEnum } from '../../../core/enums/list-item.enum';
import { DateFormatEnum } from '../../../core/enums/date-format.enums';

@Component({
  selector: 'app-spending-list-item',
  templateUrl: './spending-list-item.component.html',
  styleUrls: ['./spending-list-item.component.scss'],
})
export class SpendingListItemComponent implements OnInit {
  @Input() currency!: string | null;
  @Input() spending!: SpendingModel;
  @Input() type!: ListItemTypeEnum.bankTransaction | ListItemTypeEnum.spending;
  @Input() selected = false;
  @Input() showIcon = true;
  @Input() showCategory = true;

  moment = moment;
  listItemTypeEnum = ListItemTypeEnum;
  DateFormatEnum = DateFormatEnum;
  background = '#fc6183';
  icon = 'card-outline';

  ngOnInit() {
    if (this.type === ListItemTypeEnum.spending) {
      this.background = this.spending.category?.icon.background || '';
      this.icon = this.spending.category?.icon.iconType || '';
    }
  }
}
