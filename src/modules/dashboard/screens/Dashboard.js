import type UserProfilesStore from '../../../store/UserProfilesStore/index';
import type AppItem from '../../../store/UserProfilesStore/AppItem';
import type ActivityItem from '../../../store/UserProfilesStore/ActivityItem';

import { Component } from 'react';
import { Animated, ScrollView } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import { GridView, IconText, Loader, Text, StyleSheet, View } from 'ui';

import SearchHeader from '../components/SearchHeader';
import ActivityCard from '../components/ActivityCard';

@inject('userProfiles')
@observer
export default class Dashboard extends Component {
  static navigatorStyle = {
    navBarHidden: true
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

  dataSource: GridView.DataSource;

  constructor(props) {
    super(props);

    this.state = {
      showApps: false,
      appsTop: [],
      appsBottom: [],
      activities: [],
      todos: [],
      appearAnimation: new Animated.Value(1)
    };

    this.dataSource = new GridView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
  }

  async componentWillMount() {
    const { userProfiles } = this.props;

    const apps = await userProfiles.currentProfile.getApplications();
    this.setState({
      appsTop: apps.filter(a => a.location === 'top'),
      appsBottom: apps.filter(a => a.location === 'bottom'),
      activities: await userProfiles.currentProfile.getActivities(),
      todos: await userProfiles.currentProfile.getTodos(),
    });
  }

  animateLayout() {
    this.state.appearAnimation = new Animated.Value(2);
    Animated.timing(this.state.appearAnimation, {
      toValue: 1,
      duration: 300
    }).start();
  }

  onAppClick(item: AppItem) {
    const { navigator, } = this.props;

    if (item.label === 'dashboard') {
      this.animateLayout();
      return this.setState({ showApps: !this.state.showApps });
    }

    if (item.url) {
      navigator.push({
        title: item.name,
        screen: 'core.WebView',
        passProps: { url: item.url },
      });
    }
  }

  renderTopRow(item: AppItem) {
    return (
      <IconText
        imageStyle={styles.top_icon}
        style={styles.top_item}
        textStyle={styles.top_iconTitle}
        onPress={() => this.onAppClick(item)}
        source={{ uri: item.image}}
        title={item.name}
      />
    );
  }

  renderBottomRow(item: AppItem) {
    let title = item.name;
    if (item.label === 'dashboard' && this.state.showApps) {
      title = 'Home';
    }

    return (
      <IconText
        key={item.id}
        imageStyle={styles.bottom_icon}
        textStyle={styles.bottom_iconTitle}
        style={styles.bottom_item}
        onPress={() => this.onAppClick(item)}
        source={{ uri: item.image}}
        title={title}
      />
    );
  }

  render() {
    const {
      appearAnimation, appsTop, appsBottom, showApps, activities, todos
    } = this.state;
    const { navigator, userProfiles } = this.props;
    const dataSourceTop = this.dataSource.cloneWithRows(appsTop);

    const welcomeText = (
      'Welcome to ' + userProfiles.currentProfile.displayName
    ).toUpperCase();

    return (
      <Loader
        isLoading={!appsTop.length}
        containerStyle={styles.loaderContainer}
      >
        <SearchHeader navigator={this.props.navigator} />

        <Animated.View
          style={[
            styles.animationView,
            { transform: [{ scale: appearAnimation }]}
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
              <View style={styles.cards_header}>
                <Text style={styles.cards_welcome}>{welcomeText}</Text>
                <Text style={styles.cards_activity}>Today’s activity</Text>
              </View>
              <ScrollView
                contentContainerStyle={styles.cards_scroll}
                horizontal={true} 
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

        <View style={styles.bottom_grid}>
          {appsBottom.map(::this.renderBottomRow)}
        </View>
      </Loader>
    );
  }
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1
  },

  animationView: {
    flex: 1
  },

  top_grid: {
    paddingTop: 20,
  },

  top_item: {
    width: 110,
    height: 105,
  },

  top_icon: {
    width: 50,
    height: 50,
    marginBottom: 8,
    borderRadius: 15,
    elevation: 5,
    shadowColor: 'rgba(0, 0, 0, .1)',
    shadowOffset: { width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 5
  },

  top_iconTitle: {
    paddingTop: 0,
    color: '$pe_color_gray_2'
  },

  bottom_grid: {
    flexWrap: 'nowrap',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: 8,
    backgroundColor: '#fff',
    shadowColor: 'rgba(0, 0, 0, .06)',
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -8},
    elevation: 25,
  },

  bottom_item: {
    width: 70,
    height: 70
  },

  bottom_icon: {
    width: 40,
    height: 40
  },

  bottom_iconTitle: {
    fontSize: 12,
    paddingTop: 5,
    color: '$pe_color_gray_2'
  },

  cards_container: {
    flex: 1
  },

  cards_scroll: {
    paddingLeft: 10,
    paddingRight: 10
  },

  cards_header: {
    paddingLeft: 20,
    '@media (min-height: 700)': {
      paddingTop: 20,
      paddingBottom: 10
    }
  },

  cards_welcome: {
    color: '$pe_color_gray_2',
    '@media (max-height: 640)': {
      height: 0
    }
  },

  cards_activity: {
    color: '$pe_color_dark_gray',
    fontSize: 24,
    fontFamily: 'Open Sans_light',
    '@media ios': {
      fontFamily: 'HelveticaNeue-Light',
    },
    '@media (max-height: 600)': {
      height: 0
    }
  }
});