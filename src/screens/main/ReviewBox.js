import React from 'react';
import { shape, string, bool, func } from 'prop-types';
import { get } from 'lodash';
import styled, { css, keyframes } from 'styled-components';
import {
  SERVER_URL,
  SERIF_FONT,
  SANS_SERIF_FONT,
  palette,
  ACTIVE_ELEMENT,
} from '../../constants';

const ART_SIZE = '240px';
const SCORE_SIZE = '30px';

const appearAnimation = keyframes`
  from {
    transform: translateY(100px);
    opacity: 0;
  } to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const CoverArt = styled.div`
  position: relative;
  background-image: ${props => `url("${props.src}")`};
  height: ${ART_SIZE};
  background-size: cover;
  position: relative;
  z-index: 1;

  &:before {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    content: '';
    background-color: ${palette.gray0};
    opacity: 0.3;
    transition: opacity 0.2s ease-in;
  }
`;

const StyledReviewBox = styled.li`
  flex-basis: ${ART_SIZE};
  margin-right: 10px;
  margin-bottom: 20px;
  margin-left: 10px;
  cursor: pointer;
  padding-bottom: 5px;
  position: relative;

  animation: ${appearAnimation} 0.5s ease-out;

  &:after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: white;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease-in;
    box-shadow: 0 0 20px ${palette.gray2};
    content: '';
  }

  ${ACTIVE_ELEMENT} {
    opacity: 1;
    outline: none;

    &:after {
      opacity: 1;
    }

    ${CoverArt}:before {
      opacity: 0;
    }
  }
`;

const Artist = styled.h3`
  text-align: center;
  margin-bottom: 3px;
  ${SERIF_FONT} font-weight: 700;
  font-size: 1em;
  color: ${palette.gray1};
  position: relative;
  z-index: 1;
`;

const Title = styled.p`
  ${SANS_SERIF_FONT} color: ${palette.gray1};
  margin-top: 0;
  text-align: center;
  font-size: 0.75em;
  position: relative;
  z-index: 1;
`;

const Score = styled.div`
  position: absolute;
  right: 10px;
  bottom: 10px;
  color: white;
  width: ${SCORE_SIZE};
  height: ${SCORE_SIZE};
  font-size: 18px;
  line-height: ${SCORE_SIZE};
  text-align: center;
  background: #333;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  padding: 4px;
  z-index: 1;
`;

class ReviewBox extends React.Component {
  static propTypes = {
    review: shape({
      url: string,
      artist: string,
      album: string,
    }),
    onUpdateActiveAlbum: func,
  };

  state = {
    spotifyUri: '',
    spotifyData: null,
    error: null,
  };

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { spotifyUri, error } = this.state;
    const { review, onUpdateActiveAlbum } = this.props;
    this.props.onExpandReview(review);
    if (spotifyUri) {
      onUpdateActiveAlbum({ spotifyUri, review });
    } else if (error) {
      onUpdateActiveAlbum({ review });
    } else {
      fetch(
        `${SERVER_URL}/search?artist=${review.artist}&album=${review.album}`
      )
        .then(response => response.json())
        .then(data => {
          if (data.uri) {
            this.setState({ spotifyUri: data.uri, spotifyData: data });
            onUpdateActiveAlbum({ spotifyUri: data.uri, review });
          } else if (get(data, 'error') === 'Not available on spotify') {
            this.setState({ error: 'Album not available on Spotify' });
            onUpdateActiveAlbum({ review });
          }
        });
    }
  }

  render() {
    const { review } = this.props;
    return (
      <StyledReviewBox
        role="button"
        tabIndex={0}
        onClick={this.handleClick}
        onKeyDown={evt => {
          if (evt.keyCode === 13) {
            this.handleClick();
          }
        }}
      >
        <CoverArt src={review.cover}>
          <Score>{review.score}</Score>
        </CoverArt>
        <Artist>{review.artist}</Artist>
        <Title>{review.album}</Title>
      </StyledReviewBox>
    );
  }
}

export default ReviewBox;
