console.log("AAAAAAA")

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
  });
});
