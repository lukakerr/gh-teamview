import { Action } from 'types';
import { getLanes, getReviews, getStats, setToken } from 'actions';

const initialState = null as Error;

export const errorReducer = (state = initialState, { type, payload }: Action) => {
  switch (type) {
    case setToken.TRIGGER:
      return initialState;

    case getLanes.FAILURE:
    case getStats.FAILURE:
      return payload;

    case getLanes.SUCCESS:
    case getStats.SUCCESS:
    case getReviews.SUCCESS:
      return initialState;

    default:
      return state;
  }
}
