import { Linking } from 'react-native';
import { registerScreens, showScreen } from './common/Navigation';
import StyleSheet from './common/ui/StyleSheet';
import config from './config';
import screens from './screens';
import Store from './store';

const store = new Store(config);

Linking.addEventListener('url', async ({ url }) => {
  const isLoggedIn = await store.auth.checkAuth();
  if (isLoggedIn) {
    showScreen('pos.Terminal', { url });
  } else {
    showScreen('auth.Login');
  }
});

export default async function startApp() {
  registerScreens(screens, store);

  StyleSheet.build();

  const isLoggedIn = await store.auth.checkAuth();
  if (isLoggedIn) {
    // It will return null in Android. In Android we go
    // to pos.Terminal screen by addEventListener and 'url' event
    const url = await Linking.getInitialURL();
    if (url) {
      showScreen('pos.Terminal', { url });
    } else {
      showScreen('dashboard.ChooseAccount');
    }
  } else {
    showScreen('dashboard.ChooseAccount');
  }
}