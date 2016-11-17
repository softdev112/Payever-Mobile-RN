import { Component } from 'react';
import { Router, Scene } from 'react-native-router-flux';

import WebViewContainer from './containers/WebViewContainer';
import PageTwo from './containers/Example2';

export default class App extends Component {
  render() {
    return (
      <Router getSceneStyle={getSceneStyle}>
        <Scene key="root">
          <Scene
            key="webview"
            component={WebViewContainer}
            hideNavBar={true}
            initial={true}
          />
          <Scene key="pageTwo" component={PageTwo} title="PageTwo"/>
        </Scene>
      </Router>
    )
  }
}

function getSceneStyle(props, computedProps) {
  const style = {
    flex: 1
  };
  if (computedProps.isActive) {
    style.marginTop = computedProps.hideNavBar ? 0 : 64;
    style.marginBottom = computedProps.hideTabBar ? 0 : 50;
  }
  return style;
}