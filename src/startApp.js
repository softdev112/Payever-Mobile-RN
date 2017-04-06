import { Linking } from 'react-native';
import log from 'react-native-logging';
import { registerScreens, showScreen } from './common/Navigation';
import StyleSheet from './common/ui/StyleSheet';
import config from './config';
import screens from './screens';
import Store from './store';

const store = new Store(config);

Linking.addEventListener('url', async ({ url }) => {
  if (!await store.auth.checkAuth()) {
    showScreen('core.LaunchScreen');
    return;
  }

  showScreen('pos.Terminal', { url });
});

log.transports.logS.url      = config.debug.logSUrl;
log.transports.logS.level    = config.debug.logSLevel;
log.transports.console.level = config.debug.consoleLevel;

export default async function startApp() {
  registerScreens(screens, store);

  StyleSheet.build();

  if (!await store.auth.checkAuth()) {
    showScreen('core.LaunchScreen');
    return;
  }

  // It will return null in Android. In Android we go
  // to pos.Terminal screen by addEventListener and 'url' event
  const url = await Linking.getInitialURL();
  if (url) {
    showScreen('pos.Terminal', { url });
  } else {
    showScreen('dashboard.ChooseAccount');
  }
}