var app = {
  requestUrl: 'https://api.parse.com/1/classes/chatterbox',
  messageArray: [],
  rooms: {},
  id: 0,

  send: function(message, roomname){

  var user = window.location.search.replace(/\?username=/,'');

  $.ajax({
  // always use this url
    url: this.requestUrl,
    type: 'POST',
    data: JSON.stringify({ 'username':user, 'text':message , 'roomname':"lobby"}),
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

  fetch: function(room){
     // app.clearMessages();
    $.ajax({
    // always use this url

      type: 'GET',
      url: this.requestUrl+'?order=-updatedAt',
      // url: this.requestUrl+'?order=-updatedAt',

      // data: JSON.stringify(message),
      contentType: 'application/json; charset=utf-8',
      success: function (data) {
      console.log('chatterbox: Message received: ', data);
      console.log(room);
      if(room){
        //iterate through data
        // clearInterval(app.id);
        var roomArray = [];
        var dataResults = data.results;
        for(var i = 0; i < dataResults.length; i++){
          //parse roomname
          if(dataResults[i].roomname === room){
            roomArray.push(dataResults[i]);
            // console.log(dataResults[i].roomname, "room:", room);
          }
        //assign messageArray to new parsed room array
        data['results'] = roomArray;
        // console.log(data['results']);
        app.clearMessages();
        }
      }
      app.messageArray = data['results'];
      app.addMessage(data['results']);
      app.sortRooms();



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
    var cont = $('<div />'), msgcount;
    data.length > 20 ? msgCount = 20: msgCount = data.length;
    for(var i = 0; i < msgCount; i++){
        // console.log(data[i].username);
          // $messageDiv = $("<div class='message'/>");
          // var regex = .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
          if(data[i] === undefined ) {
          debugger;
        }
          var username = data[i]['username'].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") ||' ';
          var text = ' ';
          var roomname = ' ';
          // if(data[i]['username']) username = data[i]['username'].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
          if(data[i]['text']) text = data[i]['text'].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
          if(data[i]['roomname']) roomname = data[i]['roomname'].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
          cont.append("<div class='message bg-info'>" + '<span class="username">' + username +'</span>'+ ": " + text + " <span class='room'> " +roomname + " </span></div> ");
      };
      $('#chats').html(cont);
    },
  sortRooms: function(){
    app.messageArray.forEach(function(el){
      app.rooms[el.roomname] = el.roomname;
    });

    var roomsOpt = $('<select />');
    var roomList = Object.keys(app.rooms);
    for(var i = 0; i < roomList.length; i++){
      roomsOpt.append('<option value='+roomList[i] +'>'+ roomList[i]+'</option>');
    }
    $('.roomNameDiv').html(roomsOpt);
  },
  init: function(){
      // room = room || null;

    this.fetch();
    app.id = setInterval(function(){
       app.fetch();
    }, 2000);
    // setInterval(this.fetch.bind(this), 3000);
  }

}


// console.log(results['results'])
$(document).ready(function(){
  app.init();
   app.sortRooms();

  $('.send').on('click', function(){
    app.send($('.newMessage').val());
    $('.newMessage').val('').attr('placeholder','Enter text Message')

  });

  // $('.roomname')on




});
