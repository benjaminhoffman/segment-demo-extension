console.log('content.js')

// analytics.identify('1e810c197e', {
//   name: 'Bill Lumbergh',
//   email: 'bill@initech.com'
// });
//
// analytics.track('Signed Up', {
//   plan: 'Startup',
//   source: 'Analytics Academy'
// });


var trackEvent = {};
var port = chrome.runtime.connect({ name: "events" });

port.postMessage({ url: window.location.href });

port.onMessage.addListener(function(msg) {
  trackEvent = msg;
  document.body.addEventListener('click', function() {
    console.log(trackEvent)
    port.postMessage({ trackEvent: trackEvent })
  });
});


window.analytics.track('Signed Up', {
  plan: 'Startup',
  source: 'Analytics Academy'
});
