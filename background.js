/*
const color = '#3aa757';

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({color});
});


chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
        console.log('url changed');
        chrome.tabs.sendMessage(tabId, { type: 'hello'});
    }
  });
*/