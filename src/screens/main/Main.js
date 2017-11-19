import React from 'react';
import { isEmpty } from 'lodash';
import styled from 'styled-components';

import { CONTENT_WIDTH } from '../../constants';

import Navbar from './Navbar';
import ReviewBox from './ReviewBox';
import ReviewsWrapper from './ReviewsWrapper';
import Fetching from './Fetching';

const MainContentWrapper = styled.main`
  margin-top: 40px;
  margin-bottom: 40px;

  ${CONTENT_WIDTH};
`;

export default function Main(props) {
  const {
    onExpandReview,
    onGetSpotifyUri,
    onUpdateActiveAlbum,
    reviews,
    isFetching,
    error,
  } = props;
  return [
    <Navbar key="navbar" />,
    <MainContentWrapper key="main">
      <ReviewsWrapper hasContent={!isEmpty(reviews)}>
        {reviews.map(review => (
          <ReviewBox
            review={review}
            key={review.url}
            onExpandReview={onExpandReview}
            onGetSpotifyUri={onGetSpotifyUri}
            onUpdateActiveAlbum={onUpdateActiveAlbum}
          />
        ))}
      </ReviewsWrapper>
      {isFetching && <Fetching />}
      {error && <h2>{error}</h2>}
    </MainContentWrapper>,
  ];
}
