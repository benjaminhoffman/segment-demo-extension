import  { generateNewFormFields } from './htmlForms';
import  { serializeFormData } from './handleFormSubmit';

function addFormFields (eventName) {
  return generateNewFormFields(eventName)
}

function removeCustomTextArea () {
  if (document.getElementById('customFields')) {
    document.getElementById('customFields').innerHTML = '';
  }
}

document.addEventListener('DOMContentLoaded', function () {

  // prefill pageUrl form field w/ current page URL
  function setCurrentTabUrl() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      var tabUrl = tabs[0].url;
      document.getElementById("pageUrl").value = tabUrl;
    });
  }
  setCurrentTabUrl();

  // edits custom form fields
  var trackName = document.getElementById("predefinedEvents");
  trackName.addEventListener('change', function() {
    var dropdownValue = trackName.value;
    document.getElementById('customFields').innerHTML = addFormFields(dropdownValue);
  });

  // resets all of extension's localStorage
  document.getElementById("reset").addEventListener('click', function(e) {
    var port = chrome.runtime.connect({ name: 'events' });
    port.postMessage({ clear: true })

    // close extension on form submit
    window.close();
  });

  // adds event for this page on form submit
  // and overwrites any events for this page
  document.getElementById("defineEvent").addEventListener('submit', function(e) {
    console.log('onSubmit')
    const formData = serializeFormData(e);

    // open a port and send our formData to backgound.js
    const port = chrome.runtime.connect({ name: 'events' });
    port.postMessage({ newEvent: formData });
    port.postMessage({ reload: true });

    // reload webpage & close extension on form submit
    chrome.tabs.reload();
    window.close();
  });
});
