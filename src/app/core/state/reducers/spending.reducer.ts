import { Action, createReducer, on } from '@ngrx/store';

import { SpendingFilterModel, SpendingModel, SpendingSortModel } from '../../interfaces/models';
import { SpendingActions } from '../actions/spending.actions';
import { SortFieldEnum, DirectionEnum } from '../../enums/spending.enums';
import * as moment from 'moment';

const defaultFilter = {
  from: moment().startOf('month').unix(),
  to: moment().unix(),
};

export interface SpendingState {
  spendingList: SpendingModel[];
  spendingSort: SpendingSortModel;
  spendingFilter: SpendingFilterModel;
  spendingStatisticsFilter: SpendingFilterModel;
}

export const initialState: SpendingState = {
  spendingList: [],
  spendingSort: {
    field: SortFieldEnum.Time,
    direction: DirectionEnum.Descending,
  },
  spendingFilter: defaultFilter,
  spendingStatisticsFilter: defaultFilter,
};

export function spendingReducer(state: SpendingState | undefined, action: Action): SpendingState {
  return reducer(state, action);
}

export const spendingStateKey = 'spending';

const reducer = createReducer<SpendingState>(
  initialState,
  on(SpendingActions.spendingListSuccess, (state, { payload }) => ({ ...state, spendingList: payload })),
  on(SpendingActions.setSpendingFilter, (state, { payload }) => ({ ...state, spendingFilter: payload })),
  on(SpendingActions.setSpendingStatisticsFilter, (state, { payload }) => ({ ...state, spendingStatisticsFilter: payload })),
);
