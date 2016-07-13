console.log('content.js')

const trackEvent = {};
const port = chrome.runtime.connect({ name: "events" });

port.postMessage({ url: window.location.href });

port.onMessage.addListener(function(trackEvent) {
  document.body.addEventListener('click', function() {
    console.log(trackEvent)
    port.postMessage({ trackEvent: trackEvent })
  });
});
