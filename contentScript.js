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
`;

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

const stopLoader = async () => {
  const buttonContainer = await querySelector('.t-buttonContainer', 0);
  buttonContainer.removeChild(buttonContainer.firstChild)
  const downloadButton = createDownloadButton();
  buttonContainer.appendChild(downloadButton);
}

const post = () => {
  const req = new XMLHttpRequest();
  req.onreadystatechange = function(a) {
    if (this.readyState == 4 && this.status == 200) {
      console.log("DONE", req.response);
      stopLoader();
    }
  };
  req.open("POST", 'PUT/YOUR/API/HERE/TO/DOWNLOAD/THE/VIDEO', true);
  req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  console.log(JSON.stringify({url: window.location.href}));
  req.send(JSON.stringify({url: window.location.href}));
}

const querySelector = (query, timeout = 0) =>
  new Promise((resolve,) =>
    setTimeout(() => resolve(document.querySelector(query)), timeout));
 
const addStyle = (() => {
  const style = document.createElement('style');
  document.head.append(style);
  return (styleString) => style.textContent = styleString;
})();

const createDownloadButton = () => {
  const button = document.createElement('button');
  button.innerHTML = 'TELECHARGER';
  button.className = 't-downloadBtn'
  button.addEventListener('click', downloadVideo, false);
  return button;
}

(async () => {
  addStyle(STYLE);
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 't-buttonContainer'

  const downloadButton = createDownloadButton();
  buttonContainer.appendChild(downloadButton);

  const topRowElement = await querySelector('div #top-row.ytd-video-secondary-info-renderer', 3000);
  topRowElement.appendChild(buttonContainer);
})();


/*
chrome.runtime.onMessage.addListener(function(message, sender){
  console.log(message);
})*/