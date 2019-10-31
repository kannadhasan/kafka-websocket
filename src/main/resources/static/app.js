var stompClient = null;
var countMessages = 0;

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    // $("#stream").html("");
}

function connect() {
    var socket = new SockJS('/jdisp-websocket-endpoint');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/dashboard/stream-out', function (message) {
            addDataToChart(message.body);
        })
        stompClient.subscribe('/dashboard/stream-in', function (message) {
            showMessage(message.body);
        });

    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function showMessage(message) {

     var msg = message.toString().split(" ");
    // console.log("message"+message.toString());
    countMessages++;
    // $("#stream").affix("<tr><td>" + message + "</td></tr>");
    var id = "#"+msg[0];
    var tsId = "#"+msg[0]+"_ts";
    $(id).html("<p>" + msg[1] + "</p>");
    $(tsId).html("<p>" + moment().format('MMMM Do YYYY, h:mm:ss:SSS a') + "</p>");
    // if(countMessages > 10){
    //     // console.log(countMessages);
    //     $("#stream tr:first").remove();
    // }
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    // $('#main-content').onload(function () {
    //     connect();
    // })
    $( "#connect" ).click(function() { connect(); });
    $( "#disconnect" ).click(function() { disconnect(); });
});

