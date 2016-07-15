
const trackEvent = {};
const port = chrome.runtime.connect({ name: "events" });

port.postMessage({ url: window.location.href });

port.onMessage.addListener(function(trackEvent) {

  document.body.addEventListener('click', function() {
    console.log('Sent to Segment Debugger: ', trackEvent)
    port.postMessage({ trackEvent: trackEvent })
  });
});
