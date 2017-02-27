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
    showScreen('auth.Login');
    return;
  }

  showScreen('pos.Terminal', { url });
});

log.transports.logS.url = config.debug.loggerUrl;

export default async function startApp() {
  registerScreens(screens, store);

  StyleSheet.build();

  if (!await store.auth.checkAuth()) {
    showScreen('auth.Login');
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