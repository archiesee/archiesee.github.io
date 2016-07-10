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
  //png by default
  dataURL = photo.toDataURL("image/png");
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






          var tinyPic = document.getElementById('tiny');
          var tinyPicContext = tinyPic.getContext('2d');
          tinyPicContext.drawImage(photo, 0, 0, tinyPic.width, tinyPic.height);
          var tinyb64 = tinyPic.toDataURL("image.png");
          tinyb64 = tinyb64.replace(/^data:image\/png;base64,/, "");




          // var URL = window.URL || window.webkitURL;

          // var blob = b64toBlob(b64Data, contentType);
          // var blobUrl = URL.createObjectURL(blob);
          // console.log(blobUrl);

          // var posting = {};

          // var formData = new FormData();

          // var pos = 0;
          // var increment =  Math.round(b64Data.length/501);

          // for (i = 1; i <= 500; i++) {
          //   formData.append("string" + i, b64Data.substr(pos, increment));
          //   pos += increment;
          // }
          // formData.append("string501", b64Data.substr(pos, b64Data.length));
          // posting.b64 = b64Data;
          // posting.type = contentType;

          // // HTML file input, chosen by user

          // var request = new XMLHttpRequest();
          // request.open('POST', 'http://localhost:8080/endpoint');
          // request.send(formData);


          
          $.ajax({
            type: 'POST',
            data: '{ "imgData" : "' + tinyb64 + '" }',
            contentType: 'application/json',
            url: 'http://localhost:8080/endpoint',            
            success: function(resp) {
                console.log('sent image to server!');
                console.log(resp.url);
                getImageTags(resp.url);
            }
          });

          } else if (intent === "getHelp"){
            // facebook messaging
            textToVoice("getting help");
            //prompt = "Sent email for help";
            console.log("getting you help");
          } else if (intent === "whoIsThere"){
            // facebook face tagging
            textToVoice("Barry");
            //prompt = "Barry is there"
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

    if ('speechSynthesis' in window) {
        var sentence = new SpeechSynthesisUtterance();
        var voices = window.speechSynthesis.getVoices();
        for(var i = 0; i < voices.length; i++) {
              if(voices[i]['name'] == "Alex"){
                sentence.voice = voices[i];
              }
          }
        sentence.pitch = 0.5;
        sentence.rate = 1;
        sentence.volume = 10;
        sentence.text = prompt;
        window.speechSynthesis.speak(sentence);
      } else {
        window.alert("Oops! Your browser does not support HTML SpeechSynthesis.");
      }
  }