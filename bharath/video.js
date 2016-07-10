'use strict';
var configuration = null;
console.log("Begin video capture");

var clientId = '6a5400948b3b376';

//video stream variables
var constraints = {
  audio: true,
  video: true
};
var video = document.querySelector('video');
var photo = document.getElementById('photo');
var photoContext = photo.getContext('2d');
var dataURL;

//permissions code
navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

function successCallback(stream) {
}

function errorCallback(error) {
  console.log('navigator.getUserMedia error: ', error);
}

function takeSnapshot() {
  photoContext.drawImage(video, 0, 0, photo.width, photo.height);

  //png by default
  dataURL = photo.toDataURL();
  dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  return dataURL;
  var auth = 'Client-ID ' + clientId;
}
  /*$.ajax({
    url: 'https://api.imgur.com/3/image',
    headers: {
        Authorization: auth
    },
    type: 'POST',
    data: {
        image: dataURL

    },
    success: function() {
      var id = result.data.id;
  window.location = 'https://imgur.com/gallery/' + id;
 }
});*/

/*$.ajax({
    url: 'https://api.imgur.com/3/upload.json',
    type: 'POST',
    headers: {
        Authorization: 'Client-ID cc01e3195c1adc2'
    },
    data: {
        type: 'base64',
        name: 'neon.jpg',
        title: 'Nebula',
        description: 'Made using http://29a.ch/sandbox/2011/neonflames/',
        image: dataURL
    },
    dataType: 'json'
}).success(function(data) {
    var url = 'http://imgur.com/' + data.data.id + '?tags';
}).error(function() {
    alert('Could not reach api.imgur.com. Sorry :(');
});*/
