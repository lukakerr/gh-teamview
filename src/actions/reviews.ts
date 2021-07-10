import { createRoutine } from 'redux-saga-routines';

import * as types from 'actions/types';

export const getReviews = createRoutine(types.REVIEWS.GET_REVIEWS);
