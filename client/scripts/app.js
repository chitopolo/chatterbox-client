var app = {
  requestUrl: 'https://api.parse.com/1/classes/chatterbox',
  postMessage: function(message){

  $.ajax({
  // always use this url
    url: this.requestUrl,
    type: 'POST',
    data: JSON.stringify({ 'username':'rene', 'text':message , 'roomname':"lobby"}),
    contentType: 'application/json; charset=utf-8',
    success: function (data) {
      console.log('chatterbox: Messag sent ' , data);

    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
    });
  },

  getMessages: function(){
    $('.chat').html('');
    $.ajax({
    // always use this url
      url: this.requestUrl+'?order=-updatedAt ',
      type: 'GET',
      // data: JSON.stringify(message),
      contentType: 'application/json; charset=utf-8',
      success: function (data) {
        console.log('chatterbox: Message received: ', data);
        setTimeout(
                  function()
                  {
                     app.init();
                  }, 2000);

      app.logMessages(data['results']);




      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to receive message');
      }
    });
  },
  logMessages: function(data) {
    for(var i = 0; i < 20; i++){
          // $messageDiv = $("<div class='message'/>");
          // var regex = .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
          if(data[i]['text'] && data[i]['username'] && data[i]['roomname']){
            var username = data[i]['username'].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            var text = data[i]['text'].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            var roomname = data[i]['roomname'].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            $('.chat').append("<div class='message'>" + '<span class="username">' + username +'</span>'+ ": " + text + " <span class='room'> " +roomname + " </span></div> ").html();
        }
      };
    },
  init: function(){
    this.getMessages();

    // setInterval(this.getMessages.bind(this), 3000);
  }

}


// console.log(results['results'])
$(document).ready(function(){
  app.init();

  $('.send').on('click', function(){
    app.postMessage($('.newMessage').val());

  });




});
