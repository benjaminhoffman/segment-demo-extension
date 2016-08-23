import  { generateNewFormFields } from './htmlForms';
import  { serializeFormData } from './handleFormSubmit';

var prop_count = 3;

function addFormFields (eventName) {
  return generateNewFormFields(eventName)
}

function removeCustomTextArea () {
  if (document.getElementById('customFields')) {
    document.getElementById('customFields').innerHTML = '';
  }
}


function displayProp() {
    prop_count ++;
    var newcontent = document.createElement('span');
    newcontent.innerHTML = '<label>Custom Prop'+prop_count+':</label> \
    <input type="text" name="customKey'+prop_count+'" value="color" class="label-custom" /> : \
    <input type="text" name="customVal'+prop_count+'" value="blue" class="input-custom" />';
    newcontent.class = 'field'
    document.getElementById("custom_props").appendChild(newcontent);
    document.getElementById("custom_props").appendChild(document.createElement('br'));
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
    console.log(dropdownValue);
    document.getElementById('customFields').innerHTML = addFormFields(dropdownValue);
    if(dropdownValue == '*Custom*'){
      console.log('custom')
      document.getElementById("add_prop").addEventListener("click", displayProp);
    }
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
