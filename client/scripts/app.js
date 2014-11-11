var app = {
  requestUrl: 'https://api.parse.com/1/classes/chatterbox',
  messageArray: [],
  send: function(message, username, roomname){

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

  fetch: function(){
     // app.clearMessages();
    $.ajax({
    // always use this url

      type: 'GET',
      url: this.requestUrl+'?order=-updatedAt',
      // data: JSON.stringify(message),
      contentType: 'application/json; charset=utf-8',
      success: function (data) {
      console.log('chatterbox: Message received: ', data);
      app.messageArray = data['results'];
      app.addMessage(data['results']);
      setTimeout(function(){
           app.init();
        }, 2000);




      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to receive message');
      }
    });
  },
  clearMessages: function() {
    $('#chats').empty();
  },
  addMessage: function(data) {
    var cont = $('<div />');
    for(var i = 0; i < 20; i++){
          // $messageDiv = $("<div class='message'/>");
          // var regex = .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
          var username = ' ';
          var text = ' ';
          var roomname = ' ';
          if(data[i]['username']) username = data[i]['username'].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
          if(data[i]['text']) text = data[i]['text'].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
          if(data[i]['roomname']) roomname = data[i]['roomname'].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
          cont.append("<div class='message bg-info'>" + '<span class="username">' + username +'</span>'+ ": " + text + " <span class='room'> " +roomname + " </span></div> ");
      };
      $('#chats').html(cont);
    },
  sortRooms: function(){
    var rooms = {};
    app.messageArray.forEach(function(el){
      rooms[el.roomname] = el.roomname;
    });
    return Object.keys(rooms);
  },
  init: function(){
    this.fetch();

    // setInterval(this.fetch.bind(this), 3000);
  }

}


// console.log(results['results'])
$(document).ready(function(){
  app.init();

  $('.send').on('click', function(){
    app.send($('.newMessage').val());

  });




});
