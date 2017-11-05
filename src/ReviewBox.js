import React from 'react';
import { shape, string, bool, func } from 'prop-types';
import styled, { css, keyframes } from 'styled-components';
import { SERVER_URL } from './constants';

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

const StyledReviewBox = styled.li`
  flex-basis: ${ART_SIZE};
  margin-right: 10px;
  margin-bottom: 20px;
  margin-left: 10px;
  cursor: pointer;
  padding-bottom: 5px;

  ${props => props.expanded && css`box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);`};

  animation: ${appearAnimation} 0.5s ease-out;
`;

const Artist = styled.h3`
  text-transform: uppercase;
  font-family: Oswald, sans-serif;
  font-size: 12px;
  text-align: center;
  color: #444;
  margin-bottom: 3px;
`;

const Title = styled.p`
  font-family: Lora, sans-serif;
  font-style: italic;
  color: #444;
  margin-top: 0;
  text-align: center;
  font-size: 12px;
`;

const CoverArt = styled.div`
  position: relative;
  background-image: ${props => `url("${props.src}")`};
  height: ${ART_SIZE};
  background-size: cover;
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
`;

const ReadReviewLink = styled.a`
  display: block;
  text-align: center;
  color: #ff490e;
  margin-top: 10px;
  font-family: Lora, sans-serif;
  font-size: 10px;
`;

const Iframe = styled.iframe`
  display: block;
  margin: 0 auto;
`;

const NotAvailableError = styled.h3`
  text-align: center;
  width: 90%;
  margin: 0 auto;
`;

class ReviewBox extends React.Component {
  static propTypes = {
    review: shape({
      url: string,
      artist: string,
      album: string,
    }),
    isExpanded: bool,
    onUpdateActiveAlbum: func,
  };

  state = {
    spotifyUri: '',
    error: null,
  };

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { spotifyUri, error } = this.state;
    const { review, onUpdateActiveAlbum } = this.props;
    this.props.onExpandReview(review.url);
    if (spotifyUri) {
      onUpdateActiveAlbum({ spotifyUri, review });
    } else if (error) {
      onUpdateActiveAlbum({ review });
    } else {
      fetch(`${SERVER_URL}/search?artist=${review.artist}&album=${review.album}`)
        .then(response => response.json())
        .then(data => {
          if (data.uri) {
            this.setState({ spotifyUri: data.uri });
            onUpdateActiveAlbum({ spotifyUri: data.uri, review });
          } else {
            this.setState({ error: 'Album not available on Spotify' });
            onUpdateActiveAlbum({ review });
          }
        });
    }
  }

  renderExpandedSection() {
    const { spotifyUri, error } = this.state;
    const { review } = this.props;
    const readReview = (
      <ReadReviewLink
        key="review-link"
        href={`https://pitchfork.com${review.url}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Read review
      </ReadReviewLink>
    );
    if (error) {
      return [<NotAvailableError key="error">{error}</NotAvailableError>, readReview];
    }
    if (spotifyUri) {
      return [
        <Iframe
          key="spotify-iframe"
          src={`https://open.spotify.com/embed?uri=${spotifyUri}&view=coverart`}
          width="90%"
          height="80"
          frameBorder="0"
          allowTransparency="true"
          title="spotify-player"
        />,
        readReview,
      ];
    }
    return null;
  }

  render() {
    const { review, isExpanded } = this.props;
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
        expanded={isExpanded}
      >
        <CoverArt src={review.cover}>
          <Score>{review.score}</Score>
        </CoverArt>
        <Artist>{review.artist}</Artist>
        <Title>{review.album}</Title>
        {isExpanded && this.renderExpandedSection()}
      </StyledReviewBox>
    );
  }
}

export default ReviewBox;
