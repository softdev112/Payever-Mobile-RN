export default function injectedCode() {
  return `(${injectedBody.toString()})()`;
}

function injectedBody() {
  //noinspection ES6ConvertVarToLetConst
  var $btnMenu = document.querySelector('#user-nav-block .dropdown-toggle');
  if ($btnMenu) {
    $btnMenu.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      sendData({ command: 'show-menu' });
    });
  }

  // Overridden window.postMessage can be not available when calling
  function sendData(data) {
    try {
      window.postMessage(JSON.stringify(data));
    } catch(e) {}
  }
}