console.log("background.js")

//const Analytics = require('./analytics-node.js');
//const analytics = new Analytics('cuOgSJgFEt1tN3lSUEfvWv6g1NM1hXmY', { flushAt: 1 });

!function(){}();



chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  console.log(message);
  if(message.subject == 'clear'){
    chrome.storage.sync.clear(function() {
        alert('ALL event data cleared')
      });
  }
  if(message.event){
    var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t){var e=document.createElement("script");e.type="text/javascript";e.async=!0;e.src="src/analytics-min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(e,n)};analytics.SNIPPET_VERSION="3.1.0";
    analytics.load('cuOgSJgFEt1tN3lSUEfvWv6g1NM1hXmY');
    analytics.page();
    }
    console.log(message.event);
    var ecommerce_props = {productId: '507f1f77bcf86cd799439011', sku: 'G-32',category: 'Games', name: 'Monopoly: 3rd Edition', brand: 'Hasbro', variant: '200 pieces',price: 18.99, quantity: 1, variant: '200 pieces', coupon: 'MAYDEALS', currency: 'usd', position: 3, value: 18.99};
    analytics.track(message.event,ecommerce_props);
  }
});