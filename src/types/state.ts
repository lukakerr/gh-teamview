export type Member = {
  login: string,
  html_url: string,
  avatar_url: string,
};

export type Label = {
  name: string,
  color: string,
};

export type Pull = {
  url: string,
  title: string,
  created_at: Date,
  updated_at: Date,
  labels: Label[],
};

export type Review = Pull & {
  requested: Member[],
};

export type Lane = {
  member: Member,
  pulls: Pull[],
};

export type Stats = {
  totalMembers: number,
  totalPullRequests: number,
  totalReviewRequests: number,
};

export type Mode = 'team' | 'reviews';

/**
 * An interface representing our entire redux store state tree
 */
export interface State {
  mode: Mode,
  // List of swimlanes for each user
  lanes: {
    data: Lane[],
    loading: boolean,
  },
  // List of PRs that have requested reviews
  reviews: {
    data: Review[],
    loading: boolean,
  },
  // Statistics for team
  stats: {
    data?: Stats,
    loading: boolean,
  },
  // Auth token
  token?: string,
  // Possible error
  error?: Error,
}
