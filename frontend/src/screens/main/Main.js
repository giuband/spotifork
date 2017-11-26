// @flow
import React from 'react';
import { isEmpty } from 'lodash';
import styled from 'styled-components';

import {
  CONTENT_WIDTH,
  SLIDE_CARD_ANIMATION_DURATION,
  palette,
} from '../../constants';

import Navbar from './Navbar';
import ReviewBox from './ReviewBox';
import ReviewsWrapper from './ReviewsWrapper';
import Fetching from './Fetching';

import { type ReviewType } from '../../types'

const MainContainer = styled.div`
  width: 100vw;
  transform: translateX(${props => (props.active ? 0 : '-100vw')});
  position: relative;
  z-index: 1;
  background: ${palette.white};

  transition: transform ${SLIDE_CARD_ANIMATION_DURATION} ease-in-out;
  height: ${props => (props.isVisible ? 'initial' : '0')};
  overflow: ${props => (props.isVisible ? 'auto' : 'hidden')};

  &:focus {
    outline: none;
  }
`;

const MainContentWrapper = styled.main`
  margin-top: 40px;
  margin-bottom: 40px;

  ${CONTENT_WIDTH};
`;

type Props = {
  reviews: Array<ReviewType>,
  onExpandReview: ReviewType => void,
  onUpdateActiveAlbum: ?string => void,
  isFetching: boolean,
  error: ?string,
  active: boolean,
  isVisible: boolean,
}

class Main extends React.Component<Props> {
  container: HTMLDivElement;

  componentWillReceiveProps(nextProps: Props) {
    if (this.container && nextProps.active && !this.props.active) {
      this.container.focus();
    }
  }

  render() {
    const {
      reviews,
      onExpandReview,
      onUpdateActiveAlbum,
      isFetching,
      error,
      active,
      isVisible,
    } = this.props;

    return (
      <MainContainer
        active={active}
        isVisible={isVisible}
        role="presentation"
        innerRef={container => (this.container = container)}
        tabIndex={0}
      >
        <Navbar />
        <MainContentWrapper>
          <ReviewsWrapper hasContent={!isEmpty(reviews)}>
            {reviews.map(review => (
              <ReviewBox
                review={review}
                key={review.url}
                onExpandReview={onExpandReview}
                onUpdateActiveAlbum={onUpdateActiveAlbum}
              />
            ))}
          </ReviewsWrapper>
          {isFetching && <Fetching />}
          {error && <h2>{error}</h2>}
        </MainContentWrapper>
      </MainContainer>
    );
  }
}

export default Main;
