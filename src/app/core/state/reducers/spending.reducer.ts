import { Action, createReducer, on } from '@ngrx/store';

import { SpendingModel, SpendingSortModel, TimePeriodModel } from '../../interfaces/models';
import { SpendingActions } from '../actions/spending.actions';
import { SortFieldEnum, DirectionEnum } from '../../enums/spending.enums';

export interface SpendingState {
  homeSpendingList: SpendingModel[];
  statSpendingList: SpendingModel[];
  statTimePeriod: TimePeriodModel | null,
  spendingSort: SpendingSortModel;
}

export const initialState: SpendingState = {
  homeSpendingList: [],
  statSpendingList: [],
  statTimePeriod: null,
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
  on(SpendingActions.homeSpendingListSuccess, (state, { payload }) => ({ ...state, homeSpendingList: payload })),
  on(SpendingActions.statSpendingListSuccess, (state, { payload }) => ({ ...state, statSpendingList: payload })),
  on(SpendingActions.updateStatTimePeriod, (state, { payload }) => ({ ...state, statTimePeriod: payload })),
);
