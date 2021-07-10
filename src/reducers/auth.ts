import { Action } from 'types';
import { setToken, getLanes } from 'actions';

const initialState = '';

export const authReducer = (state = initialState, { type, payload }: Action) => {
  switch (type) {
    case setToken.TRIGGER:
      return payload;

    case getLanes.FAILURE:
      return initialState;

    default:
      return state;
  }
}
