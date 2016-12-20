import type UserProfilesStore from '../../../store/UserProfilesStore';
import type Profile from '../../../store/UserProfilesStore/Profile';

import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { GridView, Header, IconText, Loader, View, StyleSheet } from 'ui';

@inject('userProfiles')
@observer
export default class ChooseAccount extends Component {
  static navigatorStyle = {
    navBarHidden: true
  };

  props: {
    navigator: Navigator,
    userProfiles: UserProfilesStore
  };

  constructor() {
    super();
    this.state = { isLoading: false };
  }

  async componentWillMount() {
    this.setState({ isLoading: true });
    const { userProfiles } = this.props;
    const profilesLoadResult = await userProfiles.load();
    this.setState({
      isLoading: false,
      error: profilesLoadResult.error
    });
  }

  onProfileClick(profile) {
    const { userProfiles, navigator } = this.props;
    userProfiles.setCurrentProfile(profile);
    navigator.resetTo({
      screen: 'dashboard.Dashboard',
      title: 'Home',
      animated: true
    });
  }

  renderRow(profile: Profile) {
    return (
      <IconText
        imageStyle={styles.logo}
        style={styles.item}
        onPress={() => this.onProfileClick(profile)}
        source={profile.logoSource}
        title={profile.displayName}
      />
    );
  }

  render() {
    const { isLoading } = this.state;
    const { userProfiles } = this.props;
    const profilesArray = userProfiles.toArray();

    const ds = new GridView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    const dataSource = ds.cloneWithRows(profilesArray);

    return (
      <View style={styles.container}>
        <Header>Welcome back. Please choose buying or selling account.</Header>
        <Loader isLoading={isLoading}>
          {profilesArray.length && (
            <GridView
              dataSource={dataSource}
              renderRow={::this.renderRow}
              contentContainerStyle={styles.grid}
            />
          )}
        </Loader>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  grid: {
    paddingTop: 20
  },

  item: {
    width: 120,
    height: 120,
  },

  logo: {
    width: 50,
    height: 50,
    borderRadius: 25
  }
});