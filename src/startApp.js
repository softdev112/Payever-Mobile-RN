import  { registerScreens, showScreen }  from './common/Navigation';
import EStyleSheet from 'react-native-extended-stylesheet';

import config from './config';
import screens from './screens';
import Store from './store';

export default async function startApp() {
  const store = new Store(config);
  registerScreens(screens, store);

  EStyleSheet.build();

  const auth = await store.auth.deserialize();
  showScreen(auth.isLoggedIn ? 'dashboard.ChooseAccount' : 'auth.Login')
}