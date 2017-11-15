console.log('main.js');

(function() {
  var socket = io();

  socket.on('connect', function() {
    console.log('Connected!');
  });

  socket.on('tweets', function(tweet) {
    var html = `
      <div class="row">
        <div class="col-md-8 col-md-offset-2 tweet">
          <div class="profile-image">
            <img src="${ tweet.user_profile_image }" class="avatar pull-left"/>
          </div>
          <div class="names">
            <span class="full-name">${ tweet.name }</span>
            <span class="username">@${ tweet.screen_name }</span>
          </div>
          <div class="contents">
            <span class="text">${ tweet.text }</span>
          </div>
        </div>
      </div>`;

    $('#tweets').prepend(html);
  });

  socket.on('updatedTerm', function(searchTerm) {
    $('h3').text(`Streaming tweets for ${ searchTerm }`);
  });

  socket.on('stopped', function() {
    $('h3').text('');
  });

  $('form').on('submit', function(e) {
    e.preventDefault();

    var searchTerm = $('input').val();
    socket.emit('updateTerm', searchTerm);
  });

  $('.stop').on('click', function(e) {
    socket.emit('stop');
    e.preventDefault();
  });

})();
