import { createRoutine } from 'redux-saga-routines';

import * as types from 'actions/types';

export const getLanes = createRoutine(types.LANES.GET_LANES);
