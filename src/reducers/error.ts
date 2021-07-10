import { Action } from 'types';
import { getLanes, setToken } from 'actions';

const initialState = null as Error;

export const errorReducer = (state = initialState, { type, payload }: Action) => {
  switch (type) {
    case setToken.TRIGGER:
      return initialState;

    case getLanes.FAILURE:
      return payload;

    default:
      return state;
  }
}
