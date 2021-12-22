import * as React from 'react';
import { connect } from 'react-redux';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
} from '@material-ui/core';

import { getLanes, setToken, setMode } from 'actions';
import { Action, State, Lane, Pull, Label, Stats, Mode, Review } from 'types';

import prImg from 'assets/pr.png';
import * as styles from './home.scss';

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-AU');

// 5 minutes
const FETCH_INTERVAL = 1000 * 60 * 5;

type HomeProps = {
  mode: Mode,
  setMode: (mode: Mode) => void,
  lanes?: Lane[],
  getLanes: () => void,
  reviews?: Pull[],
  stats?: Stats,
  hasToken: boolean,
  lanesLoading: boolean,
  reviewsLoading: boolean,
  statsLoading: boolean,
  setToken: (token: string) => void,
  error?: Error,
};

class Home extends React.Component<HomeProps, {}> {
  private interval: number;

  componentDidMount() {
    this.getLanes();
    this.interval = window.setInterval(() => {
      this.getLanes();
    }, FETCH_INTERVAL);
  }

  componentWillUnmount() {
    window.clearInterval(this.interval);
  }

  getLanes() {
    if (this.props.hasToken) {
      this.props.getLanes();
    }
  }

  getColorContrast = (color: string): 'dark' | 'light' => {
    const normalised = color.replace("#", "");
    const r = parseInt(normalised.substr(0, 2), 16);
    const g = parseInt(normalised.substr(2, 2), 16);
    const b = parseInt(normalised.substr(4, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'light' : 'dark';
  }

  login = () => {
    const token = prompt('Enter your Github personal access token');
    token && this.props.setToken(token);
    this.props.getLanes();
  }

  onModeChange = () => {
    if (this.props.mode === 'reviews') {
      this.props.setMode('team');
    } else {
      this.props.setMode('reviews');
    }
  }

  renderLanes() {
    const { lanes } = this.props;

    return (
      <div className={styles.lanes}>
        {lanes.map((lane: Lane, i: number) => {
          if (lane.pulls.length === 0) {
            return null;
          }

          return (
            <div className={styles.column} key={`lane-${i}`}>
              <div className={styles.author}>
                <Avatar src={lane.member.avatar_url} />
                <a href={lane.member.html_url} className={styles.link} target='_blank' rel='noopener'>
                  <Typography variant="h5">@{lane.member.login}</Typography>
                </a>
              </div>
              {lane.pulls.map((pull: Pull) => (
                <a href={pull.url} className={styles.link} key={pull.url} target='_blank' rel='noopener'>
                  <Card>
                    <CardContent>
                      <Typography variant='subtitle2' className={styles.title}>{pull.title}</Typography>
                    </CardContent>
                    <CardActions>
                      <div className={styles.actions}>
                        <div className={styles.actionSection}>
                          {pull.labels.map((label: Label) => {
                            const isDark = this.getColorContrast(label.color) === 'dark';

                            return (
                              <div key={label.name} className={styles.label} style={{
                                color: isDark ? '#EEE' : '#505050',
                                backgroundColor: `#${label.color}`,
                              }}>
                                {label.name}
                              </div>
                            );
                          })}
                        </div>
                        <div className={styles.actionSection}>
                          <Typography variant='caption'>{timeAgo.format(new Date(pull.created_at))}</Typography>
                        </div>
                      </div>
                    </CardActions>
                  </Card>
                </a>
              ))}
            </div>
          );
        })}
      </div>
    );
  }

  renderReviewsRequested() {
    const { reviews } = this.props;

    return (
      <div className={styles.reviewRequests}>
        <Typography variant='h5'>Review requests:</Typography>
        <List className={styles.reviews}>
          {reviews.map((reviewRequest: Review, i: number) => (
            <React.Fragment key={reviewRequest.url}>
              <a href={reviewRequest.url} className={styles.link} target='_blank' rel='noopener'>
                <ListItem>
                  <ListItemAvatar className={styles.listAvatarContainer}>
                    <Avatar src={prImg} className={styles.listAvatar} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={reviewRequest.title}
                    secondary={<span>
                      <span className={styles.pending}></span>
                      {reviewRequest.requested.map(r => `@${r.login}`).join(', ')}
                    </span>}
                  />
                  <div className={styles.listRightInfo}>
                    <div className={styles.listRightInfoSection}>
                      {reviewRequest.labels.map((label: Label) => {
                        const isDark = this.getColorContrast(label.color) === 'dark';

                        return (
                          <div key={label.name} className={styles.label} style={{
                            color: isDark ? '#EEE' : '#505050',
                            backgroundColor: `#${label.color}`,
                          }}>
                            {label.name}
                          </div>
                        );
                      })}
                    </div>
                    <div className={styles.listRightInfoSection}>
                      <Typography variant='caption'>
                        {timeAgo.format(new Date(reviewRequest.created_at))}
                      </Typography>
                    </div>
                  </div>
                </ListItem>
              </a>
              {i !== reviews.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </div>
    );
  }

  render() {
    const { lanes, reviews, stats, mode, error, hasToken } = this.props;
    const { lanesLoading, reviewsLoading, statsLoading } = this.props;

    if (!hasToken) {
      return <div className={styles.loadingContainer}>
        <Button onClick={this.login} size='large' color='primary' variant='contained' disableElevation>Login</Button>
      </div>
    }

    // First load
    if (lanesLoading && lanes.length === 0) {
      return <div className={styles.loadingContainer}>
        <p>Loading...</p>
      </div>
    }

    if (lanes.length === 0) {
      return <div className={styles.loadingContainer}>
        <p>No results</p>
      </div>
    }

    return (
      <div className={styles.container}>
        {error && <p>{error.message}</p>}
        {(lanesLoading || reviewsLoading || statsLoading) && <p>...loading more results</p>}
        {reviews.length > 0 && <div className={styles.mode}>
          <Typography variant='h6'>View: {mode}</Typography>
          <Switch checked={mode === 'reviews'} onChange={this.onModeChange} />
        </div>}
        {stats != null && <div className={styles.stats}>
          <div className={styles.stat}>
            <Typography variant='h4'>{stats.totalMembers}</Typography>
            <Typography variant='h6'>Team members</Typography>
          </div>
          <div className={styles.stat}>
            <Typography variant='h4'>{stats.totalPullRequests}</Typography>
            <Typography variant='h6'>Open PRs</Typography>
          </div>
          <div className={styles.stat}>
            <Typography variant='h4'>{stats.totalReviewRequests}</Typography>
            <Typography variant='h6'>Total review requests</Typography>
          </div>
        </div>}
        {mode === 'team' && this.renderLanes()}
        {mode === 'reviews' && this.renderReviewsRequested()}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: React.Dispatch<Action>) => {
  return {
    getLanes: () => dispatch(getLanes.trigger()),
    setToken: (token: string) => dispatch(setToken.trigger(token)),
    setMode: (mode: Mode) => dispatch(setMode.trigger(mode)),
  };
};

const mapStateToProps = (state: State) => ({
  mode: state.mode,
  lanes: state.lanes.data,
  reviews: state.reviews.data,
  stats: state.stats.data,
  hasToken: !!state.token,
  lanesLoading: state.lanes.loading,
  reviewsLoading: state.reviews.loading,
  statsLoading: state.stats.loading,
  error: state.error,
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
