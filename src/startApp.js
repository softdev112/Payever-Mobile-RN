import { Linking } from 'react-native';
import { registerScreens, showScreen } from './common/Navigation';
import StyleSheet from './common/ui/StyleSheet';
import config from './config';
import screens from './screens';
import Store from './store';

const store = new Store(config);

Linking.addEventListener('url', async ({ url }) => {
  if (store.auth.isLoggedIn) {
    const tempUrl = 'https://showroom9.payever.de/' + url.substr(26);
    showScreen('pos.Terminal', { url: tempUrl });
  }
});

export default async function startApp() {
  registerScreens(screens, store);

  StyleSheet.build();

  const auth = await store.auth.deserialize();
  const url = await Linking.getInitialURL();

  if (auth && auth.isLoggedIn) {
    if (url) {
      showScreen('pos.Terminal', { url });
    } else {
      showScreen('dashboard.ChooseAccount');
    }
  } else {
    showScreen('auth.Login');
  }
}