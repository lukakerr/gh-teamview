import { Action } from 'types';
import { setToken } from 'actions';

const initialState = '';

export const authReducer = (state = initialState, { type, payload }: Action) => {
  switch (type) {
    case setToken.TRIGGER:
      return payload;

    default:
      return state;
  }
}
