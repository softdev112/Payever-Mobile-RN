import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { Keyboard, Platform } from 'react-native';
import type { Navigator } from 'react-native-navigation';
import {
  GridView, Header, IconText, Loader, Text, View, StyleSheet,
} from 'ui';
import { pushNotificationsHelper } from 'utils';
import type { Config } from '../../../config';
import type UserProfilesStore from '../../../store/UserProfilesStore';
import type Profile from '../../../store/UserProfilesStore/models/Profile';

//noinspection JSUnresolvedVariable
import addBusinessIcon from '../images/add-business.png';

@inject('userProfiles', 'config')
@observer
export default class ChooseAccount extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    config: Config;
    navigator: Navigator;
    userProfiles: UserProfilesStore;
  };

  dataSource: GridView.DataSource;

  constructor(props) {
    super(props);
    this.dataSource = new GridView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
  }

  async componentWillMount() {
    const { userProfiles, navigator } = this.props;

    Keyboard.dismiss();

    if (!await userProfiles.load()) {
      navigator.push({
        screen: 'core.ErrorPage',
        animated: true,
        passProps: { message: userProfiles.error },
      });
    }

    if (Platform.OS === 'ios') {
      // Push notifications ios only yet
      const { store, privateProfile } = userProfiles;

      // Register push notifications
      pushNotificationsHelper.createInstance(store.api, privateProfile.user)
        .registerNotifications();
    }
  }

  onAddNewBusiness() {
    const { navigator, config } = this.props;

    navigator.push({
      screen: 'core.WebView',
      passProps: {
        url: config.siteUrl + '/private/create-business',
        injectOptions: {
          isAddBusiness: true,
          title: 'Add New Business',
          platform: Platform.OS,
        },
      },
    });
  }

  onProfileClick(profile: Profile) {
    const { userProfiles, navigator } = this.props;
    userProfiles.setCurrentProfile(profile);
    navigator.resetTo({
      screen: profile.isBusiness ? 'dashboard.Dashboard' : 'dashboard.Private',
      title: 'Home',
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
        source={addBusinessIcon}
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
    const { userProfiles } = this.props;

    //noinspection JSUnresolvedFunction
    const dataSource = this.dataSource.cloneWithRows(userProfiles.toArray());

    return (
      <View style={styles.container}>
        <Header>Welcome back. Please choose buying or selling account.</Header>
        <Loader isLoading={userProfiles.isLoading}>
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
    justifyContent: 'center',
    flex: 1,
  },

  gridWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  grid: {
    alignSelf: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
    paddingBottom: 20,
  },

  item: {
    justifyContent: 'center',
    margin: 10,
    width: 200,
    height: 200,
    borderWidth: 1,
    borderColor: '$border_color',
  },

  logo: {
    marginBottom: 20,
    width: 120,
    height: 120,
    borderWidth: 1,
    borderColor: '$border_color',
    borderRadius: 60,
  },

  iconTitle: {
    marginTop: 0,
    fontSize: 14,
    color: 'black',
  },
});