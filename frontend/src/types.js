// @flow

type ReviewEditorialType = {
  +abstract: string,
  +html: string,
  +text: string,
}

export type ReviewType = {
  +album: string,
  +artist: string,
  +author: string,
  +cover: string,
  +date: string,
  +editorial: ReviewEditorialType,
  +label: string,
  +name: string,
  +page: boolean,
  +score: number,
  +title: string,
  +url: string,
  +year: string,
}

type SpotifyArtistType = {
  +external_urls: {
    +spotify: string,
  },
  +href: string,
  +id: string,
  +name: string,
  +type: 'artist',
  +uri: string,
}

type SpotifyAlbumImageType = {
  +height: number,
  +url: string,
  +width: number,
}

export type SpotifyAlbumType = {
  +album_type: 'album' | 'single' | 'compilation',
  +artists: Array<SpotifyArtistType>,
  +available_markets: Array<string>,
  +external_urls: {
    +spotify: string,
  }, 
  +href: string,
  +id: string,
  +images: Array<SpotifyAlbumImageType>,
  +name: string,
  +type: 'album',
  +uri: string,
}
