import {
  all,
  put,
  call,
  select,
  takeEvery,
} from 'redux-saga/effects';

import { Action, Member, State } from 'types';
import { getLanes } from 'actions';

import * as config from 'config/default.json';

const endpoints = {
  teamMembers: () => `${config.api}/orgs/${config.org}/teams/${config.team}/members`,
  pulls: (author: string) => `${config.api}/search/issues?q=repo:${config.org}/${config.repo} is:open author:${author}`,
};

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
    const membersResponse = yield call(fetch, endpoints.teamMembers(), {
      method: 'GET',
      headers,
    });

    const membersJson = yield call([membersResponse, membersResponse.json]);

    if (membersResponse.status < 200 || membersResponse.status >= 300) {
      yield put(getLanes.failure(new Error('Could not get response from Github')));
      return;
    }

    const pulls: any[] = [];

    for (const member of membersJson) {
      const pullsResponse = yield call(fetch, endpoints.pulls(member.login), {
        method: 'GET',
        headers,
      });

      const pullsJson = yield call([pullsResponse, pullsResponse.json]);

      if (pullsResponse.status < 200 || pullsResponse.status >= 300) {
        yield put(getLanes.failure(new Error('Could not get response from Github')));
        return;
      }

      pulls.push(...pullsJson.items);
    }

    const lanes = membersJson.map((member: Member) => {
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
