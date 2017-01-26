import { Component } from 'react';
import { Animated, ListViewDataSource, ScrollView } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import type { Navigator } from 'react-native-navigation';
import { GridView, IconText, Loader, StyleSheet, View } from 'ui';

import type UserProfilesStore from '../../../store/UserProfilesStore/index';
import type ActivityItem from
  '../../../store/UserProfilesStore/models/ActivityItem';
import type AppItem from '../../../store/UserProfilesStore/models/AppItem';
import ActivityCard from '../components/ActivityCard';
import Dock from '../components/Dock';
import DashboardTitle from '../components/DashboardTitle';
import SearchHeader from '../components/SearchHeader';

@inject('userProfiles', 'config')
@observer
export default class Dashboard extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    navigator: Navigator;
    userProfiles: UserProfilesStore;
  };

  state: {
    showApps: boolean;
    appsTop: Array<AppItem>;
    appsBottom: Array<AppItem>;
    activities: Array<ActivityItem>;
    todos: Array<ActivityItem>;
  };

  dataSource: ListViewDataSource;

  constructor(props) {
    super(props);

    this.state = {
      showApps: false,
      appsTop: [],
      appsBottom: [],
      activities: [],
      todos: [],
      appearAnimation: new Animated.Value(1),
    };

    this.dataSource = new GridView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
  }

  async componentWillMount() {
    const { userProfiles } = this.props;
    const profile = userProfiles.currentProfile;

    const apps = await userProfiles.loadApplications(profile.id);
    this.setState({
      appsTop:    apps.filter(a => a.location === 'top'),
      appsBottom: apps.filter(a => a.location === 'bottom'),
      activities: await userProfiles.loadActivities(profile.id),
      todos:      await userProfiles.loadTodos(profile.id),
    });
  }

  onAppClick(app: AppItem) {
    const { navigator } = this.props;

    if (app.label === 'dashboard') {
      this.animateLayout();
      this.setState({ showApps: !this.state.showApps });
      return;
    }

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
    this.state.appearAnimation = new Animated.Value(2);
    Animated.timing(this.state.appearAnimation, {
      toValue: 1,
      duration: 300,
    }).start();
  }

  renderTopRow(item: AppItem) {
    return (
      <IconText
        style={styles.top_item}
        imageStyle={styles.top_icon}
        textStyle={styles.top_iconTitle}
        onPress={() => this.onAppClick(item)}
        source={{ uri: item.image }}
        title={item.name}
      />
    );
  }

  render() {
    const {
      appearAnimation, appsTop, appsBottom, showApps, activities, todos,
    } = this.state;
    const { navigator, userProfiles } = this.props;
    const dataSourceTop = this.dataSource.cloneWithRows(appsTop);
    const businessName = userProfiles.currentProfile.displayName;

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
            {showApps && (
              <GridView
                dataSource={dataSourceTop}
                renderRow={::this.renderTopRow}
                contentContainerStyle={styles.top_grid}
              />
            )}

            {!showApps && (
              <View style={styles.cards_container}>
                <DashboardTitle
                  title1={businessName}
                  title2="Today’s activity"
                />
                <ScrollView
                  contentContainerStyle={styles.cards_scroll}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                >
                  {todos.map((activity) => (
                    <ActivityCard
                      key={activity.id}
                      activity={activity}
                      navigator={navigator}
                    />
                  ))}
                  {activities.map((activity) => (
                    <ActivityCard
                      key={activity.id}
                      activity={activity}
                      navigator={navigator}
                    />
                  ))}
                </ScrollView>
              </View>
            )}
          </Animated.View>

          <Dock
            navigator={navigator}
            apps={appsBottom}
            onAppClick={::this.onAppClick}
            showApps={showApps}
          />
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

  top_grid: {
    paddingTop: 20,
  },

  top_item: {
    width: 100,
    height: 105,
  },

  top_icon: {
    width: 50,
    height: 50,
    marginBottom: 8,
    borderRadius: 15,
    elevation: 5,
    shadowColor: 'rgba(0, 0, 0, .1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },

  top_iconTitle: {
    paddingTop: 0,
    color: '$pe_color_gray_2',
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
});