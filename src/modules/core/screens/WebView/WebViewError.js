import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { Icon, ImageButton, Button, StyleSheet, Text, View } from 'ui';
import { Navigator } from 'react-native-navigation';

import type UserProfilesStore from '../../../../store/UserProfilesStore';
import { toggleMenu } from '../../../../common/Navigation';

@inject('userProfiles')
@observer
export default class WebViewError extends Component {
  static defaultProps = { canGoBack: false };

  props: {
    canGoBack?: boolean;
    message: string;
    navigator: Navigator;
    onRefreshPress: () => void;
    userProfiles?: UserProfilesStore;
  };

  onBackPress() {
    this.props.navigator.pop();
  }

  onProfilePress() {
    toggleMenu(this.props.navigator);
  }

  render() {
    const { userProfiles, onRefreshPress, message, canGoBack } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon
            style={styles.back}
            source="icon-arrow-left-ios-24"
            onPress={::this.onBackPress}
          />
          <Text style={styles.title}>Error</Text>
          <ImageButton
            source={userProfiles.currentProfile.logoSource}
            style={styles.profile}
            onPress={::this.onProfilePress}
          />
        </View>
        <View style={styles.main}>
          <Text style={styles.error}>{message}</Text>
          <Button
            style={styles.button}
            title={'Try Again'}
            onPress={() => onRefreshPress()}
          />
          <Button
            style={styles.button}
            title={'Previous Page'}
            disabled={!canGoBack}
            onPress={() => onRefreshPress(true)}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 55,
    paddingTop: 13,
    paddingRight: 24,
    paddingBottom: 11,
    paddingLeft: 24,
    borderBottomWidth: 1,
    borderBottomColor: '$pe_color_light_gray_1',
  },

  back: {
    color: '$pe_color_blue',
  },

  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    color: '$pe_color_gray',
  },

  profile: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },

  main: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },

  error: {
    marginBottom: 10,
    textAlign: 'center',
  },

  button: {
    marginBottom: 10,
    width: 140,
  },
});