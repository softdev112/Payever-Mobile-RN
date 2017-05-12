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

  dataSource: GridView.DataSource;

  constructor(props) {
    super(props);
    this.dataSource = new GridView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
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
      screen: 'communication.Main',
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

  renderRow(profile: Profile) {
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

  renderProfiles(dataSource: GridView.DataSource) {
    //noinspection JSUnresolvedFunction
    if (dataSource.getRowCount() < 1) {
      return (
        <View style={styles.error}>
          <Text>Sorry. Error has occurred. Try again later.</Text>
        </View>
      );
    }

    return (
      <View style={styles.gridWrapper}>
        <GridView
          dataSource={dataSource}
          renderFooter={::this.renderFooter}
          renderRow={::this.renderRow}
          contentContainerStyle={styles.grid}
        />
      </View>
    );
  }

  render() {
    const { profiles } = this.props;

    //noinspection JSUnresolvedFunction
    const dataSource = this.dataSource.cloneWithRows(profiles.getAllProfiles());

    return (
      <View style={styles.container}>
        <Header textStyle={styles.header}>Welcome!</Header>
        <Loader isLoading={profiles.isLoading}>
          {this.renderProfiles(dataSource)}
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

  error: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },

  grid: {
    alignSelf: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },

  gridWrapper: {
    flex: 1,
    flexDirection: 'row',
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