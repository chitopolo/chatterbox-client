var app = {
  requestUrl: 'https://api.parse.com/1/classes/chatterbox',
  messageArray: [],
  rooms: {},
  room: 'lobby',

  send: function(message, roomname){
    var user = window.location.search.replace(/\?username=/,'');
    roomname = roomname || 'lobby';
    $.ajax({
    // always use this url
      url: this.requestUrl,
      type: 'POST',
      data: JSON.stringify({ 'username':user, 'text':message , 'roomname':roomname}),
      contentType: 'application/json; charset=utf-8',
      success: function(data) {
        console.log('chatterbox: Messag sent ' , data);

      },
      error: function(data) {
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
      // url: this.requestUrl+'?order=-updatedAt',
      // data: JSON.stringify(message),
      contentType: 'application/json; charset=utf-8',
      success: function (data) {
      app.messageArray = data['results'];
      console.log('chatterbox: Message received: ', data);
      console.log(app.room);
      if(app.room){
        //iterate through data
        // clearInterval(app.id);
        var roomArray = [];
        var dataResults = data.results;
        for(var i = 0; i < dataResults.length; i++){
          //parse roomname
          if(dataResults[i].roomname === app.room){
            roomArray.push(dataResults[i]);
          }
        //assign messageArray to new parsed room array
        data['results'] = roomArray;
        app.clearMessages();
        }
      }
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
    var cont = $('<div class="list-group">'), msgcount;
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
          if(data[i]['roomname']) roomname = data[i]['roomname'].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/()/g, "");
          cont.append("<a href='#'' class='list-group-item'>" + '<h4 class="list-group-item-heading">' + username + "  <small class='room'> " +roomname + " </small> " + '</h4>' + " <p class='list-group-item-text'> " + text);
      };
      $('#chats').html(cont);
    },
  sortRooms: function(){
    app.messageArray.forEach(function(el){
      app.rooms[el.roomname] = el.roomname;
    });

    var roomsOpt = $('<div class="list-group menu">');
    var roomList = Object.keys(app.rooms);
    for(var i = 0; i < roomList.length; i++){
      roomList[i] = roomList[i].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/()/g, "");
      roomsOpt.append('<a href="#" class="list-group-item" id='+roomList[i]+'>'+ roomList[i]+'</a> <br>');
    }
    $('.menu').html(roomsOpt);
  },
  addRoom: function(){
  },
  init: function(){
    this.fetch();
    app.id = setInterval(function(){
       app.fetch();
    }, 2000);
    // setInterval(this.fetch.bind(this), 3000);
   app.sortRooms();
  }

}

$(document).ready(function(){
  app.init();
  $('.send').on('click', function(){
    app.send($('.newMessage').val(), app.room);
    $('.newMessage').val('').attr('placeholder','Enter text Message')

  });
  $('.newRoomName').hide();
  $('.newRoomBtn').on('click', function(){
    $('.newRoomName').show('slow');
  })


  $(document).on('click','.list-group-item', function(){
    var theId = $(this).attr('id');
    console.log(theId);
    app.room = theId;
    app.fetch();

  })

});
