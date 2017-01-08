/* eslint-disable */
export default function injectedCode(options: InjectOptions) {
  const optionsJson = JSON.stringify(options);
  return `(${injectedBody.toString()})(${optionsJson})`;
}

function injectedBody(options) {
  window.__DEV__ = options.isDev;

  if (options.isAddBusiness) {
    replaceSearchWithBackBtn(options);
    attachListenerOnSubmit(businessAddedListener);
  }

  // To prevent error message in iOS WebView
  var originalPostMessage = window.postMessage;
  var patchedPostMessage = function(message, targetOrigin, transfer) {
    originalPostMessage(message, targetOrigin, transfer);
  };

  patchedPostMessage.toString = function() { 
    return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
  };

  window.postMessage = patchedPostMessage;

  replaceHeaderButtons();
  if (__DEV__) {
    attachOnError();
  }

  function replaceHeaderButtons() {
    //noinspection ES6ConvertVarToLetConst
    var $btnMenu = document.querySelector('#user-nav-block .dropdown-toggle');
    if ($btnMenu) {
      $btnMenu.style.display = 'none';
    }

    //noinspection ES6ConvertVarToLetConst
    var $btnProfile = document.querySelector('#user-nav-block .profile');
    if ($btnProfile) {
      //noinspection ES6ConvertVarToLetConst
      var $replace = $btnProfile.cloneNode(true);
      $replace.href = 'javascript:return void()';
      $replace.style.marginRight = 0;
      $replace.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        sendData({ command: 'show-menu' });
      });
      $btnProfile.parentNode.replaceChild($replace, $btnProfile);
    }
  }

  function replaceSearchWithBackBtn({ title }) {
    //noinspection ES6ConvertVarToLetConst
    const $rootNode = document.querySelector('.main-search');

    if ($rootNode) {
      $rootNode.style.display = 'none';
      const containerStyle = '\"padding-top: 5px; display: flex;' +
        'flex-direction: row; justify-content: space-between\"';

      $rootNode.outerHTML =
        `<div style=${containerStyle}>
          <a class="back-selling-link" style="align-self: center" href="#">
            <svg class="icon icon-24">
              <use xlink:href="#icon-arrow-left-ios-24"></use>
            </svg>
          </a>
          <h4 style="">${title}</h4>
        </div>`;

      const $backA = document.querySelector('.back-selling-link');
      $backA.addEventListener('click', goBackListener);
    }
  }

  function attachListenerOnSubmit(listener) {
    // Find submit button
    const $btn = document.querySelector('button[type="submit"]');
    
    if (!$btn) return;

    $btn.addEventListener('click', listener);
  }

  function attachOnError() {
    window.onerror = (errorMsg, url, lineNumber) => {
      sendData({
        errorMsg,
        url,
        lineNumber,
        command: 'error',
      })
    };
  }

  // Overridden window.postMessage can be not available when calling
  function sendData(data) {
    try {
      window.postMessage(JSON.stringify(data));
    } catch(e) {}
  }

  function goBackListener(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    sendData({ command: 'go-back' });
  }

  function businessAddedListener(e) {
    sendData({ command: 'add-business' });
  }
}

export function getLoaderHtml(url: string) {
  return (`
    <!doctype html>
    <html>
    <head>
      <title>Loading...</title>
      <meta charset="utf-8">
      <style>
        @-webkit-keyframes spin {
          0% {  -webkit-transform: rotate(0); }
          100% { -webkit-transform: rotate(360deg); }
        }
        @keyframes spin {
          0% { -webkit-transform: rotate(0); transform: rotate(0); }
          100% { -webkit-transform: rotate(360deg); transform: rotate(360deg); }
        }
        .spinner {
          position: absolute;
          top: 50%;
          left: 50%;
          margin: -32px;
          width: 64px;
          height: 64px;
          -webkit-animation: spin 1s linear infinite;
          animation: spin 1s linear infinite;
          -webkit-transform: translateZ(0);
          transform: translateZ(0);
        }
        .spinner path {
          fill: none;
          stroke: #e1e1e1;
          stroke-width: 1;
          stroke-linecap: butt;
          stroke-linejoin: miter;
          stroke-miterlimit: 10;
          stroke-opacity: 1;
        }
        .spinner .path2 { stroke: #0084ff;}
      </style>
    </head>
    <body>
      <svg 
        class="spinner"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        preserveAspectRatio="xMidYMin slice"
        >
        <path 
          class="path1"
          d="M32,0.501c-17.369,0-31.5,14.131-31.5,31.5s14.131,31.5,31.5,31.5s31.5-14.131,31.5-31.5S49.369,0.501,32,0.501 z"
        />
        <path 
          class="path2"
          d="M32,0.501c-17.369,0-31.5,14.131-31.5,31.5"
        />
      </svg>
      <script>location.href = '${url}';</script>
    </body>
    </html>
  `);
}

type InjectOptions = {
  isDev: boolean,
  isAddBusiness: boolean,
};