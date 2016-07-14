console.log("background.js")

//const Analytics = require('./analytics-node.js');
//const analytics = new Analytics('cuOgSJgFEt1tN3lSUEfvWv6g1NM1hXmY', { flushAt: 1 });

chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name == 'events');

  port.onMessage.addListener(function(msg) {
    chrome.storage.sync.get(null, function (localStorage) {
      console.log(localStorage)
      if (localStorage[msg.url]) {
        port.postMessage(localStorage[msg.url]);
      }
      else if(localStorage[msg.url+'?customize']){
        port.postMessage(localStorage[msg.url+'?customize']);
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

    if (msg.customize){
      const newEvent = {};
      chrome.extension.getBackgroundPage().console.log(msg.customize.url)
      newEvent[msg.customize] = true;
      chrome.storage.sync.set(newEvent, function() {
        chrome.extension.getBackgroundPage().console.log('customize hit background page')
      });
      
    }
    // sends data to segment onClick
    if (msg.trackEvent) {
      console.log('track event sent to Segment')
      //analytics.identify({ userId: msg.trackEvent.userId });
      //analytics.track(msg.trackEvent);
    }
  });
});
