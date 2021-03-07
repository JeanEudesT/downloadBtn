const CHROME_STORAGE = {
    SETTING_KEY: 'videos-download-setting'
}

const sendToContentScript = (payload) => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, payload);
    })
}

const getDetails = () => {
    const destination = document.getElementById('folderDestination').value
    const instance = document.getElementById('instanceServer').value
    console.log(instance, destination);
    return { destination, instance };
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

    chrome.storage.sync.get(CHROME_STORAGE.SETTING_KEY, (obj) => {
        folderInput.value = obj[CHROME_STORAGE.SETTING_KEY].destination;
        instanceInput.value = obj[CHROME_STORAGE.SETTING_KEY].instance;
    })
})();

document.getElementById('saveButton').addEventListener('click', updateSettings);
