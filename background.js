/*
const color = '#3aa757';

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({color});
});
*/

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status !== 'complete') return;
    console.log('url changed', tabId, changeInfo, tab);
    if (tab.url.includes('/watch')){
        chrome.tabs.sendMessage(tabId, { action: 'ADD_BUTTON'});
    }
});