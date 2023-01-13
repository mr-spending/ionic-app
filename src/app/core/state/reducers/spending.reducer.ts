import { Action, createReducer, on } from '@ngrx/store';

import { SpendingFilterModel, SpendingModel, SpendingSortModel } from '../../interfaces/models';
import { SpendingActions } from '../actions/spending.actions';
import { SortFieldEnum, DirectionEnum } from '../../enums/spending.enums';
import * as moment from 'moment';

export interface SpendingState {
  spendingList: SpendingModel[];
  spendingSort: SpendingSortModel;
  spendingFilter: SpendingFilterModel;
}

export const initialState: SpendingState = {
  spendingList: [],
  spendingSort: {
    field: SortFieldEnum.Time,
    direction: DirectionEnum.Descending,
  },
  spendingFilter: {
    from: moment().startOf('month').unix(),
    to: moment().unix(),
  }
};

export function spendingReducer(state: SpendingState | undefined, action: Action): SpendingState {
  return reducer(state, action);
}

export const spendingStateKey = 'spending';

const reducer = createReducer<SpendingState>(
  initialState,
  on(SpendingActions.spendingListSuccess, (state, { payload }) => ({ ...state, spendingList: payload })),
);
