import {
  all,
  put,
  call,
  select,
  takeEvery,
} from 'redux-saga/effects';

import { Action, State, Lane } from 'types';
import { getStats, getLanes } from 'actions';

import * as config from 'config/default.json';

const endpoints = {
  reviewsRequested: (author: string) => `${config.api}/search/issues?q=repo:${config.org}/${config.repo} is:open review-requested:${author}`,
};

const getToken = (state: State) => state.token;
const getMembers = (state: State) => state.lanes.map((l: Lane) => l.member);
const getPullRequests = (state: State) => state.lanes.reduce((acc, curr) => acc + curr.pulls.length, 0);

export function* getStatsWatcher() {
  yield takeEvery(getLanes.FULFILL, getStatsSaga);
}

export function* getStatsSaga(action: Action): any {
  yield put(getStats.request(action.payload));

  const token = yield select(getToken);
  const members = yield select(getMembers);

  const headers = new Headers();
  headers.set('Authorization', 'Basic ' + btoa(config.auth.username + ":" + token));

  try {
    let reviewsRequested = 0;

    for (const member of members) {
      const reviewsRequestedResponse = yield call(fetch, endpoints.reviewsRequested(member.login), {
        method: 'GET',
        headers,
      });

      const reviewsRequestedJson = yield call([reviewsRequestedResponse, reviewsRequestedResponse.json]);

      if (reviewsRequestedResponse.status < 200 || reviewsRequestedResponse.status >= 300) {
        yield put(getStats.failure(new Error('Could not get response from Github')));
        return;
      }

      reviewsRequested += reviewsRequestedJson.total_count;
    }

    const pullRequests = yield select(getPullRequests);

    const stats = {
      totalMembers: members.length,
      totalPullRequests: pullRequests,
      totalReviewRequests: reviewsRequested,
    };

    yield put(getStats.success(stats));
  } catch (error) {
    yield put(getStats.failure({ error }));
  } finally {
    yield put(getStats.fulfill());
  }
}

/**
 * All stats sagas
 */
export function* statsSaga() {
  yield all([
    getStatsWatcher(),
  ]);
}
