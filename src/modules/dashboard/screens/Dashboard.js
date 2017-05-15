import { Component } from 'react';
import { Animated, ListViewDataSource } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import type { Navigator } from 'react-native-navigation';
import { GridView, IconText, Loader, StyleSheet, View } from 'ui';
import { ScreenParams } from 'utils';

import type ProfilesStore from '../../../store/profiles';
import type AppItem from '../../../store/profiles/models/AppItem';
import Dock from '../../core/components/Dock';
import SearchHeader from '../components/SearchHeader';

const APP_ICON_WIDTH_PHONE = 90;
const APP_ICON_WIDTH_TABLET = 130;

@inject('profiles', 'config')
@observer
export default class Dashboard extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    navigator: Navigator;
    profiles: ProfilesStore;
  };

  state: {
    appsTop: Array<AppItem>;
  };

  dataSource: ListViewDataSource;

  constructor(props) {
    super(props);

    this.state = {
      appsTop: [],
      appearAnimation: new Animated.Value(1),
    };

    this.dataSource = new GridView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
  }

  async componentWillMount() {
    const { profiles } = this.props;
    const profile = profiles.currentProfile;

    const apps = await profiles.loadApplications(profile.id);
    this.setState({
      appsTop:    apps.filter(a => a.location === 'top'),
    });
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

  renderIcon(item: AppItem) {
    return (
      <IconText
        style={styles.icon}
        imageStyle={styles.icon_image}
        textStyle={styles.icon_title}
        onPress={() => this.onAppClick(item)}
        source={{ uri: item.image }}
        title={item.name}
      />
    );
  }

  render() {
    const { appearAnimation, appsTop } = this.state;
    const dataSourceTop = this.dataSource.cloneWithRows(appsTop);

    const iconWidth = ScreenParams.isTabletLayout()
      ? APP_ICON_WIDTH_TABLET : APP_ICON_WIDTH_PHONE;
    const iconsPerRow = Math.floor(ScreenParams.width / iconWidth);
    const iconsPadding = (ScreenParams.width - (iconsPerRow * iconWidth)) / 2;

    return (
      <Loader isLoading={appsTop.length < 1}>
        <View style={styles.container}>
          <SearchHeader navigator={this.props.navigator} />

          <Animated.View
            style={[
              styles.animationView,
              { transform: [{ scale: appearAnimation }] },
            ]}
          >
            <GridView
              dataSource={dataSourceTop}
              renderRow={::this.renderIcon}
              contentContainerStyle={[
                styles.apps,
                { paddingLeft: iconsPadding },
              ]}
            />
          </Animated.View>

          <Dock floatMode={false} />
        </View>
      </Loader>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  animationView: {
    flex: 1,
  },

  apps: {
    paddingTop: 20,
  },

  cards_container: {
    flexDirection: 'column',
    justifyContent: 'center',
  },

  cards_scroll: {
    paddingLeft: 10,
    paddingRight: 10,
    maxHeight: 500,
  },

  icon: {
    height: 93,
    width: APP_ICON_WIDTH_PHONE,
    marginBottom: 8,
  },

  icon_image: {
    borderRadius: 15,
    elevation: 5,
    height: 50,
    marginBottom: 8,
    shadowColor: 'rgba(0, 0, 0, .1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
    width: 50,
  },

  icon_title: {
    color: '$pe_color_gray_2',
    backgroundColor: 'transparent',
    fontWeight: '400',
    paddingTop: 0,
  },

  '@media (min-width: 550)': {
    icon: {
      width: APP_ICON_WIDTH_TABLET,
      height: 135,
    },

    icon_image: {
      borderRadius: 18,
      height: 80,
      shadowRadius: 10,
      width: 80,
    },

    icon_title: {
      fontSize: 15,
    },
  },
});