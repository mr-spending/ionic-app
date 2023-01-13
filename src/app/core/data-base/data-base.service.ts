import { Injectable } from '@angular/core';
import { from, Observable, take } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { CategoryEntity, SpendingEntity, UserEntity } from '../interfaces/entities';
import { SpendingModel } from '../interfaces/models';

@Injectable()
export class DataBaseService {

  constructor(private firestore: AngularFirestore) {
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
  getAllSpending(userId: string): Observable<SpendingEntity[]> {
    return this.firestore.collection<SpendingEntity>('spending',ref => ref.where('userId', '==', userId))
      .valueChanges();
  }

  getSpending(id: string, userId: string): Observable<SpendingEntity | undefined> {
    return this.firestore.collection<SpendingEntity>('spending',ref => ref.where('userId', '==', userId))
      .doc(id).valueChanges().pipe(take(1));
  }

  createSpending(spendingModel: SpendingModel, userId: string, categoryId: string | undefined): Observable<SpendingEntity | undefined> {
    const spending: SpendingEntity = { ...spendingModel, userId, categoryId };
    this.firestore.collection<SpendingEntity>('spending').doc(spending.id).set(spending).then();
    return this.getSpending(spending.id, userId).pipe(take(1));
  }

  updateSpending(spending: SpendingEntity): void {
    this.firestore.collection<SpendingEntity>('spending').doc(spending.id).update(spending).then();
  }

  deleteSpending(id: string, userId: string): Observable<void> {
    return from(this.firestore.collection<SpendingEntity>('spending',ref => ref.where('userId', '==', userId))
      .doc(id).delete());
  }

  /** Categories Data */

  getAllCategories(): Observable<CategoryEntity[]> {
    return this.firestore.collection<CategoryEntity>('categories').valueChanges();
  }
}
