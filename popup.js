
document.addEventListener('DOMContentLoaded', function () {
  function setCurrentTabUrl() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      var tabUrl = tabs[0].url;
      document.getElementById("pageUrl").value = tabUrl;
    });
  }
  setCurrentTabUrl();

  // show or hide the custom event field
  document.getElementById("predefinedEvents").addEventListener('change', function() {
    if (document.getElementById("predefinedEvents").value === 'Custom') {
      document.getElementById("customEvent").classList.remove('hidden')
    } else {
      document.getElementById("customEvent").classList.add('hidden')
    }
  });


  document.getElementById("defineEvent").addEventListener('submit', function(e) {

    // capture form data and serialize
    function getFormData(e) {
      var formData = {}
      var rawData = {}
      for (var i = 0; i < e.target.length; i++) {
        rawData[e.target[i].name] = e.target[i].value;
      }
      formData.url = rawData.url;
      formData.trackCall = {};
      formData.trackCall.userId = rawData.userId;
      formData.trackCall.method = rawData.method;
      
      // if custom track event name is chosen
      if (document.getElementById("predefinedEvents").value === 'Custom') {
        formData.trackCall.name = document.getElementById('customTrackName').value;
      } else { // otherwise, pull track event name from dropdown
        formData.trackCall.name = document.getElementById("predefinedEvents").value;
      }

      // TODO: add properties for custom events

      return formData;
    }

    var formData = getFormData(e);

    // open a port and send our formData to backgound.js
    var port = chrome.runtime.connect({ name: 'events' });
    port.postMessage({newEvent: formData});

    // close extension on form submit
    window.close();

  });
});
