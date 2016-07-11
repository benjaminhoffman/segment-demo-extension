$(document).ready(function() {

  console.log('content.js loaded successfully')

  // debugger
  if (!!window.localStorage.segmentData) {
    var segmentLocalStorage = JSON.parse(window.localStorage.segmentData);
    console.log(segmentLocalStorage)
  } else {
    segmentLocalStorage = {};
    console.log(segmentLocalStorage)
  }


  // listen for incoming messages from background.js
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('listener fired')

    var newSegmentData = {};

    // if segmentData exists, we need to parse into an object
    if (!!window.localStorage.segmentData) {

      // parse currently-existing segmentData (that exists in localStorage)
      var currentSegmentData = JSON.parse(window.localStorage.segmentData);

      // add the our trackCall data to our object
      // it will overwrite any existing data if this url has been tagged previously
      currentSegmentData[request.url] = request.trackCall;

      // set our segmentLocalStorage object so we can send track calls
      segmentLocalStorage = currentSegmentData;

      // re-stringify segmentData so we can add it to localStorage
      newSegmentData = JSON.stringify(currentSegmentData);

    } else {

      // add the our trackCall data to our object
      newSegmentData[request.url] = request.trackCall;

      // set our segmentLocalStorage object so we can send track calls
      segmentLocalStorage = newSegmentData;

      // stringify segmentData so we can add it to localStorage
      newSegmentData = JSON.stringify(newSegmentData);
    }

    // set our localStorage data
    window.localStorage.segmentData = newSegmentData;
  });

  console.log(new Date());

  $(document).click(function() {
    if (segmentLocalStorage[window.location.href]) {
      console.log(segmentLocalStorage[window.location.href])
    }
  });
});
