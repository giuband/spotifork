// @flow
import React, { Component } from 'react';
import styled, { injectGlobal } from 'styled-components';
import { withRouter, type RouterHistory } from 'react-router-dom';
import { throttle, times } from 'lodash';

import { SERVER_URL } from './constants';
import { type ReviewType } from './types';

import Main from './screens/main/Main';
import Focus from './screens/focus/Focus';

injectGlobal`
  body { 
    font-size: 16px;

    &.scroll-block {
      overflow-y: hidden;
    }
  }
`;

const StyledContainer = styled.div`
  height: 100vh;
  position: relative;
`;

const INITIAL_PAGES_TO_FETCH = 2;

type State = {
  reviews: Array<ReviewType>,
  fetchedPages: number,
  isFetching: boolean,
  expandedReview: ?ReviewType,
  spotifyUri: ?string,
  error: ?string,
  spotifyError: boolean,
};

type Props = {
  history: RouterHistory,
};

class App extends Component<State, Props> {
  state = {
    reviews: [],
    fetchedPages: 0,
    isFetching: false,
    expandedReview: null,
    spotifyUri: null,
    error: null,
    spotifyError: false,
  };

  constructor() {
    super();
    this.addReviews = this.addReviews.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleExpandReview = this.handleExpandReview.bind(this);
    this.handleUpdateActiveAlbum = this.handleUpdateActiveAlbum.bind(this);
  }

  componentDidMount() {
    this.getInitialPagesContent();
    document.addEventListener('scroll', throttle(this.handleScroll, 100));
  }

  componentWillUpdate(nextProps, nextState) {
    const isGoingBack =
      this.state.expandedReview && nextProps.history.location.pathname === '/';
    const isGoingForward =
      !nextState.expandedReview && nextProps.history.location.pathname !== '/';
    if (isGoingBack) {
      this.setState({ expandedReview: null });
    } else if (isGoingForward) {
      const artistMatch = nextProps.history.location.pathname.match(
        /artist\/(.+)\/album\/(.+)/
      );
      if (artistMatch) {
        const artist = decodeURIComponent(artistMatch[1]);
        const album = decodeURIComponent(artistMatch[2]);
        const focusedReview = this.state.reviews.find(
          review => review.artist === artist && review.album === album
        );
        this.setState({ expandedReview: focusedReview });
      }
    }
  }

  getInitialPagesContent: void => Promise<mixed>;
  getInitialPagesContent() {
    const totalFetches = INITIAL_PAGES_TO_FETCH;
    const callbacks = times(totalFetches).map(i =>
      this.getReviewsForPage(i + 1)
    );
    return callbacks.reduce((prev, cur) => prev.then(cur), Promise.resolve());
  }

  handleScroll: void => void;
  handleScroll() {
    const element = document.documentElement;
    if (!element) {
      return;
    }
    const { scrollHeight, scrollTop, clientHeight } = element;
    const hasScrolledToBottom = scrollHeight - scrollTop === clientHeight;
    if (hasScrolledToBottom && !this.state.isFetching) {
      this.getReviewsForPage(this.state.fetchedPages + 1);
    }
  }

  handleExpandReview: (?ReviewType) => void;
  handleExpandReview(review: ?ReviewType) {
    const { history } = this.props;
    this.setState({ expandedReview: review, spotifyError: false });
    const newUrl = review
      ? `artist/${review.artist}/album/${review.album}`
      : '/';
    history.push(newUrl);
  }

  handleUpdateActiveAlbum: (?string) => void;
  handleUpdateActiveAlbum(spotifyUri: ?string) {
    if (spotifyUri) {
      this.setState({ spotifyUri, spotifyError: false });
    } else {
      this.setState({ spotifyUri: null, spotifyError: true });
    }
  }

  getReviewsForPage: number => Promise<mixed>;
  getReviewsForPage(pageIndex: number) {
    const getReviewsUrl = `${SERVER_URL}/getPage/${pageIndex}`;
    this.setState({ isFetching: true });
    return fetch(getReviewsUrl)
      .then(response => response.json())
      .then(data => {
        const { reviews } = data;
        this.addReviews(reviews);
        this.setState({
          fetchedPages: this.state.fetchedPages + 1,
          isFetching: false,
          error: '',
        });
      })
      .catch(({ error }) => {
        this.setState({ isFetching: false, error });
      });
  }

  addReviews: (reviews: Array<ReviewType>) => void;
  addReviews(reviews: Array<ReviewType>) {
    this.setState({ reviews: [...this.state.reviews, ...reviews] });
  }

  render() {
    const { expandedReview, spotifyUri, reviews, spotifyError } = this.state;
    const inFocusMode = !!expandedReview;
    return (
      <StyledContainer>
        <Main
          reviews={reviews}
          onExpandReview={this.handleExpandReview}
          onUpdateActiveAlbum={this.handleUpdateActiveAlbum}
          isFetching={this.state.isFetching}
          error={this.state.error}
          active={!inFocusMode}
        />
        <Focus
          spotifyUri={spotifyUri}
          activeReview={expandedReview}
          onGoBack={this.handleExpandReview}
          active={inFocusMode}
          spotifyError={spotifyError}
        />
      </StyledContainer>
    );
  }
}

export default withRouter(App);
