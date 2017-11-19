import React, { Component } from 'react';
import { injectGlobal } from 'styled-components';
import { throttle, times } from 'lodash';

import { SERVER_URL } from './constants';

import Main from './screens/main/Main';
import Focus from './screens/focus/Focus';

injectGlobal`
  body { 
    font-size: 16px;
  }
`;

class App extends Component {
  state = {
    reviews: [],
    fetchedPages: 0,
    isFetching: false,
    initialPagesToFetch: 2,
    expandedReview: null,
    spotifyUri: '',
    error: '',
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

  getInitialPagesContent() {
    const totalFetches = this.state.initialPagesToFetch;
    const callbacks = times(totalFetches).map(i =>
      this.getReviewsForPage(i + 1)
    );
    return callbacks.reduce((prev, cur) => prev.then(cur), Promise.resolve());
  }

  handleScroll(evt) {
    const element = document.documentElement;
    const { scrollHeight, scrollTop, clientHeight } = element;
    const hasScrolledToBottom = scrollHeight - scrollTop === clientHeight;
    if (hasScrolledToBottom && !this.state.isFetching) {
      this.getReviewsForPage(this.state.fetchedPages + 1);
    }
  }

  handleExpandReview(review) {
    this.setState({ expandedReview: review });
  }

  handleUpdateActiveAlbum({ spotifyUri }) {
    this.setState({ spotifyUri });
  }

  getReviewsForPage(pageIndex) {
    const getReviewsUrl = `${SERVER_URL}/getPage/${pageIndex}`;
    this.setState({ isFetching: true });
    return fetch(getReviewsUrl)
      .then(response => response.json())
      .then(data => {
        this.addReviews(data);
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

  addReviews({ reviews }) {
    this.setState({ reviews: [...this.state.reviews, ...reviews] });
  }

  render() {
    const { expandedReview, spotifyUri, reviews } = this.state;
    return expandedReview ? (
      <Focus spotifyUri={spotifyUri} activeReview={expandedReview} />
    ) : (
      <Main
        reviews={reviews}
        onExpandReview={this.handleExpandReview}
        onGetSpotifyUri={this.handleGetSpotifyUri}
        onUpdateActiveAlbum={this.handleUpdateActiveAlbum}
        isFetching={this.state.isFetching}
        error={this.state.error}
      />
    );
  }
}

export default App;
