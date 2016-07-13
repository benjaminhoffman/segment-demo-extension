console.log("background.js")

const Analytics = require('./analytics-node');
const analytics = new Analytics('cuOgSJgFEt1tN3lSUEfvWv6g1NM1hXmY');

chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name == 'events');

  port.onMessage.addListener(function(msg) {
    chrome.storage.sync.get(null, function (localStorage) {
      console.log(localStorage)
      if (localStorage[msg.url]) {
        port.postMessage(localStorage[msg.url]);
      }
    });

    // clears out chrome's localStorage
    if (msg.clear) {
      chrome.storage.sync.clear(function() {
        alert('ALL event data cleared')
      });
    }

    // creates a new event on form submit (popup.html)
    if (msg.newEvent) {
      const newEvent = {};
      newEvent[msg.newEvent.url] = msg.newEvent.trackCall;
      chrome.storage.sync.set(newEvent, function() {
        console.log('Event Created!')
      });
    }

    // sends data to segment onClick
    if (msg.trackEvent) {
      console.log('track event sent to Segment')
      analytics.identify({ userId: msg.trackEvent.userId });
      analytics.track(msg.trackEvent);
    }
  });
});
