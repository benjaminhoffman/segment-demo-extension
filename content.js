
!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t){var e=document.createElement("script");e.type="text/javascript";e.async=!0;e.src=("https:"===document.location.protocol?"https://":"http://")+"cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(e,n)};analytics.SNIPPET_VERSION="3.1.0";
analytics.load("f3t0jvvn4q");
analytics.page()
}}();

analytics.identify('1e810c197e', {
  name: 'Bill Lumbergh',
  email: 'bill@initech.com'
});

analytics.track('Signed Up', {
  plan: 'Startup',
  source: 'Analytics Academy'
});

console.log('content.js loaded successfully')

var trackEvent = {};
var port = chrome.runtime.connect({ name: "events" });

port.postMessage({ url: window.location.href });

port.onMessage.addListener(function(msg) {
  trackEvent = msg;
  document.body.addEventListener('click', function() {
    window.analytics.track('Signed Up', {
      plan: 'Startup',
      source: 'Analytics Academy'
    });
    console.log(trackEvent)
  });
});
