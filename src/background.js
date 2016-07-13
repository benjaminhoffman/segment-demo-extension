console.log("background.js")

// const Analytics = require('./analytics-node');
// const analytics = new Analytics('cuOgSJgFEt1tN3lSUEfvWv6g1NM1hXmY');

var port;

chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name == 'events');

  port.onMessage.addListener(function(msg) {
    chrome.storage.sync.get(null, function (localStorage) {
      if (localStorage[msg.url]) {
        port.postMessage(localStorage[msg.url]);
      }
    });

    if (msg.newEvent) {
      var newEvent = {};
      newEvent[msg.newEvent.url] = msg.newEvent.trackCall;
      chrome.storage.sync.set(newEvent, function() {
        console.log('Event Created!')
      });
    }

    if (msg.trackEvent) {
      console.log("YESSSSS")
      console.log(msg)
      analytics.track('Signed Up', {
        plan: 'Startup',
        source: 'Analytics Academy'
      });

    }
  });
});
