import React from 'react';
import styled from 'styled-components';
import { SERIF_FONT, SANS_SERIF_FONT, palette } from '../../constants';

const GoBack = styled.div`
  cursor: pointer;
  font-weight: bolder;
  font-size: 4em;
  position: absolute;
  left: 20px;
  transform: scaleY(1.6);
`;

const Artist = styled.h1`
  ${SERIF_FONT} font-weight: 700;
  font-size: 4em;
  margin: 0.7em 0 0.3em;
`;

const Album = styled.h2`
  ${SERIF_FONT} font-style: italic;
  font-size: 2.5em;
  margin: 0;
`;

const Rating = styled.h3`
  ${SANS_SERIF_FONT} font-size: 1.5em;
  margin: 0.5em 0;
`;

const Header = styled.header`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
`;

const HeaderMain = styled.div`
  align-items: center;
  flex-direction: column;
  text-align: center;
`;

const FocusedReviewContainer = styled.div`
  position: relative;
  color: white;
  min-height: 100vh;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-image: url("${props => props.background}");
    background-size: cover;
    z-index: -1;
    filter: blur(10px);
    transform: scale(1.1);
  }

  &:after {
    content: '';
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: #333;
    opacity: 0.4;
    z-index: -1;
    pointer-events: none;
  }
`;

const AlbumMeta = styled.dl`
  text-align: center;
`;

const AlbumMetaTitle = styled.dt`
  ${SERIF_FONT} font-weight: 700;
  font-size: 1em;
`;

const AlbumMetaDescription = styled.dd`
  ${SANS_SERIF_FONT};
  font-size: 1em;
  margin-left: 0.4em;
`;

const AlbumMetaItem = styled.div`
  display: flex;
  justify-content: center;
`;

const ReadReviewLinkContainer = styled.div`
  text-align: center;
  margin-bottom: 0.2em;
`

const ReadReviewLink = styled.a`
  ${SANS_SERIF_FONT} text-align: center;
  font-size: 0.8em;
  color: ${palette.white};

  &:active, &:hover, &:focus {
    color: ${palette.white1};
  }
`;

const Abstract = styled.p`
  ${SERIF_FONT} font-style: italic;
  font-size: 1.5em;
  max-width: 800px;
  padding-left: 20px;
  padding-right: 20px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
`;

const SpotifyIframe = styled.iframe`
  display: block;
  margin-top: 20px;
  margin-right: auto;
  margin-bottom: 50px;
  margin-left: auto;
  box-shadow: 0 0 50px rgba(20, 20, 20, 1);
`;

class Aside extends React.Component {
  render() {
    const { spotifyUri, activeReview, onGoBack } = this.props;
    return (
      <FocusedReviewContainer background={activeReview.cover}>
        <Header>
          <GoBack
            role="button"
            tabIndex={0}
            onClick={() => onGoBack()}
            onKeyDown={evt => {
              if (evt.keyCode === 13) {
                onGoBack();
              }
            }}
          >
            {'<'}
          </GoBack>
          <HeaderMain>
            <Artist>{activeReview.artist}</Artist>
            <Album>{activeReview.album}</Album>
            <Rating>{activeReview.score}</Rating>
          </HeaderMain>
        </Header>
        <AlbumMeta>
          <AlbumMetaItem>
            <AlbumMetaTitle>Label:</AlbumMetaTitle>
            <AlbumMetaDescription>{activeReview.label}</AlbumMetaDescription>
          </AlbumMetaItem>
          <AlbumMetaItem>
            <AlbumMetaTitle>Release Date:</AlbumMetaTitle>
            <AlbumMetaDescription>{activeReview.label}</AlbumMetaDescription>
          </AlbumMetaItem>
        </AlbumMeta>
        <Abstract>{activeReview.editorial.abstract}</Abstract>
        <ReadReviewLinkContainer>
          <ReadReviewLink
            key="review-link"
            href={`https://pitchfork.com${activeReview.url}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Read review
          </ReadReviewLink>
        </ReadReviewLinkContainer>
        {spotifyUri && (
          <SpotifyIframe
            title="embedded-spotify"
            src={`https://open.spotify.com/embed?uri=${spotifyUri}`}
            width="300"
            height="380"
            frameBorder="0"
            allowTransparency
          />
        )}
      </FocusedReviewContainer>
    );
  }
}

export default Aside;
