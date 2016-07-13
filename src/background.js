console.log("background.js")

const Analytics = require('./analytics-node');
const analytics = new Analytics('cuOgSJgFEt1tN3lSUEfvWv6g1NM1hXmY');

var port;

chrome.runtime.onConnect.addListener(function(port) {
  console.log('listening')
  console.assert(port.name == 'events');

  port.onMessage.addListener(function(msg) {
    chrome.storage.sync.get(null, function (localStorage) {
      console.log(localStorage)
      if (localStorage[msg.url]) {
        console.log('event saved (to extension storage)')
        console.log(localStorage[msg.url])
        port.postMessage(localStorage[msg.url]);
      }
    });

    // clears out chrome's localStorage
    if (msg.clear) {
      chrome.storage.sync.clear(function() {
        alert('ALL event data cleared')
      });
    }

    if (msg.newEvent) {
      var newEvent = {};
      newEvent[msg.newEvent.url] = msg.newEvent.trackCall;
      chrome.storage.sync.set(newEvent, function() {
        console.log('Event Created!')
      });
    }

    if (msg.trackEvent) {
      console.log("about to fire event")
      console.log(msg)
      analytics.identify({ userId: msg.trackEvent.userId });
      analytics.track(msg.trackEvent);
    }
  });
});
