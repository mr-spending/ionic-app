import { Component, Input, OnInit } from '@angular/core';

import { SpendingModel } from '../../../core/interfaces/models';

@Component({
  selector: 'app-spending-list-item',
  templateUrl: './spending-list-item.component.html',
  styleUrls: ['./spending-list-item.component.scss'],
})
export class SpendingListItemComponent implements OnInit {
  @Input() currency!: string | null;
  @Input() spending!: SpendingModel;

  constructor() { }

  ngOnInit() {}

}
