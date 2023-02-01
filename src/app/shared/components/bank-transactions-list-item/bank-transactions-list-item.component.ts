import { Component, Input, OnInit } from '@angular/core';

import { BankTransaction } from '../../../core/interfaces/models';

@Component({
  selector: 'app-bank-transactions-list-item',
  templateUrl: './bank-transactions-list-item.component.html',
  styleUrls: ['./bank-transactions-list-item.component.scss'],
})
export class BankTransactionListItemComponent implements OnInit {
  @Input() currency!: string | null;
  @Input() spending!: BankTransaction;

  constructor() { }

  ngOnInit() {}

}
