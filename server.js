const p = require('pitchfork');
const express = require('express');
const request = require('request');
const path = require('path');

const { CLIENT_ID, CLIENT_SECRET } = require('./keys');

const app = express();
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'build')));

let accessToken;

function btoa(str) {
  if (Buffer.byteLength(str) !== str.length) throw new Error('bad string!');
  return Buffer(str, 'binary').toString('base64');
}

const authToken = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);

request(
  {
    url: 'https://accounts.spotify.com/api/token',
    method: 'POST',
    headers: {
      Authorization: `Basic ${authToken}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    json: true,
    body: 'grant_type=client_credentials'
  },
  (err, response) => {
    accessToken = response.body.access_token;
  }
);

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.param('page', (req, res, next, page) => {
  const s = new p.Page(page);
  s.on('ready', () => {
    const { results } = s;
    const reviews = results.map(res => res.attributes);
    res.json({ reviews });
  });
});

app.get('/getPage/:page', (req, res, next) => {
  next();
});

app.get('/search', (req, res) => {
  const { artist, album } = req.query;
  const query = encodeURIComponent(`${artist} ${album}`);
  request(
    {
      url: `https://api.spotify.com/v1/search?q=${query}&type=album`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      json: true
    },
    (err, response) => {
      const result = response.body.albums.items[0];
      if (result) {
        res.json(result);
      } else {
        res.json({ error: 'Not available on spotify' });
      }
    }
  );
});

app.get('/', (req, res) => {
  res.render(path.join(__dirname, 'build/index.html'));
});

app.listen(5000, function() {
  console.log('Example app listening on port 5000!');
});
