import React from 'react';
import styled from 'styled-components';
import {
  SERIF_FONT,
  SANS_SERIF_FONT,
  palette,
  SLIDE_CARD_ANIMATION_DURATION,
} from '../../constants';

const FixedContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  z-index: 0;
  pointer-events: ${props => (props.active ? 'all' : 'none')};
  overflow: ${props => (props.active ? 'auto' : 'hidden')};
  background: ${props => (props.active ? palette.gray0 : 'transparent')};

  &:focus {
    outline: none;
  }
`;

const FocusedReviewContainer = styled.div`
  position: relative;
  color: white;
  width: 100vw;
  min-height: 100vh;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  opacity: ${props => (props.active ? 1 : 0)};
  transition: opacity ${SLIDE_CARD_ANIMATION_DURATION} ease-in-out;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: ${props =>
      props.activeReview
        ? `url("${props.activeReview.cover}")`
        : palette.gray0};
    background-size: cover;
    background-position: center;
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
    background: ${palette.gray0};
    opacity: 0.4;
    z-index: -1;
    pointer-events: none;
  }
`;

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
  align-items: baseline;
`;

const ReadReviewLinkContainer = styled.div`
  text-align: center;
  margin-bottom: 0.2em;
`;

const ReadReviewLink = styled.a`
  ${SANS_SERIF_FONT} text-align: center;
  font-size: 0.8em;
  color: ${palette.white};

  &:active,
  &:hover,
  &:focus {
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

const SpotifyError = styled.h2`
  text-align: center;
  padding-left: 20px;
  padding-right: 20px;
  font-style: italic;
  font-size: 2em;
  ${SERIF_FONT}
`;

class Aside extends React.Component {
  state = {
    lastActiveReview: null,
  };

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.activeReview &&
      nextProps.activeReview !== this.state.lastActiveReview
    ) {
      this.setState({ lastActiveReview: nextProps.activeReview });
      if (this.container) {
        this.container.focus();
      }
    }
  }

  render() {
    const { lastActiveReview } = this.state;
    const { spotifyUri, onGoBack, active, spotifyError } = this.props;
    return (
      <FixedContainer
        active={active}
        innerRef={container => (this.container = container)}
        role="presentation"
        tabIndex={0}
      >
        <FocusedReviewContainer activeReview={lastActiveReview} active={active}>
          {lastActiveReview && (
            <div>
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
                  <Artist>{lastActiveReview.artist}</Artist>
                  <Album>{lastActiveReview.album}</Album>
                  <Rating>{lastActiveReview.score}</Rating>
                </HeaderMain>
              </Header>
              <AlbumMeta>
                <AlbumMetaItem>
                  <AlbumMetaTitle>Label:</AlbumMetaTitle>
                  <AlbumMetaDescription>
                    {lastActiveReview.label}
                  </AlbumMetaDescription>
                </AlbumMetaItem>
              </AlbumMeta>
              <Abstract>{lastActiveReview.editorial.abstract}</Abstract>
              <ReadReviewLinkContainer>
                <ReadReviewLink
                  key="review-link"
                  href={`https://pitchfork.com${lastActiveReview.url}`}
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
              {spotifyError && (
                <SpotifyError>
                  This album is not available on Spotify.
                </SpotifyError>
              )}
            </div>
          )}
        </FocusedReviewContainer>
      </FixedContainer>
    );
  }
}

export default Aside;
