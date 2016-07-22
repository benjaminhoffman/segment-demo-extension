import { generateNewFormFields } from './htmlForms';


function addFormFields (eventName) {

  return generateNewFormFields(eventName)

}

function removeCustomTextArea () {
  if (document.getElementById('customFields')) {
    document.getElementById('customFields').innerHTML = '';
  }
}


// capture form data and serialize
function getFormData(e) {
  const rawData = {};
  const formData = {
    trackCall: {
      properties: {}
    }
  };

  // if user chooses event name other than custom
  const trackName = document.getElementById("predefinedEvents");
  if (trackName.value !== '*Custom*') {

    // serialize our form data
    for (var i = 0; i < e.target.length; i++) {
      rawData[e.target[i].name] = e.target[i].value;
    }

    // create nested trackcall
    for (var key in rawData) {
      formData.trackCall.properties[key] = rawData[key];
    }

    // convert products string into an array
    if (formData.trackCall.properties.products) {
      delete formData.trackCall.properties.products;
      formData.trackCall.properties.products = rawData.products.split(',')
    }

    // delete properties we don't want
    delete formData.trackCall.properties.url;
    delete formData.trackCall.properties[""];
    delete formData.trackCall.properties.method;
    delete formData.trackCall.properties.userId;

    // cache the current URL so we'll know which page to fire this event on
    formData.url = rawData.url;

    // capture the dropdown value and assign it to this track event name
    formData.trackCall.event = trackName.value;
    formData.trackCall.userId = rawData.userId;

  } else {
    // serialize our form data
    for (var i = 0; i < e.target.length; i++) {
      rawData[e.target[i].name] = e.target[i].value;
    }

    // build our flat track properties object
    formData.url = rawData.url;
    formData.trackCall.event = rawData.customTrack;
    formData.trackCall.userId = rawData.userId;
    formData.trackCall.properties[rawData.customKey1] = rawData.customVal1;
    formData.trackCall.properties[rawData.customKey2] = rawData.customVal2;
    formData.trackCall.properties[rawData.customKey3] = rawData.customVal3;
  }
  return formData;
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
    debugger
    console.log('onSubmit')
    const formData = getFormData(e);

    // open a port and send our formData to backgound.js
    const port = chrome.runtime.connect({ name: 'events' });
    port.postMessage({ newEvent: formData });
    port.postMessage({ reload: true });

    // reload webpage & close extension on form submit
    chrome.tabs.reload();
    window.close();
  });
});
