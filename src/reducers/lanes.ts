import { Action, Lane } from 'types';
import { getLanes } from 'actions';

const initialState = null as Lane[];

export const lanesReducer = (state = initialState, { type, payload }: Action) => {
  switch (type) {
    case getLanes.SUCCESS:
      return payload;

    case getLanes.FAILURE:
      return initialState;

    default:
      return state;
  }
}
