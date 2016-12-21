import type Store from '../store';

import { Navigation } from 'react-native-navigation';
import { Provider } from 'mobx-react/native';

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
      for (let key in baseStores) {
        stores[key] = baseStores[key];
      }
    }

    // add own stores
    for (let key in this.props.store) {
      if (!SPECIAL_REACT_KEYS[key]) {
        stores[key] = this.props.store[key];
      }
    }

    return {
      mobxStores: stores
    };
  }
}

export function registerScreens(screens: Object, store: Store) {
  for (let i in screens) {
    if (!screens.hasOwnProperty(i)) continue;
    Navigation.registerComponent(i, () => screens[i], store, MobxRnnProvider);
  }
}

export function showScreen(screenId) {
  Navigation.startSingleScreenApp({
    screen: { screen: screenId },
    appStyle: {
      screenBackgroundColor: '#ffffff'
    },
    drawer: {
      right: {
        screen: 'core.SideMenu'
      },
      style: {
        drawerShadow: 'NO'
      },
      disableOpenGesture: true
    }
  });
}