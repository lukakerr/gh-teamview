import { Action, Review } from 'types';
import { getReviews } from 'actions';

const initialState = null as Review[];

export const reviewsReducer = (state = initialState, { type, payload }: Action) => {
  switch (type) {
    case getReviews.SUCCESS:
      return payload;

    case getReviews.FAILURE:
      return initialState;

    default:
      return state;
  }
}
