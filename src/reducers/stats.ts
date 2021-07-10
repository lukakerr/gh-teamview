import { Action, Stats } from 'types';
import { getStats } from 'actions';

const initialState = null as Stats;

export const statsReducer = (state = initialState, { type, payload }: Action) => {
  switch (type) {
    case getStats.SUCCESS:
      return payload;

    case getStats.FAILURE:
      return initialState;

    default:
      return state;
  }
}
