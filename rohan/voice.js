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
      var unactivatedIntent = "";
      var activatedIntent = "";

      for (var i = 0; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          // log the latest phrase
          console.log(event.results[i][0].transcript);

          // get intent of phrase
          unactivatedIntent = getIntent(event.results[i][0].transcript);
          console.log(unactivatedIntent);
          console.log(type(unactivatedIntent));

          if(lucyActivated){
            clearTimeout(lucyTimer);
            lucyTimer = setTimeout(function(){ lucyActivated = false;}, 10000);
            activatedIntent = getIntent(event.results[i][0].transcript);
            console.log("I'll tell you your surroundings!");
          } else if(unactivatedIntent.toUpperCase() === "helloArchie".toUpperCase()){
            console.log("Archie Was Called!");
            audio.play();
            lucyActivated = true;
            toggle = true;
            lucyTimer = setTimeout(function(){ lucyActivated = false;}, 10000);
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
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {data:data}, function(response) {
            if(response.type == "test"){
              console.log('test received');
            }
          });
        });
      },
      error: function() {
        return("Internal Server Error");
      }
    });
  }
});