import { Provider } from 'react-redux';
import { Navigation } from 'react-native-navigation';

import configureStore from './store/configureStore';
import { loadSnapshot } from './store/snapshot';
import moduleRegistry from './modules';

import Splash from './modules/core/screens/Splash';

export default async function startApp() {
  showSplashScreen();
  const store = configureStore(await loadSnapshot());
  registerScreens(moduleRegistry.screens, store);

  const loggedIn = store.getState().auth.loggedIn;
  Navigation.startSingleScreenApp({
    screen: {
      screen: loggedIn ? 'dashboard.Businesses' : 'auth.Login'
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