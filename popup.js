
document.addEventListener('DOMContentLoaded', function () {
  function setCurrentTabUrl() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      var tabUrl = tabs[0].url;
      document.getElementById("pageUrl").value = tabUrl;
    });
  }
  setCurrentTabUrl();

  document.getElementById("defineEvent").addEventListener('submit', function(e) {

    // e.preventDefault();

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
      formData.trackCall.name = rawData.name;
      formData.trackCall.type = rawData.type;
      formData.trackCall.properties = { };
      formData.trackCall.properties[rawData.propKey1] = rawData.propVal1
      formData.trackCall.properties[rawData.propKey2] = rawData.propVal2;
      formData.trackCall.properties[rawData.propKey3] = rawData.propVal3;

      return formData;
    }
    var formData = getFormData(e);

    var port = chrome.runtime.connect({ name: 'events' });
    port.postMessage({newEvent: formData});
    window.close();

  });
});
