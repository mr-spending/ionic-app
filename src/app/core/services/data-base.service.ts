import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';

import { SpendingDto } from '../dto/spending.dto';

@Injectable()
export class DataBaseService {

  private spending: AngularFireList<SpendingDto>;

  constructor(private db: AngularFireDatabase) {
    this.spending = this.db.list<SpendingDto>('spending');
  }

  getSpending(): Observable<SpendingDto[]> {
    return this.spending.valueChanges();
  }

  addSpending(spending: SpendingDto): void {
    this.spending.push(spending);
  }
}
