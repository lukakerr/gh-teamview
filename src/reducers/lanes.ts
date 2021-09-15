import { Action, Lane } from 'types';
import { getLanes } from 'actions';

const initialState = {
  data: [] as Lane[],
  loading: false,
};

export const lanesReducer = (state = initialState, { type, payload }: Action) => {
  switch (type) {
    case getLanes.TRIGGER:
      return {
        ...state,
        loading: true,
      };

    case getLanes.SUCCESS:
      return {
        data: payload,
        loading: false,
      };

    case getLanes.FAILURE:
      return initialState;

    default:
      return state;
  }
}
