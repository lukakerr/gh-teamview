import {
  all,
  put,
  call,
  select,
  takeEvery,
  delay,
} from 'redux-saga/effects';

import { Action, State, Lane, Review } from 'types';
import { getStats, getLanes, getReviews } from 'actions';

import * as config from 'config/default.json';

const endpoints = {
  reviewsRequested: (author: string) => `${config.api}/search/issues?q=repo:${config.org}/${config.repo} is:pr is:open review-requested:${author}`,
};

// How many ms to throttle API calls to /search, as /search is rate limited to 30 requests per minute:
// https://docs.github.com/en/rest/reference/search#rate-limit
const SEARCH_THROTTLE = 2500;

const getToken = (state: State) => state.token;
const getMembers = (state: State) => (state.lanes.data || []).map((l: Lane) => l.member);
const getPullRequests = (state: State) => (state.lanes.data || []).reduce((acc, curr) => acc + curr.pulls.length, 0);

export function* getStatsWatcher() {
  yield takeEvery(getLanes.FULFILL, getStatsSaga);
}

export function* getStatsSaga(action: Action): any {
  yield put(getStats.trigger());
  yield put(getReviews.trigger());
  yield put(getStats.request(action.payload));

  const token = yield select(getToken);
  const members = yield select(getMembers);

  const headers = new Headers();
  headers.set('Authorization', 'Basic ' + btoa(config.auth.username + ":" + token));

  try {
    const reviewsMap: { [key: string]: Review } = {};

    for (const member of members) {
      yield delay(SEARCH_THROTTLE);
      const reviewsRequestedResponse = yield call(fetch, endpoints.reviewsRequested(member.login), {
        method: 'GET',
        headers,
      });

      const reviewsRequestedJson = yield call([reviewsRequestedResponse, reviewsRequestedResponse.json]);

      if (reviewsRequestedResponse.status < 200 || reviewsRequestedResponse.status >= 300) {
        console.error('Could not get response from Github');
        continue;
      }

      reviewsRequestedJson.items.forEach((item: any) => {
        if (reviewsMap[item.html_url]) {
          reviewsMap[item.html_url].requested.push(member);
        } else {
          reviewsMap[item.html_url] = {
            url: item.html_url,
            title: item.title,
            created_at: item.created_at,
            updated_at: item.updated_at,
            labels: item.labels,
            requested: [member],
          };
        }
      });
    }

    const dedupedReviews = Object.values(reviewsMap)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    yield put(getReviews.success(dedupedReviews));

    const pullRequests = yield select(getPullRequests);

    const stats = {
      totalMembers: members.length,
      totalPullRequests: pullRequests,
      totalReviewRequests: dedupedReviews.length,
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
