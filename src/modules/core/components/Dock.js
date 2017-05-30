import { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react/native';
import { Navigator } from 'react-native-navigation';
import { IconText, StyleSheet, View } from 'ui';

import ProfilesStore from '../../../store/profiles';
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

@inject('config', 'profiles', 'ui')
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
    profiles: ProfilesStore;
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
    const { config, profiles } = this.props;
    const profile = profiles.currentProfile;

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
          image: { uri: config.siteUrl + app.image },
        });
      });
    }

    this.setState({ appsBottom: apps });
  }

  onAppClick(app: AppItem) {
    const { onAppClick } = this.props;
    const { navigator } = this.context;

    if (onAppClick) {
      onAppClick(app);
    }

    if (app.label === 'dashboard') return;

    if (app.settings.screenId) {
      navigator.push({
        title: app.name,
        screen: app.settings.screenId,
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
    const logoSource = item.logoSource;
    let title = item.name;
    if (item.label === 'communication') {
      title = 'Chat';
    }

    const imageStyles = [styles.image];

    if (item.label === 'dashboard') {
      title = 'Home';
      logoSource.uri = logoSource.uri.replace('dashboard.png', 'home.png');
      imageStyles.push(styles.homeImage);
    }

    return (
      <IconText
        style={styles.icon}
        key={item.label}
        imageStyle={imageStyles}
        textStyle={styles.title}
        onPress={() => this.onAppClick(item, index)}
        source={logoSource}
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
    justifyContent: 'space-around',
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
    width: 80,
    height: 83,
  },

  image: {
    width: 58,
    height: 65,
  },

  title: {
    color: '$pe_color_gray_2',
    fontSize: 11,
    padding: 0,
    fontWeight: '400',
  },

  homeImage: {
    width: 50,
    height: 50,
    marginVertical: 8,
  },

  '@media (min-width: 400)': {
    icon: {
      width: 80,
    },

    image: {
      width: 65,
      height: 65,
    },

    title: {
      fontSize: 13,
      padding: 0,
    },
  },

  '@media (min-width: 550)': {
    content: {
      height: 185,
    },

    icon: {
      width: 130,
    },

    image: {
      width: 100,
      height: 100,
    },

    title: {
      fontSize: 18,
      padding: 0,
    },
  },
});