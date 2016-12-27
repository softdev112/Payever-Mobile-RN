import { registerScreens, showScreen } from './common/Navigation';
import StyleSheet from './common/ui/StyleSheet';

import config from './config';
import screens from './screens';
import Store from './store';

require('./common/utils/logger');

export default async function startApp() {
  const store = new Store(config);
  registerScreens(screens, store);

  console.log('starting');

  StyleSheet.build();

  const auth = await store.auth.deserialize();
  showScreen(auth.isLoggedIn ? 'dashboard.ChooseAccount' : 'auth.Login');
}