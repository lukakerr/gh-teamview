import {
  all,
  put,
  call,
  select,
  takeEvery,
  delay,
} from 'redux-saga/effects';

import { Action, Member, State } from 'types';
import { getLanes } from 'actions';

import * as config from 'config/default.json';

const endpoints = {
  teamMembers: (team: string) => `${config.api}/orgs/${config.org}/teams/${team}/members?per_page=100`,
  pulls: (author: string) => `${config.api}/search/issues?q=repo:${config.org}/${config.repo} is:open author:${author}`,
};

// How many ms to throttle API calls to /search, as /search is rate limited to 30 requests per minute:
// https://docs.github.com/en/rest/reference/search#rate-limit
const SEARCH_THROTTLE = 2500;

const getToken = (state: State) => state.token;

export function* getLanesWatcher() {
  yield takeEvery(getLanes.TRIGGER, getLanesSaga);
}

export function* getLanesSaga(action: Action): any {
  yield put(getLanes.request(action.payload));

  const token = yield select(getToken);

  const headers = new Headers();
  headers.set('Authorization', 'Basic ' + btoa(config.auth.username + ":" + token));

  try {
    const members: Member[] = [];
    for (const team of config.teams) {
      const membersResponse = yield call(fetch, endpoints.teamMembers(team), {
        method: 'GET',
        headers,
      });
      const membersJson = yield call([membersResponse, membersResponse.json]);
      if (membersResponse.status < 200 || membersResponse.status >= 300) {
        console.error(new Error('Could not get response from Github'));
      }
      members.push(...(membersJson || []));
    }
    const dedupedMembers = Array.from(new Map(members.map(m => [m.login, m])).values());

    const pulls: any[] = [];

    for (const member of dedupedMembers) {
      yield delay(SEARCH_THROTTLE);
      const pullsResponse = yield call(fetch, endpoints.pulls(member.login), {
        method: 'GET',
        headers,
      });

      const pullsJson = yield call([pullsResponse, pullsResponse.json]);

      if (pullsResponse.status < 200 || pullsResponse.status >= 300) {
        console.error(new Error('Could not get response from Github'));
      }

      pulls.push(...pullsJson.items);
    }

    const lanes = members.map((member: Member) => {
      const pullsForMember = pulls
          .filter((pull: any) => pull.user.login === member.login)
          .map((pull: any) => ({
            url: pull.html_url,
            title: pull.title,
            created_at: new Date(pull.created_at),
            updated_at: new Date(pull.updated_at),
            labels: pull.labels.map((label: any) => ({
              name: label.name,
              color: label.color,
            })),
          }));

      return {
        member: {
          login: member.login,
          html_url: member.html_url,
          avatar_url: member.avatar_url,
        },
        pulls: pullsForMember,
      };
    });

    yield put(getLanes.success(lanes));
  } catch (error) {
    yield put(getLanes.failure({ error }));
  } finally {
    yield put(getLanes.fulfill());
  }
}

/**
 * All lane sagas
 */
export function* lanesSaga() {
  yield all([
    getLanesWatcher(),
  ]);
}
