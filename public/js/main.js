console.log('main.js');

(function() {
  var socket = io();
  
  socket.on('connect', function() {
    console.log('Connected!');
  });
  
  socket.on('tweets', function(tweet) {
    console.log('tweet', tweet);
    
    var html = `
      <div class="row">
        <div class="col-md-6 col-md-offset-3 tweet">
          <div class="tweet-profile-image">
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
  
    $('#tweet-container').prepend(html);
  });

  socket.on('updatedTerm', function(searchTerm) {
    console.log('searchTerm', searchTerm);
    $('h3').text(`Twitter Search for ${ searchTerm }`);
  });

  $('form').on('submit', function(e) {
    e.preventDefault();

    var searchTerm = $('input').val();
    socket.emit('updateTerm', searchTerm);
  });

})();