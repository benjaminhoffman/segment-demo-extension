

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {

  console.log('background.js loaded successfully')
  // Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

    console.log('message function hit')

    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
  });
});



document.addEventListener('DOMContentLoaded', function() {
  console.log('DOMContentLoaded')

  // set the url form field
  function setCurrentTabUrl() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      var tabUrl = tabs[0].url;
      document.getElementById("pageUrl").value = tabUrl;
    });
  }
  setCurrentTabUrl();

  // on form submit
  document.getElementById("defineEvent").addEventListener('submit', function(e) {
    console.log('Form Submit')

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
    console.log(formData)

    // send formData to browser in order to set to localStorage
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      console.log('message func hit')

      chrome.tabs.sendMessage(tabs[0].id, formData);
    });

  }, false);

  // chrome.storage.sync.get("http://www.w3schools.com/html/html5_webstorage.asp", function(results) {
  //   console.log(results)
  // });



  // document.body.addEventListener('click', function() {
  //   if (window.sessionStorage[window.location.href]) {
  //     console.log(window.sessionStorage)
  //   }
  // });

});
