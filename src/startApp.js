import { Linking } from 'react-native';
import log from 'react-native-logging';
import { StyleSheet } from 'ui';

import { registerScreens, showScreen } from './common/Navigation';
import config from './config';
import screens from './screens';
import Store from './store';

const store = new Store(config);

// Process deep link in Android
Linking.addEventListener('url', async ({ url }) => {
  store.ui.setDeepLink(url);
  // if (!await store.auth.checkAuth()) {
  //   showScreen('core.LaunchScreen');
  // } else {
  //   deepLinksHelper.processDeepLink(url, store.profiles, Navigation);
  // }
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

  showScreen('core.AllWebView', { passProps: { uri: config.siteUrl } });
}