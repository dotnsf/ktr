var deviceid = null;
var devicetype = "KTR_Client";
var eventtype = null;
var client;
var pubTopic = 'iot-2/evt/status/fmt/json';
var clientData = {};
clientData.d = {};

var waiting = false;
var waitms = 1000;
$(function(){
  getDeviceId();

  var clientID = 'd:quickstart:' + devicetype + ':' + deviceid;
  client = new Messaging.Client( 'quickstart.messaging.internetofthings.ibmcloud.com', 443, clientID );
  client.onConnectionLost = onConnectionLost;
  client.connect( { onSuccess: onConnect, onFailure: onConnectFailure, useSSL: true } );
});

function debugText( txt ){
  $('#debug').html( txt );
}

function publishMessage( message ){
  if( deviceid != null ){
    var d = {};
    d['message'] = message;

    clientData.d = d;
    clientData.publish();
  }
}

function onConnect(){
  console.log( "Connected." );
}

function onConnectFailure( error ){
  console.log( "Connect Failed." );
  console.log( error.errorCode );
  console.log( error.errorMessage );
}

function onConnectionLost( response ){
  console.log( "Connect Lost." );
  if( response.errorCode !== 0 ){
    console.log( " :" + response.errorMessage );
  }
  client.connect( { onSuccess: onConnect, onFailure: onConnectFailure } );
}

clientData.toJson = function(){
  return JSON.stringify( this );
}

clientData.publish = function(){
  var message = new Messaging.Message( clientData.toJson() );
  message.destinationName = pubTopic;
  client.send( message );
}


function getDeviceId(){
  var did = null;
  cookies = document.cookie.split( '; ' );
  for( i = 0; i < cookies.length; i ++ ){
    str = cookies[i].split( '=' );
    if( unescape( str[0] ) == 'deviceid' ){
      did = unescape( unescape( str[1] ) );
    }
  }

  if( did != null ){
    deviceid = did;
  }else{
    deviceid = generateDeviceId();
  }

  $('#deviceid').html( deviceid );
  document.title = deviceid;
}

function generateDeviceId(){
  var did = '';
  var hx = '0123456789abcdef';
  for( i = 0; i < 12; i ++ ){
    var n = Math.floor( Math.random() * 16 );
    if( n == 16 ){ n = 15; }
    c = hx.charAt( n );
    did += c;
  }

  var str = "deviceid=" + did;
  document.cookie = str;

  return did;
}

