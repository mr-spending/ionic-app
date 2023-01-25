import { Injectable } from '@angular/core';
import { from, Observable, take } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { HttpClient } from '@angular/common/http';

import { CategoryEntity, SpendingEntity, UserEntity } from '../interfaces/entities';
import { SpendingModel } from '../interfaces/models';
import { environment } from '../../../environments/environment';

@Injectable()
export class DataBaseService {

  path = environment.baseUrl;

  constructor(private firestore: AngularFirestore, private http: HttpClient) {
  }

  /** User Data */
  addUser(user: UserEntity): Observable<UserEntity> {
    return this.http.post<UserEntity>(this.path + 'user', user);
  }

  getUserData(userId: string): Observable<UserEntity> {
    return this.http.get<UserEntity>(this.path + `user/${userId}`);
  }

  /** Spending Data */
  getAllSpending(): Observable<SpendingEntity[]> {
    return this.http.get<SpendingEntity[]>(this.path + 'spending');
  }

  getSpending(id: string): Observable<SpendingEntity | undefined> {
    return this.http.get<SpendingEntity>(this.path + `spending/${id}`);
  }

  createSpending(spendingModel: SpendingModel): Observable<SpendingEntity | undefined> {
    return this.http.post<SpendingEntity | undefined>(this.path + 'spending', spendingModel);
  }

  updateSpendingItem(spending: SpendingEntity): Observable<SpendingEntity[]> {
    return this.http.patch<SpendingEntity[]>(this.path + `spending/${spending.id}`, spending);
  }

  deleteSpending(id: string): Observable<void> {
    return this.http.delete<void>(this.path + `spending/${id}`);
  }

  /** Categories Data */

  getAllCategories(): Observable<CategoryEntity[]> {
    return this.http.get<CategoryEntity[]>(this.path + 'categories');
  }
}
