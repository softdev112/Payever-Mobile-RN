import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { Platform } from 'react-native';
import type { Navigator } from 'react-native-navigation';
import {
  GridView, Header, IconText, Text,
  Loader, View, StyleSheet,
} from 'ui';

import type { Config } from '../../../config';
import type UserProfilesStore from '../../../store/UserProfilesStore';
import type Profile from '../../../store/UserProfilesStore/Profile';

import addBusinessIcon
  from '../../../store/UserProfilesStore/images/add-business.png';

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

    this.state = { isLoading: false };

    this.dataSource = new GridView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
  }

  async componentWillMount() {
    this.setState({ isLoading: true });
    const { userProfiles, navigator } = this.props;
    const profilesLoadResult = await userProfiles.load();

    if (!profilesLoadResult.success) {
      navigator.push({
        screen: 'core.ErrorPage',
        animated: true,
        passProps: { message: profilesLoadResult.error },
      });
    }

    this.setState({
      isLoading: false,
    });
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

  renderProfiles(profilesCount, dataSource) {
    if (profilesCount < 1) {
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
    const { isLoading } = this.state;
    const { userProfiles } = this.props;
    const profilesArray = userProfiles.toArray();

    //noinspection JSUnresolvedFunction
    const dataSource = this.dataSource.cloneWithRows(profilesArray);

    return (
      <View style={styles.container}>
        <Header>Welcome back. Please choose buying or selling account.</Header>
        <Loader isLoading={isLoading}>
          {this.renderProfiles(profilesArray.length, dataSource)}
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