import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { StyleSheet, View } from 'ui';

import DashboardTitle from '../components/DashboardTitle';
import Dock from '../../core/components/Dock';
import SearchHeader from '../components/SearchHeader';
import type ProfilesStore from '../../../store/profiles';

@inject('config', 'profiles')
@observer
export default class Private extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    profiles: ProfilesStore;
  };

  render() {
    const { profiles } = this.props;
    const userName = profiles.privateProfile.displayName;
    return (
      <View style={styles.container}>
        <SearchHeader />
        <View style={styles.center}>
          <DashboardTitle
            title1="Welcome"
            title2={userName}
            showOnSmallScreens
          />
        </View>
        <Dock floatMode={false} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  center: {
    flex: 1,
  },
});