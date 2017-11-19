import React, { Component } from 'react';
import styled, { injectGlobal } from 'styled-components';
import { throttle, times, isEmpty } from 'lodash';

import { SERVER_URL, CONTENT_WIDTH } from './constants';

import Navbar from './Navbar';
import ReviewBox from './ReviewBox';
import ReviewsWrapper from './ReviewsWrapper';
import Fetching from './Fetching';

injectGlobal`
  body { 
    font-size: 16px;
  }
`

const Main = styled.main`
  margin-top: 40px;
  margin-bottom: 40px;

  ${CONTENT_WIDTH}
`;

class App extends Component {
  state = {
    reviews: [],
    fetchedPages: 0,
    isFetching: false,
    initialPagesToFetch: 2,
    expandedReviewUrl: '',
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

  handleExpandReview(reviewUrl) {
    this.setState({ expandedReviewUrl: reviewUrl });
  }

  handleUpdateActiveAlbum({ spotifyUri, review }) {
    this.setState({ spotifyUri, activeReview: review });
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
    const { expandedReviewUrl, spotifyUri, activeReview } = this.state;
    return [
      <Navbar key="navbar" />,
      <Main key="main">
        <ReviewsWrapper hasContent={!isEmpty(this.state.reviews)}>
          {this.state.reviews.map(review => (
            <ReviewBox
              review={review}
              key={review.url}
              isExpanded={expandedReviewUrl === review.url}
              onExpandReview={this.handleExpandReview}
              onGetSpotifyUri={this.handleGetSpotifyUri}
              onUpdateActiveAlbum={this.handleUpdateActiveAlbum}
            />
          ))}
        </ReviewsWrapper>
        {this.state.isFetching && <Fetching />}
        {this.state.error && <h2>{this.state.error}</h2>}
      </Main>,
    ];
  }
}

export default App;
