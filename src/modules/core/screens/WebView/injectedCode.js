/* eslint-disable */
export default function injectedCode(options: InjectOptions) {
  const optionsJson = JSON.stringify(options);
  return `(${injectedBody.toString()})(${optionsJson})`;
}

function injectedBody(options) {
  init(options);

  function init(options) {
    window.__DEV__ = options.isDev;

    if (options.platform === 'android') {
      patchSelectElementsForAndroid();
    }

    replaceHeaderButtons();

    if (__DEV__) {
      attachOnError();
      patchPostMessage();
    }

    getNavBarInfo();
    patchAddApp();

    setTimeout(() => sendData({
      command: 'hide-loader',
    }, 500));
  }

  function replaceHeaderButtons() {
    //noinspection ES6ConvertVarToLetConst
    var $btnMenu = document.querySelector('#user-nav-block .dropdown-toggle');
    if ($btnMenu) {
      //noinspection ES6ConvertVarToLetConst
      var $replace = $btnMenu.cloneNode(true);
      $replace.href = 'javascript:return void()';
      $replace.style.marginRight = 0;
      $replace.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        sendData({ command: 'show-menu' });
      });
      $btnMenu.parentNode.replaceChild($replace, $btnMenu);
    }

    // Remove hash tags
    const $backBtn = document.querySelector('.btn-primary.btn-link');
    if ($backBtn && $backBtn.href && $backBtn.href.includes('#')) {
      $replace = $backBtn.cloneNode(true);
      $replace.href = $backBtn.href.split('#')[0];
      $replace.style.marginRight = 0;
      $backBtn.parentNode.replaceChild($replace, $backBtn);
    }
  }

  function patchAddApp() {
    //noinspection ES6ConvertVarToLetConst
    function searchModal() {
      const $dialogFooter = document.querySelector('.edit-campaign-add-item > .modal-content > .modal-footer');
      if ($dialogFooter) {
        const $submitButton = $dialogFooter.querySelector('.btn-link.submits-modal');

        function submitHandler() {
          if ($submitButton) {
            $submitButton.click();
          }
        }

        var $topFooter = $dialogFooter.cloneNode(true);

        $topFooter.style.position = 'fixed';
        $topFooter.style.right = 0;
        $topFooter.style.top = 0;
        $topFooter.style.borderBottom = '1px solid #e1e1e1';
        $topFooter.style.backgroundColor = 'white';
        $topFooter.style.width = '100%';
        $topFooter.style.padding = '8px';
        $topFooter.style.paddingRight = '0px';

        const $topSubmitBtn = $topFooter.querySelector('.btn-link.submits-modal');
        if ($topSubmitBtn) {
          $topSubmitBtn.addEventListener('click', submitHandler);
        }

        const $dialog = document.querySelector('.edit-campaign-add-item');
        $dialog.appendChild($topFooter);
      }

      setTimeout(searchModal, 2000);
    }

    setTimeout(searchModal, 2000);
  }

  function patchSelectElementsForAndroid() {
    // In Android WebView Select elements
    // don't display well if they have css border just switch off css
    //noinspection ES6ConvertVarToLetConst
    var $selects = document.querySelectorAll('select');

    if (!$selects) return;
    for(let i = 0; i < $selects.length; ++i) {
      // select-custom form-control select-custom-ready
      // select-custom = {opacity: 0} it was only android issue
      $selects[i].className = 'form-control select-custom-ready';
    }
  }

  function patchPostMessage() {
    // To prevent error message in iOS WebView
    //noinspection ES6ConvertVarToLetConst
    var originalPostMessage = window.postMessage;
    //noinspection ES6ConvertVarToLetConst
    var patchedPostMessage = function(message, targetOrigin, transfer) {
      originalPostMessage(message, targetOrigin, transfer);
    };

    patchedPostMessage.toString = function() {
      //noinspection JSUnresolvedVariable
      return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
    };

    window.postMessage = patchedPostMessage;
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

  function getNavBarInfo() {
    let title = '';
    let titleImgUrl = '';

    const $titleImg = document.querySelector('.channel-title img');
    if ($titleImg) {
      titleImgUrl = $titleImg.getAttribute('src');
    }

    const $title = document.querySelector('.channel-title .title');
    if ($title) {
      title = $title.innerText;
    }

    // Send data to WebView
    if (title !== '' && titleImgUrl !== '') {
      sendData({
        title,
        titleImgUrl,
        command: 'navbar-info',
      });
    }
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
  isDev: boolean;
  platform: string;
};