export type Member = {
  login: string,
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

/**
 * An interface representing our entire redux store state tree
 */
export interface State {
  // List of swimlanes for each user
  lanes?: Lane[],
  // Auth token
  token?: string,
  // Possible error
  error?: Error,
}
