const STYLE = `
.t-downloadBtn {
  background-color: #C00000;
  border: none;
  color: white;
  height: 37.5px;
  padding-left: 15px;
  padding-right: 15px;
  font-weight: 520;
  font-size: 13.5px;
  border-radius: 2px;
  outline-width: 0px;
  transition: 0.4s;
  font-family: 'Roboto', 'Noto', sans-serif;
}

.t-downloadBtn:hover {
  background-color:#C04D4D;
  box-shadow: 0 0 5pt 0.5pt #D3D3D3;
  cursor:pointer;
}

.t-buttonContainer {
  padding: 6px;
}

.loader {
  border: 8px solid #f3f3f3;
  border-radius: 50%;
  border-top: 8px solid #C00000;
  width: 25px;
  height: 25px;
  animation: spin 1.5s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.notification {
  padding: 5px;
  margin: 15px;
  height: 80px;
  width: 230px;
  border-radius: 4px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  position: fixed;
  bottom: 0;
  right: 0;
  transform: translateX(260px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
}

.animation {
  animation: moveOpen 3s;
}

@keyframes moveOpen {
  from {
    -webkit-transform: translateX(290px);
    visibility: visible;
  }

  25% {
    -webkit-transform: translateX(0));
  }

  75% {
    -webkit-transform: translateX(0);
  }

  to {
    -webkit-transform: translateX(290px);
  }
}

.t-validate {
  background-color: #009D0D;
}

.t-error {
  background-color: #C00000;
}
`;

const CHROME_STORAGE = {
  SETTING_KEY: 'videos-download-setting'
}
const SETTINGS = {};

chrome.storage.sync.get(CHROME_STORAGE.SETTING_KEY, (obj) => {
  console.log(obj);
  updateSettings(obj[CHROME_STORAGE.SETTING_KEY]);
});

const updateSettings = (settings) => Object.assign(SETTINGS, settings);

const downloadVideo = async () => {
  await startLoader();
  post();
}

const startLoader = async () => {
  const buttonContainer = await querySelector('.t-buttonContainer', 0);
  buttonContainer.removeChild(buttonContainer.firstChild);
  const loaderElement = document.createElement('div');
  loaderElement.className = 'loader';
  buttonContainer.appendChild(loaderElement);
}

const stopLoader = async (errors) => {
  const buttonContainer = await querySelector('.t-buttonContainer', 0);
  buttonContainer.removeChild(buttonContainer.firstChild)
  const downloadButton = createDownloadButton();
  buttonContainer.appendChild(downloadButton);
  const isGreenFeedback = !errors ? true : false;
  await pushFeedback(isGreenFeedback);
}

const pushFeedback = async (isGreenFeedback) => {
  const bodyContainer = await querySelector('body', 0);
  const notification = createFeedbackNotification(isGreenFeedback);
  bodyContainer.appendChild(notification);
}

const post = () => {
  const req = new XMLHttpRequest();
  req.onreadystatechange = function(a) {

    if (this.readyState !== 4) return;
    switch(this.status){
      case 200:
        console.log('DONE', req.response);
        stopLoader(false);
        break;
      case 400:
        stopLoader(true);
        break;
      default:
        console.log('DEFAULT SWITCH CASE', req.response);
        stopLoader(true);
    }
  };
  req.open("POST", 'https://'+SETTINGS.instance, true);
  req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  console.log(JSON.stringify({url: window.location.href}));
  req.send(JSON.stringify({url: window.location.href}));
}

const querySelector = (query, timeout = 0) =>
  new Promise((resolve,) =>
    setTimeout(() => resolve(document.querySelector(query)), timeout));

const createFeedbackNotification = (isGreenFeedback) => {
  const backgroundClass = isGreenFeedback ? "t-validate" : "t-error";
  const notification = document.createElement('div');
  notification.className = "notification animation " + backgroundClass;
  notification.innerHTML= isGreenFeedback ? "Telechargement terminé :)" : "Une erreur est survenue, veuillez contacter le dev";
  return notification;
};

const createDownloadButton = () => {
  const button = document.createElement('button');
  button.innerHTML = 'TELECHARGER';
  button.className = 't-downloadBtn'
  button.addEventListener('click', downloadVideo, false);
  return button;
}

const process = async () => {
  const addStyle = (() => {
    const style = document.createElement('style');
    document.head.append(style);
    return (styleString) => style.textContent = styleString;
  })();

  addStyle(STYLE);
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 't-buttonContainer'

  const downloadButton = createDownloadButton();
  buttonContainer.appendChild(downloadButton);

  const topRowElement = await querySelector('div #top-row.ytd-video-secondary-info-renderer', 3000);
  topRowElement.appendChild(buttonContainer);
}
const addDownloadBtn = async (event) => {
  const isAlreadyAdded = !!document.getElementsByClassName('t-downloadBtn').length;
  const isWatchPage = event?.path[0].baseURI.includes("/watch") || location.pathname === "/watch";
  console.log({ isAlreadyAdded, isWatchPage: isWatchPage, ytNavigateFinishEvent: event});
  if (!isAlreadyAdded && isWatchPage) {
    await process();
  }
}

window.addEventListener('yt-navigate-finish', addDownloadBtn, true);

chrome.storage.onChanged.addListener((changes, namespace) => {
  console.log(changes, namespace);
  for(let key in changes){
    switch(key){
      case CHROME_STORAGE.SETTING_KEY:
        updateSettings(changes[key].newValue);
        break;
      default:
        console.error('This key ', key, ' does not exist');
    }
  }
})
