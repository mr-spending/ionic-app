import { Action, createReducer, on } from '@ngrx/store';

import { SpendingModel, SpendingSortModel } from '../../interfaces/models';
import { SpendingActions } from '../actions/spending.actions';
import { SortFieldEnum, DirectionEnum } from '../../enums/spending.enums';
import * as moment from 'moment';

const defaultFilter = {
  from: moment().startOf('month').unix(),
  to: moment().unix(),
};

export interface SpendingState {
  HomePageList: SpendingModel[];
  StatisticsPageList: SpendingModel[];
  spendingSort: SpendingSortModel;
}

export const initialState: SpendingState = {
  HomePageList: [],
  StatisticsPageList: [],
  spendingSort: {
    field: SortFieldEnum.Time,
    direction: DirectionEnum.Descending,
  },
};

export function spendingReducer(state: SpendingState | undefined, action: Action): SpendingState {
  return reducer(state, action);
}

export const spendingStateKey = 'spending';

const reducer = createReducer<SpendingState>(
  initialState,
  on(SpendingActions.spendingHomePageListSuccess, (state, { payload }) => ({ ...state, HomePageList: payload })),
  on(SpendingActions.spendingStatisticsPageListSuccess, (state, { payload }) => ({ ...state, StatisticsPageList: payload })),
);
