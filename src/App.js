import React, { Component } from 'react';
import styled from 'styled-components';
import { SERVER_URL } from './constants';
import ReviewBox from './ReviewBox';
import ReviewsContainer from './ReviewsContainer';
import Fetching from './Fetching';
import { throttle } from 'lodash';

const StyledApp = styled.div`
  padding: 30px;
  font-family: Lora, sans-serif;
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
    this.handleGetSpotifyUri = this.handleGetSpotifyUri.bind(this);
  }

  componentDidMount() {
    this.getInitialPagesContent();
    document.addEventListener('scroll', throttle(this.handleScroll, 100));
  }

  getInitialPagesContent() {
    const callbacks = [...new Array(this.state.initialPagesToFetch)].map((_, index) =>
      this.getReviewsForPage(index + 1),
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

  handleGetSpotifyUri(spotifyUri) {
    this.setState({ spotifyUri });
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
    const { expandedReviewUrl, spotifyUri } = this.state;
    return (
      <StyledApp>
        <ReviewsContainer>
          {this.state.reviews.map(review => (
            <ReviewBox
              review={review}
              key={review.url}
              isExpanded={expandedReviewUrl === review.url}
              spotifyUri={spotifyUri}
              onExpandReview={this.handleExpandReview}
              onGetSpotifyUri={this.handleGetSpotifyUri}
            />
          ))}
        </ReviewsContainer>
        {this.state.isFetching && <Fetching />}
      </StyledApp>
    );
  }
}

export default App;
