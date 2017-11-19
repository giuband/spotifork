export const SERVER_URL =
  process.env.NODE_ENV === 'production'
    ? window.location.origin
    : 'http://localhost:5000';

export const RIGHT_SIDEBAR_WIDTH: string = '330px';

export const NAVBAR_HEIGHT: string = '126px';

export const CONTENT_WIDTH: string = `
  max-width: 90%;
  margin-left: auto;
  margin-right: auto;

  @media screen and (min-width: 768px) {
    max-width: 80%;
  }

  @media screen and (min-width: 1200px) {
    max-width: 900px;
  }
`

export const SERIF_FONT: string = `
  font-family: 'Playfair Display', serif;
`;

export const SANS_SERIF_FONT: string = `
  font-family: 'Roboto', sans-serif;
  font-weight: 300;
`

export const palette = {
  gray0: '#343434',
  gray1: '#605E5E',
  gray2: '#999999',
  white: '#FFF',
  white1: '#F5F5F5'
}

export const ACTIVE_ELEMENT = `
  &:hover, &:active, &:focus
`