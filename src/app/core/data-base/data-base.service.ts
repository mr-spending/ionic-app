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
  addUser(user: UserEntity): Observable<void> {
    return from(this.firestore.collection<UserEntity>('users').doc(user.id).set(user).then()).pipe(take(1));
  }

  getUserData(userId: string): Observable<UserEntity | undefined> {
    return this.firestore.collection<UserEntity>('users',ref => ref.where('id', '==', userId))
      .doc(userId).valueChanges().pipe(take(1));
  }

  /** Spending Data */
  getAllSpending(): Observable<SpendingEntity[]> {
    return this.http.get<SpendingEntity[]>(this.path + 'spending');
  }

  getSpending(id: string): Observable<SpendingEntity | undefined> {
    return this.http.get<SpendingEntity>(this.path + `spending/${id}`);
  }

  createSpending(spendingModel: SpendingModel, userId: string): Observable<SpendingEntity | undefined> {
    const spending: SpendingEntity = { ...spendingModel, userId };
    return this.http.post<SpendingEntity | undefined>(this.path + 'spending', spending);
  }

  updateSpendingItem(spending: SpendingEntity): Observable<SpendingEntity[]> {
    return this.http.patch<SpendingEntity[]>(this.path + `spending/${spending.id}`, spending);
  }

  deleteSpending(id: string): Observable<void> {
    return this.http.delete<void>(this.path + `spending/${id}`);
  }

  /** Categories Data */

  getAllCategories(): Observable<CategoryEntity[]> {
    return this.firestore.collection<CategoryEntity>('categories').valueChanges();
  }
}
