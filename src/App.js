import React, { Component } from 'react';
import styled from 'styled-components';
import { throttle } from 'lodash';

import { SERVER_URL, RIGHT_SIDEBAR_WIDTH } from './constants';

import Aside from './Aside';
import ReviewBox from './ReviewBox';
import ReviewsContainer from './ReviewsContainer';
import Fetching from './Fetching';

const StyledApp = styled.div`
  padding: 30px;
  font-family: Lora, sans-serif;
  display: flex;
`;

const Main = styled.main`
  padding-right: ${RIGHT_SIDEBAR_WIDTH};
  flex-grow: 1;
`;

class App extends Component {
  state = {
    reviews: [],
    fetchedPages: 0,
    isFetching: false,
    initialPagesToFetch: 2,
    expandedReviewUrl: '',
    spotifyUri: '',
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
    const callbacks = [...new Array(this.state.initialPagesToFetch)].map((_, index) =>
      this.getReviewsForPage(index + 1)
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
        this.setState({ fetchedPages: this.state.fetchedPages + 1, isFetching: false });
      });
  }

  addReviews({ reviews }) {
    this.setState({ reviews: [...this.state.reviews, ...reviews] });
  }

  render() {
    const { expandedReviewUrl, spotifyUri, activeReview } = this.state;
    return (
      <StyledApp>
        <Main>
          <ReviewsContainer>
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
          </ReviewsContainer>
          {this.state.isFetching && <Fetching />}
        </Main>
        <Aside spotifyUri={spotifyUri} activeReview={activeReview} />
      </StyledApp>
    );
  }
}

export default App;
