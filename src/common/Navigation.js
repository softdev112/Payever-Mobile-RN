/* eslint no-prototype-builtins: 0, no-continue: 0 */

import { Navigation, Navigator } from 'react-native-navigation';
import { Provider } from 'mobx-react/native';

import type Store from '../store';

const SPECIAL_REACT_KEYS = { children: true, key: true, ref: true };

class MobxRnnProvider extends Provider {
  props: {
    store: Object
  };

  context: {
    mobxStores: Object
  };

  getChildContext() {
    const stores = {};

    // inherit stores
    const baseStores = this.context.mobxStores;
    if (baseStores) {
      /* eslint guard-for-in: 0 */
      for (const key in baseStores) {
        stores[key] = baseStores[key];
      }
    }

    // add own stores
    for (const key in this.props.store) {
      if (!SPECIAL_REACT_KEYS[key]) {
        stores[key] = this.props.store[key];
      }
    }

    return { mobxStores: stores };
  }
}

export function registerScreens(screens: Object, store: Store) {
  for (const i in screens) {
    if (!screens.hasOwnProperty(i)) continue;
    Navigation.registerComponent(i, () => screens[i], store, MobxRnnProvider);
  }
}

export function showScreen(screenId) {
  Navigation.startSingleScreenApp({
    screen: { screen: screenId },
    appStyle: {
      screenBackgroundColor: '#ffffff',
    },
    drawer: {
      right: {
        screen: 'core.SideMenu',
      },
      style: {
        drawerShadow: 'NO',
      },
      disableOpenGesture: true,
    },
  });
}

export function toggleMenu(navigator: Navigator, params = {}) {
  navigator.push({
    screen: 'core.SideMenu',
    animated: false,
    ...params,
  });
}

export function hideMenu(navigator: Navigator, params = {}) {
  navigator.pop({
    animated: false,
    ...params,
  });
}