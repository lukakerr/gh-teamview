import { createRoutine } from 'redux-saga-routines';

import * as types from 'actions/types';

export const setMode = createRoutine(types.MODE.SET_MODE);
