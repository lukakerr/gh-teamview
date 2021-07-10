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

export type Lane = {
  member: Member,
  pulls: Pull[],
};

export type Stats = {
  totalMembers: number,
  totalPullRequests: number,
  totalReviewRequests: number,
};

/**
 * An interface representing our entire redux store state tree
 */
export interface State {
  // List of swimlanes for each user
  lanes?: Lane[],
  // Statistics for team
  stats?: Stats,
  // Auth token
  token?: string,
  // Possible error
  error?: Error,
}
