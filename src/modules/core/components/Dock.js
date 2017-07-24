import { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react/native';
import { Navigator } from 'react-native-navigation';
import { IconText, images, StyleSheet, View } from 'ui';

import ProfilesStore from '../../../store/profiles';
import ContactsStore from '../../../store/contacts';
import UIStore from '../../../store/ui';
import { Config } from '../../../config';
import AppItem from '../../../store/profiles/models/AppItem';

const APPS: Array<Object> = [
  {
    label: 'purchases',
    name: 'Purchases',
    url: '/private/transactions',
    image: '/images/dashboard/purchases.png',
  },
  {
    label: 'communication',
    name: 'Communication',
    url: '/private/network/app/communication',
    image: '/images/dashboard/communication.png',
  },
  {
    label: 'account',
    name: 'Account',
    image: '/images/dashboard/settings.png',
  },
];

@inject('config', 'contacts', 'profiles', 'ui')
@observer
export default class Dock extends Component {
  static defaultProps = {
    showApps: true,
  };

  static contextTypes = {
    navigator: PropTypes.object.isRequired,
  };

  props: {
    onAppClick: (item: AppItem) => any;
    config: Config;
    contacts: ContactsStore;
    profiles: ProfilesStore;
    ui: UIStore;
  };

  context: {
    navigator: Navigator;
  };

  state: {
    appsBottom: Array<AppItem>;
  };

  constructor(props) {
    super(props);

    this.state = {
      appsBottom: [],
    };
  }

  async componentWillMount() {
    const { contacts, config, profiles } = this.props;
    const profile = profiles.currentProfile;

    // Ping to restore session if app was previously closed
    await contacts.store.api.sessionRestorationPing();

    let apps = [];
    if (profiles.currentProfile.isBusiness) {
      apps = (await profiles.loadApplications(profile.id))
        .filter(a => a.location === 'bottom');
    } else {
      apps = APPS.map((app) => {
        let url = config.siteUrl + app.url;
        if (app.label === 'account') {
          url = profiles.privateProfile.settingsUrl;
        }

        return new AppItem({
          url,
          label: app.label,
          name: app.name,
          image: config.siteUrl + app.image,
        });
      });
    }

    this.setState({ appsBottom: apps });
  }

  async onAppClick(app: AppItem) {
    const { onAppClick, ui } = this.props;
    const { navigator } = this.context;
    const { settings } = app;

    if (onAppClick) {
      onAppClick(app);
    }

    if (app.label === 'dashboard') return;

    const screenId = ui.phoneMode
      ? settings.screenId : (settings.screenIdTablet || settings.screenId);

    if (app.settings.screenId) {
      navigator.push({
        title: app.name,
        screen: screenId,
        animated: false,
      });
      return;
    }

    if (app.url) {
      navigator.push({
        title: app.name,
        screen: 'core.WebView',
        passProps: {
          ...app.settings.webView,
          url: app.url,
        },
        animated: false,
      });
    }
  }

  renderIcon(item: AppItem, index) {
    const imageStyles = [styles.image];

    let title = item.name;
    if (item.label === 'communication') {
      title = 'Chat';
    }

    const imageSource = images.getIconByUrl(item.image);

    return (
      <IconText
        style={styles.icon}
        key={item.label}
        imageStyle={imageStyles}
        textStyle={styles.title}
        onPress={() => this.onAppClick(item, index)}
        source={imageSource || { uri: item.image }}
        title={title}
        titleNumberOfLines={1}
      />
    );
  }

  render() {
    const { appsBottom } = this.state;

    return (
      <View style={styles.container}>
        {
          appsBottom.filter(a => a.label !== 'dashboard')
            .map(::this.renderIcon)
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 95,
    flexWrap: 'nowrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 2,
    backgroundColor: '#fff',
    elevation: 25,
    shadowColor: 'rgba(0, 0, 0, .06)',
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -8 },
  },

  icon: {
    width: 78,
    height: 80,
    '@media android': {
      height: 84,
    },
  },

  image: {
    borderRadius: 14,
    elevation: 3,
    height: 61,
    width: 61,
    marginBottom: 8,
    shadowColor: 'rgba(0, 0, 0, .1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },

  title: {
    color: '$pe_color_gray_2',
    fontSize: 12,
    padding: 0,
    fontWeight: '400',
  },

  homeImage: {
    width: 50,
    height: 50,
    marginVertical: 8,
  },

  // iPhone 6, 6s, 7
  '@media (min-width: 350)': {
    container: {
      paddingHorizontal: '3.5%',
    },
  },

  // iPhone 7+, 6+
  '@media (min-width: 400)': {
    container: {
      paddingHorizontal: '5%',
    },

    icon: {
      width: 80,
    },

    image: {
      width: 61,
      height: 61,
    },

    title: {
      fontSize: 13,
      padding: 0,
    },
  },

  // iPad Air, Air 2 etc
  '@media (min-width: 750)': {
    container: {
      height: 125,
      paddingHorizontal: '6.5%',
    },

    icon: {
      width: 130,
      height: 100,
    },

    image: {
      height: 78,
      width: 78,
      borderRadius: 17,
      shadowRadius: 10,
    },

    title: {
      fontSize: 18,
      padding: 0,
    },
  },

  // iPad 10.5
  '@media (min-width: 830)': {
    container: {
      height: 125,
      paddingHorizontal: '7.2%',
    },
  },

  // iPad Pro 12.9
  '@media (min-width: 1000)': {
    container: {
      height: 145,
      paddingHorizontal: '10%',
    },

    icon: {
      width: 130,
      height: 110,
    },

    image: {
      height: 85,
      width: 85,
      borderRadius: 19,
      shadowRadius: 10,
    },

    title: {
      fontSize: 18,
      padding: 0,
    },
  },
});