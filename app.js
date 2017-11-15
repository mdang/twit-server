require('dotenv').config({ silent: true });

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const ejsLayouts = require('express-ejs-layouts');
const Twit = require('twit');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(ejsLayouts);

app.get('/', (req, res) => {
  res.render('index');
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const twitter = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

const server = require('http').createServer(app);
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('Server started on port %s', port);

  const io = require('socket.io')(server);
  let stream;

  io.on('connect', socket => {
    socket.on('updateTerm', terms => {
      if (stream) {
        stream.stop();
      }

      const termsArr = terms.replace(/\s+/g, '').split(',');

      stream = twitter.stream('statuses/filter', { track: termsArr, language: 'en' });
      stream.on('tweet', tweet => {
        const data = {
          name: tweet.user.name,
          screen_name: tweet.user.screen_name,
          user_profile_image: tweet.user.profile_image_url,
          text: tweet.text
        };

        socket.emit('tweets', data);
      });

      socket.emit('updatedTerm', terms);
    });

    socket.on('stop', () => {
      if (stream) {
        stream.stop();
        socket.emit('stopped');
      }
    });
  });
});

module.exports = server;
