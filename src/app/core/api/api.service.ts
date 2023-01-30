import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { HttpClient, HttpParams } from '@angular/common/http';

import { CategoryDto, SpendingDto, UserDto } from '../interfaces/dto';
import { SpendingModel, TimePeriodModel } from '../interfaces/models';
import { environment } from '../../../environments/environment';

@Injectable()
export class ApiService {

  path = environment.baseUrl;

  constructor(private firestore: AngularFirestore, private http: HttpClient) {
  }

  /** User Data */
  addUser(user: UserDto): Observable<UserDto> {
    return this.http.post<UserDto>(this.path + 'user', user);
  }

  getUserData(userId: string): Observable<UserDto> {
    return this.http.get<UserDto>(this.path + `user/${ userId }`);
  }

  /** Spending Data */
  getAllSpending(): Observable<SpendingDto[]> {
    return this.http.get<SpendingDto[]>(this.path + 'spending');
  }

  getSpendingList(timePeriod: TimePeriodModel): Observable<SpendingDto[]> {
    let params = new HttpParams();
    params = params.append('startDate', timePeriod.startDate.toString());
    params = params.append('endDate', timePeriod.endDate.toString());
    return this.http.get<SpendingDto[]>(this.path + 'spending', { params });
  }

  getSpending(id: string): Observable<SpendingDto | undefined> {
    return this.http.get<SpendingDto>(this.path + `spending/${ id }`);
  }

  createSpending(spendingModel: SpendingModel): Observable<SpendingDto | undefined> {
    return this.http.post<SpendingDto | undefined>(this.path + 'spending', spendingModel);
  }

  updateSpendingItem(spending: SpendingDto): Observable<SpendingDto[]> {
    return this.http.patch<SpendingDto[]>(this.path + `spending/${ spending.id }`, spending);
  }

  deleteSpending(id: string): Observable<void> {
    return this.http.delete<void>(this.path + `spending/${ id }`);
  }

  /** Categories Data */

  getAllCategories(): Observable<CategoryDto[]> {
    return this.http.get<CategoryDto[]>(this.path + 'categories');
  }
}
