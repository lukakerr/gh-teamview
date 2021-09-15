import { Action, Review } from 'types';
import { getReviews } from 'actions';

const initialState = {
  data: [] as Review[],
  loading: false,
};

export const reviewsReducer = (state = initialState, { type, payload }: Action) => {
  switch (type) {
    case getReviews.TRIGGER:
      return {
        ...state,
        loading: true,
      };

    case getReviews.SUCCESS:
      return {
        data: payload,
        loading: false,
      };

    case getReviews.FAILURE:
      return initialState;

    default:
      return state;
  }
}
