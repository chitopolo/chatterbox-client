// YOUR CODE HERE:
var requestUrl = 'https://api.parse.com/1/classes/chatterbox';
// var results;
$.ajax({
  // always use this url
  url: requestUrl,
  type: 'GET',
  // data: JSON.stringify(message),
  contentType: 'application/json',
  success: function (data) {
    logMessages(data['results']);
    console.log('chatterbox: Message received: ', data);
  },
  error: function (data) {
    // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    console.error('chatterbox: Failed to receive message');
  }
});
// console.log(results['results'])

var logMessages = function(data){
  for(var i = 0; i < 20; i++){
      console.log(data[i]);
      // $messageDiv = $("<div class='message'/>");

    $('.chat').append("<div class='message'>" + '<span class="username">' + data[i]['username'] +'</span>'+ ": " + data[i]['text'] + "</div> ").html();

  };
};

