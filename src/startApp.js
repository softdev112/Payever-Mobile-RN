import { Linking } from 'react-native';
import { registerScreens, showScreen } from './common/Navigation';
import StyleSheet from './common/ui/StyleSheet';
import config from './config';
import screens from './screens';
import Store from './store';

const store = new Store(config);

Linking.addEventListener('url', async ({ url }) => {
  console.log('dddddddddddddddddddddddd');
  if (store.auth.checkAuth()) {
    const tempUrl = 'https://showroom9.payever.de/' + url.substr(26);
    showScreen('pos.Terminal', { url: tempUrl });
  }
});

export default async function startApp() {
  registerScreens(screens, store);

  StyleSheet.build();
  const url1 = await Linking.getInitialURL();
  console.log('ssssssssssssssssssssssssssss111111', url1);
  if (!store.auth.checkAuth()) {
    const url = await Linking.getInitialURL();
    console.log('ssssssssssssssssssssssssssss1111112', url);

    if (url) {
      showScreen('pos.Terminal', { url });
    } else {
      showScreen('dashboard.ChooseAccount');
    }
  } else {
    showScreen('auth.Login');
  }
}