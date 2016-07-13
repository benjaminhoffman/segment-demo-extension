var Analytics = require('analytics-node.js')

var analytics = new Analytics("cuOgSJgFEt1tN3lSUEfvWv6g1NM1hXmY");


// analytics.identify('1e810c197e', {
//   name: 'Bill Lumbergh',
//   email: 'bill@initech.com'
// });
//
// analytics.track('Signed Up', {
//   plan: 'Startup',
//   source: 'Analytics Academy'
// });

console.log('content.js loaded successfully')

var trackEvent = {};
var port = chrome.runtime.connect({ name: "events" });

port.postMessage({ url: window.location.href });

port.onMessage.addListener(function(msg) {
  trackEvent = msg;
  document.body.addEventListener('click', function() {
    console.log(trackEvent)
    console.log(window.analytics);
    debugger
  });
});


window.analytics.track('Signed Up', {
  plan: 'Startup',
  source: 'Analytics Academy'
});
