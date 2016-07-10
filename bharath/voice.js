$( document ).ready(function() {
  // permissions
  navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
  if (navigator.getUserMedia) {
    navigator.getUserMedia(
       {
          video:false,
          audio:true
       },
       function(stream) { /* do something */ },
       function(error) { /* do something */ }
    );
  } else {
    alert('Sorry, the browser you are using doesn\'t support getUserMedia');
  }

  var audio = new Audio('ding.mp3');
  var end = new Audio('woosh.mp3');
  var toggle = false;
  var recognition = new webkitSpeechRecognition();
  var lucyActivated = false;
  var lucyTimer;
  if ('webkitSpeechRecognition' in window) {
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en";
    var final_transcript = '';
    var interim_transcript = '';
    recognition.start();

    recognition.onspeechstart = function(event) {
      start_timestamp = event.timeStamp;
    };

    recognition.onresult = function (event) {
      var final = "";
      var interim = "";
      var intent = "";

      for (var i = 0; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          // log the latest phrase
          var latestPhrase = event.results[i][0].transcript;
          console.log(latestPhrase);

          if(lucyActivated){
            clearTimeout(lucyTimer);
            lucyTimer = setTimeout(function(){ lucyActivated = false;}, 15000);
            getIntent(latestPhrase);
          } else if( (latestPhrase.toUpperCase() === "Archie".toUpperCase()) ||
              (latestPhrase.toUpperCase() === "Hey Archie".toUpperCase()) ||
              (latestPhrase.toUpperCase() === "Hello Archie".toUpperCase()) ||
              (latestPhrase.toUpperCase() === "RT") ||
              (latestPhrase.toUpperCase() === "What's up Archie".toUpperCase()) ){
            console.log("Archie Was Called!");
            audio.play();
            lucyActivated = true;
            toggle = true;
            lucyTimer = setTimeout(function(){ lucyActivated = false;}, 15000);
          }
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
    };

    recognition.onend = function() {
      recognition.start();
    };

    recognition.onerror = function(event) {
      if (event.error == 'no-speech') {
        console.log('info_no_speech');
        if (lucyActivated && toggle) {
          toggle = false;
          end.play();
        }
      }
      if (event.error == 'audio-capture') {
        console.log('info_no_microphone');
      }
      if (event.error == 'not-allowed') {
        if (event.timeStamp - start_timestamp < 100) {
          console.log('info_blocked');
        } else {
          console.log('info_denied');
        }
      }
    };
  }
});

console.log("Begin video capture");

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

console.log("Begin main js execution");

navigator.getUserMedia(constraints, successCallback, errorCallback);

function takeSnapshot() {
  photoContext.drawImage(video, 0, 0, photo.width, photo.height);
  show(photo);
  //png by default
  dataURL = photo.toDataURL();
  dataURL = dataURL.replace(/^data:image\/png;base64,/, "");
  return dataURL;
}

function b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, {type: contentType});
  return blob;
}

// extract an intent
var accessToken = "18e3e0c1d11c4d209fb83af7e3bee9ae";
var subscriptionKey = "9fd0e7e0e29844729d1da6516e8cc3b7";
var baseUrl = "https://api.api.ai/v1/";

function getIntent(query) {
  console.log(query);
  $.ajax({
    type: "POST",
    url: baseUrl + "query/",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    headers: {
      "Authorization": "Bearer " + accessToken,
      "ocp-apim-subscription-key": subscriptionKey
    },
    data: JSON.stringify({ q: query, lang: "en" }),
    success: function(data) {
      console.log("retrieved intent");
      intent = data.result.metadata.intentName;

      if (intent !== ""){
        if (intent === "describeSurroundings"){
          console.log("describing the surroundings");
          // get url of image
          // Bharath's code
          var b64Data = takeSnapshot();
          // getSurroundingContext();
          var contentType = 'image/png';

          var blob = b64toBlob(b64Data, contentType);
          var blobUrl = URL.createObjectURL(blob);
          console.log(blobUrl);
          var formData = new FormData();
          formData.append("username", "Groucho");
          formData.append("accountnum", 123456); // number 123456 is immediately converted to a string "123456"

          getImageTags(blobUrl);
        } else if (intent === "getHelp"){
          // facebook messaging
          // Samhita, add your code here
          console.log("getting you help");
        } else if (intent === "whoIsThere"){
          // facebook face tagging
          // Samhita, add your code here
          console.log("telling you who is around");
        }
      }
    },
    error: function() {
      return("Internal Server Error");
    }
  });
}

function textToVoice(prompt){
  console.log(prompt);
}

function show() {
  Array.prototype.forEach.call(arguments, function(elem) {
    elem.style.display = null;
  });
}
