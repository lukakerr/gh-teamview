import { createRoutine } from 'redux-saga-routines';

import * as types from 'actions/types';

export const getStats = createRoutine(types.STATS.GET_STATS);
