import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { SpendingEntity } from '../interface/entities';

@Injectable()
export class DataBaseService {

  constructor(private firestore: AngularFirestore) {
  }

  getAllSpending(userId: string): Observable<SpendingEntity[]> {
    return this.firestore.collection<SpendingEntity>('spending',ref => ref.where('uid', '==', userId))
      .valueChanges();
  }

  getSpending(id: string, userId: string): Observable<SpendingEntity | undefined> {
    return this.firestore.collection<SpendingEntity>('spending',ref => ref.where('uid', '==', userId))
      .doc(id).valueChanges();
  }

  createSpending(spending: SpendingEntity, userId: string): void {
    this.firestore.collection<SpendingEntity>('spending').doc(spending.id).set(spending).then();
  }

  updateSpending(spending: SpendingEntity): void {
    this.firestore.collection<SpendingEntity>('spending').doc(spending.id).update(spending).then();
  }

  deleteSpending(id: string, userId: string): void {
    this.firestore.collection<SpendingEntity>('spending',ref => ref.where('uid', '==', userId))
      .doc(id).delete().then();
  }
}
