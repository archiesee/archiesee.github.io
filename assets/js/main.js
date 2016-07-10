'use strict';

var configuration = null;

console.log("Begin video capture");

//variables
var snapBtn = document.getElementById('snap');
var constraints = {
  audio: true,
  video: true
};
var video = document.querySelector('video');
var photo = document.getElementById('photo');
var photoContext = photo.getContext('2d');

//event handlers
snapBtn.addEventListener('click', takeSnapshot);

//permissions code
navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

function successCallback(stream) {
    window.stream = stream; // stream available to console
    if (window.URL) {
      video.src = window.URL.createObjectURL(stream);
    } else {
      video.src = stream;
    }
}

function errorCallback(error) {
  console.log('navigator.getUserMedia error: ', error);
}

navigator.getUserMedia(constraints, successCallback, errorCallback);

function takeSnapshot() {
  photoContext.drawImage(video, 0, 0, photo.width, photo.height);
  show(photo);
}
