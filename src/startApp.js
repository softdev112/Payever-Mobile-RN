import { registerScreens, showScreen } from './common/Navigation';
import StyleSheet from './common/ui/StyleSheet';

import config from './config';
import screens from './screens';
import Store from './store';

export default async function startApp() {
  const store = new Store(config);
  registerScreens(screens, store);

  StyleSheet.build();

  const isLoggedIn = await store.auth.checkAuth();
  showScreen(isLoggedIn ? 'dashboard.ChooseAccount' : 'auth.Login');
}