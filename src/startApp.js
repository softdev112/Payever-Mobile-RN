import { Provider } from 'mobx-react/native';
import { Navigation } from 'react-native-navigation';
import EStyleSheet from 'react-native-extended-stylesheet';

import configureStore from './store/configureStore';
import { loadSnapshot } from './store/snapshot';
import moduleRegistry from './modules';

import Splash from './modules/core/screens/Splash';

export default async function startApp() {
  showSplashScreen();
  const store = configureStore(await loadSnapshot());
  registerScreens(moduleRegistry.screens, require('./store/index').default);

  EStyleSheet.build();

  const loggedIn = store.getState().auth.loggedIn;
  Navigation.startSingleScreenApp({
    screen: {
      screen: loggedIn ? 'dashboard.Businesses' : 'auth.Login'
    },
    appStyle: {
      screenBackgroundColor: '#ffffff',
    }
  });
}

function showSplashScreen() {
  Navigation.registerComponent('core.Splash', () => Splash);
  Navigation.startSingleScreenApp({
    screen: {
      screen: 'core.Splash'
    }
  });
}

function registerScreens(screens, store) {
  for (let i in screens) {
    if (!screens.hasOwnProperty(i)) continue;
    Navigation.registerComponent(i, () => screens[i], store, Provider);
  }
}