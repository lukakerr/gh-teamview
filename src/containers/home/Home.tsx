import * as React from 'react';
import { connect } from 'react-redux';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { Avatar, Button, Card, CardActions, CardContent, Typography } from '@material-ui/core';

import { getLanes, setToken } from 'actions';
import { Action, State, Lane, Pull, Label } from 'types';

import * as styles from './home.scss';

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-AU');

// 5 minutes
const FETCH_INTERVAL = 1000 * 60 * 5;

type HomeProps = {
  lanes?: Lane[],
  getLanes: () => void,
  hasToken: boolean,
  setToken: (token: string) => void,
  error?: Error,
};

class Home extends React.Component<HomeProps, {}> {
  private interval: number;

  componentDidMount() {
    this.interval = window.setInterval(() => {
      if (this.props.hasToken) {
        this.props.getLanes();
      }
    }, FETCH_INTERVAL);
  }

  componentWillUnmount() {
    window.clearInterval(this.interval);
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

  render() {
    const { lanes, error, hasToken } = this.props;

    if (!hasToken) {
      return <div className={styles.loadingContainer}>
        <Button onClick={this.login} size='large' color='primary' variant='contained' disableElevation>Login</Button>
      </div>
    }

    if (error) {
      return <div className={styles.loadingContainer}>
        <p>{error.message}</p>
      </div>
    }

    if (!lanes) {
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
      <div className={styles.root}>
        {lanes.map((lane: Lane, i: number) => {
          if (lane.pulls.length === 0) {
            return null;
          }

          return (
            <div className={styles.column} key={`lane-${i}`}>
              <div className={styles.author}>
                <Avatar src={lane.member.avatar_url} />
                <Typography variant="h5">{lane.member.login}</Typography>
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
}

const mapDispatchToProps = (dispatch: React.Dispatch<Action>) => {
  return {
    getLanes: () => dispatch(getLanes.trigger()),
    setToken: (token: string) => dispatch(setToken.trigger(token)),
  };
};

const mapStateToProps = (state: State) => ({
  lanes: state.lanes,
  hasToken: !!state.token,
  error: state.error,
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
