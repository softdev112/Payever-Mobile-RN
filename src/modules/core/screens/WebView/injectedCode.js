export default function injectedCode(options: Object) {
  const optionsJson = JSON.stringify(options);
  return `(${injectedBody.toString()})(${optionsJson})`;
}

function injectedBody(options) {
  window.__DEV__ = options.__DEV__;

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
      $replace.style.marginRight = 0;
      $replace.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        sendData({ command: 'show-menu' });
      });
      $btnProfile.parentNode.replaceChild($replace, $btnProfile);
    }
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
}