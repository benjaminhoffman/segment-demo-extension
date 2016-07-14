console.log("background.js")

//const Analytics = require('./analytics-node.js');
//const analytics = new Analytics('cuOgSJgFEt1tN3lSUEfvWv6g1NM1hXmY', { flushAt: 1 });


chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  console.log(message);
  if (message.from === 'content') {
    var popupWindows = chrome.extension.getViews({type:'popup'});
    if (popupWindows.length) { // A popup has been found
        popupWindows[0].customize_event(message.subject);
    }
    else{
      chrome.tabs.create({url:"popup.html"});
      var popupWindows = chrome.extension.getViews({type:'popup'});
       if (popupWindows.length) { // A popup has been found
        popupWindows[0].customize_event(message.subject);
      }
    }
  }
});
