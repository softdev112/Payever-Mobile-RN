/* eslint-disable */
export default function getInjectedJs(options: InjectOptions) {
  const optionsJson = JSON.stringify(options);
  return `(${injectedBody.toString()})(${optionsJson})`;
}

function injectedBody(options: InjectOptions) {
  'use strict';

  init(options);

  function init(options) {
    window.__DEV__ = options.isDev;
    window.callWebViewOnMessage = callWebViewOnMessage;

    patchMenuButtonPress();

    if (options.platform === 'android') {
      patchSelectElementsForAndroid();
    }

    if (__DEV__) {
      attachErrorHandler();
      patchPostMessage();
    }

    updateNavBarTitle();
  }

  function patchMenuButtonPress() {
    var $btnMenu = document.querySelector('#user-nav-block .dropdown-toggle');
    if ($btnMenu) {
      var $replace = $btnMenu.cloneNode(true);
      $replace.href = 'javascript:return void()';
      $replace.style.marginRight = 0;
      $replace.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        callWebViewOnMessage({ command: 'show-menu' });
      });
      $btnMenu.parentNode.replaceChild($replace, $btnMenu);
    }
  }

  function patchSelectElementsForAndroid() {
    // In Android WebView Select elements
    // don't display well if they have css border just switch off css
    //noinspection ES6ConvertVarToLetConst
    var $selects = document.querySelectorAll('select');

    if (!$selects) return;
    for (let i = 0; i < $selects.length; ++i) {
      // select-custom form-control select-custom-ready
      // select-custom = {opacity: 0} it was only android issue
      $selects[i].className = 'form-control select-custom-ready';
    }
  }

  function patchPostMessage() {
    // To prevent error message in iOS WebView
    var originalPostMessage = window.postMessage;
    var patchedPostMessage = function(message, targetOrigin, transfer) {
      originalPostMessage(message, targetOrigin, transfer);
    };

    patchedPostMessage.toString = function() {
      //noinspection JSUnresolvedVariable
      return String(Object.hasOwnProperty)
        .replace('hasOwnProperty', 'postMessage');
    };

    window.postMessage = patchedPostMessage;
  }

  function attachErrorHandler() {
    window.addEventListener('error', onError);

    function onError(event) {
      var error = event.error;

      callWebViewOnMessage({
        column:    error.column    || event.colno,
        command:   'error',
        line:      error.line      || event.lineno,
        message:   error.message   || event.message,
        sourceUrl: error.sourceUrl || event.filename,
        stack:     error.stack
      });
    }
  }

  // Overridden window.postMessage can be not available when calling
  function callWebViewOnMessage(data) {
    try {
      window.postMessage(JSON.stringify(data));
    } catch(e) {}
  }

  function updateNavBarTitle() {
    var $titleImg = document.querySelector('.channel-title img');
    var image = $titleImg ? $titleImg.src : null;

    var $title = document.querySelector('.channel-title .title');
    var title = $title ? $title.innerText : null;

    if (title || image) {
      callWebViewOnMessage({
        command: 'set-title',
        title: title,
        image: image,
      });
    }
  }
}

type InjectOptions = {
  isDev: boolean;
  platform: 'ios' | 'android';
};