import { Linking } from 'react-native';
import log from 'react-native-logging';
import { Navigation } from 'react-native-navigation';
import { registerScreens, showScreen } from './common/Navigation';
import StyleSheet from './common/ui/StyleSheet';
import config from './config';
import screens from './screens';
import Store from './store';

const store = new Store(config);

// Process deep link in Android
Linking.addEventListener('url', async ({ url }) => {
  store.ui.setDeepLink(url);

  if (!await store.auth.checkAuth()) {
    showScreen('core.LaunchScreen');
  } else {
    Navigation.showModal({ screen: 'core.DeepLinksPopup', animated: true });
  }
});

log.transports.logS.url      = config.debug.logSUrl;
log.transports.logS.level    = config.debug.logSLevel;
log.transports.console.level = config.debug.consoleLevel;

export default async function startApp() {
  registerScreens(screens, store);

  StyleSheet.build();

  const url = await Linking.getInitialURL();
  if (url) {
    store.ui.setDeepLink(url);
  }

  if (!await store.auth.checkAuth()) {
    showScreen('core.LaunchScreen');
  } else {
    showScreen('dashboard.ChooseAccount');
  }
}