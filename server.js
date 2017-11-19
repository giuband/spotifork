const pitchfork = require('pitchfork');
const express = require('express');
const path = require('path');

const { searchAlbumOnSpotify } = require('./spotify');

const app = express();
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'build')));

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.param('page', (req, res, next, page) => {
  try {
    const pitchforkRequest = new pitchfork.Page(page);
    pitchforkRequest.on('ready', () => {
      const { results } = pitchforkRequest;
      const reviews = results.map(res => res.attributes);
      res.json({ reviews });
    });
  } catch (err) {
    res.status(500).send({
      error: 'There was an error while fetching data from pitchfork ',
    });
  }
});

app.get('/getPage/:page', (req, res, next) => {
  next();
});

app.get('/search', (req, res) => {
  const { artist, album } = req.query;
  searchAlbumOnSpotify({ artist, album })
    .then(data => {
      const result = data.body.albums && data.body.albums.items[0];
      if (result) {
        res.json(result);
      } else {
        res.json({ error: 'Not available on spotify' });
      }
    })
    .catch(() => res.json({ error: 'An error occured' }));
});

app.get('/', (req, res) => {
  res.render(path.join(__dirname, 'build/index.html'));
});

app.listen(5000, function() {
  console.log('App listening on port 5000');
});
