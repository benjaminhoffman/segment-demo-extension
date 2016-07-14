console.log('popup.js')


document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("customize").addEventListener('click',function(e){
    chrome.extension.getBackgroundPage().console.log('clicked customize button')
    chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    chrome.tabs.sendMessage(
        tabs[0].id,
        {from:    'popup',
      subject: 'customize'});
  });
  
  });
});