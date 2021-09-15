import { Action, Stats } from 'types';
import { getStats } from 'actions';

const initialState = {
  data: null as Stats,
  loading: false,
};

export const statsReducer = (state = initialState, { type, payload }: Action) => {
  switch (type) {
    case getStats.TRIGGER:
      return {
        ...state,
        loading: true,
      };

    case getStats.SUCCESS:
      return {
        data: payload,
        loading: false,
      };

    case getStats.FAILURE:
      return initialState;

    default:
      return state;
  }
}
