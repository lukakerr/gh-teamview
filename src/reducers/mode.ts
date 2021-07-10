import { Action, Mode } from 'types';
import { setMode } from 'actions';

const initialState = 'team' as Mode;

export const modeReducer = (state = initialState, { type, payload }: Action) => {
  switch (type) {
    case setMode.TRIGGER:
      return payload;

    default:
      return state;
  }
}
