const { get } = require('lodash');
const request = require('request');

const { CLIENT_ID, CLIENT_SECRET } = require('./keys');

function btoa(str) {
  if (Buffer.byteLength(str) !== str.length) throw new Error('bad string!');
  return Buffer(str, 'binary').toString('base64');
}

let accessToken;

const authToken = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);

const updateAccessToken = () =>
  new Promise((resolve, reject) => {
    request(
      {
        url: 'https://accounts.spotify.com/api/token',
        method: 'POST',
        headers: {
          Authorization: `Basic ${authToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        json: true,
        body: 'grant_type=client_credentials',
      },
      (err, response) => {
        if (err) {
          reject();
        } else {
          accessToken = response.body.access_token;
          resolve();
        }
      }
    );
  });

const searchAlbumOnSpotify = ({ artist, album }) => {
  const query = encodeURIComponent(`${artist} ${album}`);
  return new Promise((resolve, reject) =>
    request(
      {
        url: `https://api.spotify.com/v1/search?q=${query}&type=album`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        json: true,
      },
      (error, response) => {
        if (error) {
          reject(error);
        } else {
          const hasTokenExpired =
            get(response, 'body.error.message') === 'The access token expired';
          if (hasTokenExpired) {
            return updateAccessToken()
              .then(() => searchAlbumOnSpotify({ artist, album }))
              .catch(reject);
          }
          resolve(response);
        }
      }
    )
  );
};

updateAccessToken();

module.exports = {
  searchAlbumOnSpotify,
};
