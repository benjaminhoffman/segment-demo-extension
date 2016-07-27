function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

const trackEvent = {};
const port = chrome.runtime.connect({ name: "events" });

port.postMessage({ url: window.location.href });

port.onMessage.addListener(function(trackEvent) {
  var campaign_name = getParameterByName('utm_campaign');
  var campaign_source = getParameterByName('utm_source');
  var campaign_medium = getParameterByName('utm_medium');
  var campaign_term = getParameterByName('utm_term');
  var campaign_content = getParameterByName('utm_content');
  var hash = window.location.hash;
  var page_path = window.location.pathname;
  var page_referrer = document.referrer;
  var page_search = window.location.search;
  var page_title = document.title;
  var page_url = window.location.href;
  var userAgent = navigator.userAgent;
  trackEvent['context']={campaign:{name:campaign_name,source:campaign_source,medium:campaign_medium,term:campaign_term},hash:hash,page:{path:page_path,referrer:page_referrer,search:page_search,title:page_title,url:page_url,userAgent:userAgent}}
  document.body.addEventListener('click', function() {

    console.log('Sent to Segment Debugger: ', trackEvent)
    port.postMessage({ trackEvent: trackEvent})
  });
});
