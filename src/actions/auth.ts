import { createRoutine } from 'redux-saga-routines';

import * as types from 'actions/types';

export const setToken = createRoutine(types.AUTH.SET_TOKEN);
