import React from 'react';
import styled from 'styled-components';

import { RIGHT_SIDEBAR_WIDTH } from './constants';

const AsideContainer = styled.aside`
  position: fixed;
  right: 30px;
  text-align: right;
  overflow-y: auto;
  width: ${RIGHT_SIDEBAR_WIDTH};
`;

const ReadReviewLink = styled.a`
  display: block;
  color: #ff490e;
  margin-top: 10px;
  font-family: Lora, sans-serif;
  font-size: 10px;
`;

class Aside extends React.Component {
  render() {
    const { spotifyUri, activeReview } = this.props;
    return (
      <AsideContainer>
        <h1>Spotifork</h1>
        <p>Developed by Giuseppe Bandiera</p>
        {spotifyUri && (
          <iframe
            title="embedded-spotify"
            src={`https://open.spotify.com/embed?uri=${spotifyUri}`}
            width="300"
            height="380"
            frameborder="0"
            allowtransparency="true"
          />
        )}
        {activeReview && (
          <ReadReviewLink
            key="review-link"
            href={`https://pitchfork.com${activeReview.url}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Read review
          </ReadReviewLink>
        )}
      </AsideContainer>
    );
  }
}

export default Aside;
