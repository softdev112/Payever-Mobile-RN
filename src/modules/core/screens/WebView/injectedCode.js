export default function injectedCode() {
  return `(${injectedBody.toString()})()`;
}

function injectedBody() {
  replaceHeaderButtons();

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
        return false;
      });
      $btnProfile.parentNode.replaceChild($replace, $btnProfile);
    }
  }

  // Overridden window.postMessage can be not available when calling
  function sendData(data) {
    try {
      window.postMessage(JSON.stringify(data));
    } catch(e) {}
  }
}