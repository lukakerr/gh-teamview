import { combineReducers } from 'redux';
import { authReducer } from './auth';
import { lanesReducer } from './lanes';
import { errorReducer } from './error';

export default combineReducers({
  token: authReducer,
  lanes: lanesReducer,
  error: errorReducer,
});
