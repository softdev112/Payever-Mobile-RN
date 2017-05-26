import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { Keyboard } from 'react-native';
import type { Navigator } from 'react-native-navigation';
import {
  GridView, Header, IconText, images, Loader, Text, View, StyleSheet,
} from 'ui';
import { log, pushNotificationsHelper } from 'utils';
import type ProfilesStore from '../../../store/profiles';
import type Profile from '../../../store/profiles/models/Profile';

@inject('profiles')
@observer
export default class ChooseAccount extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    navigator: Navigator;
    profiles: ProfilesStore;
  };

  state: {
    ownBusinessesCount: number;
  };

  $list: GridView;

  constructor(props) {
    super(props);

    const { navigator, profiles } = props;
    navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    this.state = {
      ownBusinessesCount: profiles.ownBusinesses.length,
    };
  }

  async componentWillMount() {
    const { profiles, navigator } = this.props;

    //noinspection JSUnresolvedFunction
    Keyboard.dismiss();

    if (!await profiles.load()) {
      navigator.push({
        screen: 'core.ErrorPage',
        animated: true,
        passProps: { message: profiles.error },
      });
    }

    // Register push notifications
    const { store, privateProfile } = profiles;
    pushNotificationsHelper.createInstance(store.api, privateProfile.user)
      .registerNotifications()
      .catch(log.warn);

    this.setState({ ownBusinessesCount: profiles.ownBusinesses.length });
  }

  onNavigatorEvent(event) {
    const { profiles: { ownBusinesses } } = this.props;
    const { ownBusinessesCount } = this.state;

    switch (event.id) {
      case 'didAppear':
        if (ownBusinesses.length === ownBusinessesCount + 1 && this.$list) {
          this.$list.scrollToEnd();
          this.setState({ ownBusinessesCount: ownBusinesses.length });
        }
        break;

      default:
        break;
    }
  }

  onAddNewBusiness() {
    const { navigator } = this.props;

    navigator.push({
      screen: 'dashboard.AddNewBusiness',
      animated: true,
    });
  }

  onProfileClick(profile: Profile) {
    const { navigator, profiles } = this.props;
    profiles.setCurrentProfile(profile);
    navigator.resetTo({
      screen: profile.isBusiness ? 'dashboard.Dashboard' : 'dashboard.Private',
      animated: true,
    });
  }

  renderFooter() {
    return (
      <IconText
        style={styles.item}
        textStyle={styles.iconTitle}
        imageStyle={styles.logo}
        onPress={::this.onAddNewBusiness}
        source={images.addBusiness}
        title="Add New Business"
      />
    );
  }

  renderItem({ item: profile }: Profile) {
    return (
      <IconText
        style={styles.item}
        textStyle={styles.iconTitle}
        imageStyle={styles.logo}
        onPress={() => this.onProfileClick(profile)}
        source={profile.logoSource}
        title={profile.displayName}
      />
    );
  }

  renderProfiles(data: Array<any>) {
    //noinspection JSUnresolvedFunction
    if (data.length < 1) {
      return (
        <View style={styles.error}>
          <Text>Sorry. Error has occurred. Try again later.</Text>
        </View>
      );
    }

    return (
      <GridView
        style={styles.appGrid}
        data={data}
        ref={r => this.$list = r}
        itemWidth={210}
        renderFooter={::this.renderFooter}
        renderItem={::this.renderItem}
        keyExtractor={item => item.id}
      />
    );
  }

  render() {
    const { profiles } = this.props;

    //noinspection JSUnresolvedFunction
    const data = profiles.getAllProfiles().slice();

    return (
      <View style={styles.container}>
        <Header textStyle={styles.header}>Welcome!</Header>
        <Loader isLoading={profiles.isLoading}>
          {this.renderProfiles(data)}
        </Loader>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },

  appGrid: {
    paddingTop: 10,
  },

  error: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },

  header: {
    fontWeight: 'bold',
  },

  iconTitle: {
    color: 'black',
    fontSize: 14,
    marginTop: 0,
  },

  item: {
    borderColor: '$border_color',
    borderWidth: 1,
    height: 200,
    justifyContent: 'center',
    margin: 10,
    width: 200,
  },

  logo: {
    borderColor: '$border_color',
    borderRadius: 60,
    borderWidth: 1,
    height: 120,
    marginBottom: 20,
    width: 120,
  },
});