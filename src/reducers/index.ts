import { combineReducers } from 'redux';
import { authReducer } from './auth';
import { lanesReducer } from './lanes';
import { errorReducer } from './error';
import { statsReducer } from './stats';
import { modeReducer } from './mode';
import { reviewsReducer } from './reviews';

export default combineReducers({
  token: authReducer,
  lanes: lanesReducer,
  error: errorReducer,
  stats: statsReducer,
  mode: modeReducer,
  reviews: reviewsReducer,
});
