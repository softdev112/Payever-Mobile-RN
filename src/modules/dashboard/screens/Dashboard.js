import { Component } from 'react';
import { Animated } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import type { Navigator } from 'react-native-navigation';
import { GridView, IconText, Loader, StyleSheet, View } from 'ui';

import type AppItem from '../../../store/profiles/models/AppItem';
import Dock from '../../core/components/Dock';
import SearchHeader from '../components/SearchHeader';
import type ProfilesStore from '../../../store/profiles';
import type UIStore from '../../../store/ui';

const ICON_WIDTH_PHONE = 80;
const ICON_HEIGHT_PHONE = 105;
const ICON_WIDTH_TABLET = 135;
const ICON_HEIGHT_TABLET = 145;

@inject('profiles', 'config', 'ui')
@observer
export default class Dashboard extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    navigator: Navigator;
    profiles: ProfilesStore;
    ui: UIStore;
  };

  state: {
    appsTop: Array<AppItem>;
    layoutDone: boolean;
    appearAnimation: Animated.Value;
  };

  constructor(props) {
    super(props);

    this.state = {
      appsTop: [],
      layoutDone: false,
      appearAnimation: new Animated.Value(1),
    };
  }

  async componentWillMount() {
    const { profiles } = this.props;
    const profile = profiles.currentProfile;

    const apps = await profiles.loadApplications(profile.id);
    this.setState({
      appsTop:    apps.filter(a => a.location === 'top'),
    });
  }

  componentDidMount() {
    this.animateLayout();
  }

  onAppClick(app: AppItem) {
    const { navigator } = this.props;

    if (app.settings.screenId) {
      navigator.push({
        title: app.name,
        screen: app.settings.screenId,
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
      });
    }
  }

  animateLayout() {
    Animated.timing(this.state.appearAnimation, {
      toValue: 10,
      delay: 300,
      duration: 300,
    }).start();
  }

  renderIcon({ item }: AppItem, marginLeft) {
    return (
      <IconText
        style={[styles.icon, { marginLeft }]}
        imageStyle={styles.icon_image}
        textStyle={styles.icon_title}
        onPress={() => this.onAppClick(item)}
        source={{ uri: item.image }}
        title={item.name}
      />
    );
  }

  render() {
    const { profiles, ui } = this.props;
    const { appsTop, appearAnimation } = this.state;

    const iconWidth = ui.phoneMode ? ICON_WIDTH_PHONE : ICON_WIDTH_TABLET;
    const iconHeight = ui.phoneMode ? ICON_HEIGHT_PHONE : ICON_HEIGHT_TABLET;

    const opacity = appearAnimation.interpolate({
      inputRange: [1, 10],
      outputRange: [0, 1],
    });

    return (
      <View style={styles.container}>
        <SearchHeader />
        <View style={styles.content}>
          <Loader isLoading={profiles.isLoading || appsTop.length === 0}>
            <Animated.View style={[styles.animationView, { opacity }]}>
              <GridView
                style={styles.appGrid}
                centerContent
                data={appsTop}
                renderItem={::this.renderIcon}
                itemWidth={iconWidth}
                itemHeight={iconHeight}
                numColumns={ui.phoneMode ? 4 : 6}
                keyExtractor={app => app.id}
              />
            </Animated.View>
          </Loader>
          <Dock />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    alignItems: 'center',
  },

  animationView: {
    flex: 1,
  },

  appGrid: {
    paddingTop: 10,
    marginLeft: 0,
  },

  icon: {
    paddingTop: 2,
    height: ICON_HEIGHT_PHONE,
    width: ICON_WIDTH_PHONE,
  },

  icon_image: {
    borderRadius: 14,
    elevation: 4,
    height: 62,
    width: 62,
    marginBottom: 8,
    shadowColor: 'rgba(0, 0, 0, .1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },

  icon_title: {
    color: '$pe_color_gray_2',
    backgroundColor: 'transparent',
    fontWeight: '400',
    paddingTop: 0,
    fontSize: 12,
  },

  '@media (min-width: 370)': {
    appGrid: {
      marginLeft: -12,
    },
  },

  '@media (min-width: 400)': {
    appGrid: {
      marginLeft: -17,
    },
  },

  '@media (min-width: 550)': {
    appGrid: {
      marginLeft: -25,
    },

    icon: {
      width: ICON_WIDTH_TABLET,
      height: ICON_HEIGHT_TABLET,
    },

    icon_image: {
      borderRadius: 19,
      height: 85,
      width: 85,
      shadowRadius: 10,
    },

    icon_title: {
      fontSize: 18,
    },
  },
});