import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-spending-list-item',
  templateUrl: './spending-list-item.component.html',
  styleUrls: ['./spending-list-item.component.scss'],
})
export class SpendingListItemComponent implements OnInit {
  @Input() currency!: string | null;

  constructor() { }

  ngOnInit() {}

}
