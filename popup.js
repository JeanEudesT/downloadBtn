const CHROME_STORAGE = {
    SETTING_KEY: 'videos-download-setting'
}

const sendToContentScript = (payload) => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, payload);
    })
}

const getDetails = () => {
    const folder = document.getElementById('folderDestination').value
    const instance = document.getElementById('instanceServer').value
    console.log(instance, folder);
    return { folder, instance };
}

const updateSettings = () => {
    const infos = getDetails();  
    chrome.storage.sync.set({ "videos-download-setting": infos }, (e) => {
        console.log(e)
    });
    window.close();
}

(() => {
    const folderInput = document.getElementById('folderDestination');
    const instanceInput = document.getElementById('instanceServer');

    instanceInput.innerHTML = chrome.storage.sync.get(CHROME_STORAGE.SETTING_KEY, (obj) => {
        folderInput.value = obj[CHROME_STORAGE.SETTING_KEY].folder;
        instanceInput.value = obj[CHROME_STORAGE.SETTING_KEY].instance;
    })
})();

document.getElementById('saveButton').addEventListener('click', updateSettings);