import React from 'react';
import styled from 'styled-components';
import { SERVER_URL } from './constants';

const ART_SIZE = '200px';
const SCORE_SIZE = '30px';

const StyledReviewBox = styled.section`
  flex-basis: ${ART_SIZE};
  margin-right: 10px;
  margin-bottom: 20px;
  margin-left: 10px;
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

class ReviewBox extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { review } = this.props;
    this.props.onExpandReview(review.url);
    fetch(`${SERVER_URL}/search?artist=${review.artist}&album=${review.album}`)
      .then(response => response.json())
      .then(data => {
        if (data.uri) {
          this.props.onGetSpotifyUri(data.uri);
        }
      });
  }

  render() {
    const { review, isExpanded, spotifyUri } = this.props;
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
        {isExpanded &&
          spotifyUri && (
            <iframe
              src={`https://open.spotify.com/embed?uri=${spotifyUri}&view=coverart`}
              width="100%"
              height="80"
              frameBorder="0"
              allowTransparency="true"
              title="spotify-player"
            />
          )}
      </StyledReviewBox>
    );
  }
}

export default ReviewBox;
