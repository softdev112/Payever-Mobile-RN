import { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { observer, inject } from 'mobx-react/native';
import { Icon, View, Text, StyleSheet } from 'ui';
import { Navigator } from 'react-native-navigation';

import SvgIconsShow from './SvgIconsShow';
import type { Config } from '../../../../config';

@inject('config')
@observer
export default class LaunchScreen extends Component {
  static navigatorStyle = { navBarHidden: true };

  props: {
    navigator: Navigator;
    config: Config;
  };

  onCreateAccountPress() {
    const { config, navigator } = this.props;
    navigator.push({
      screen: 'core.WebView',
      passProps: { url: config.siteUrl + '/register' },
    });
  }

  onSignInPress() {
    this.props.navigator.push({
      screen: 'auth.Login',
      animated: true,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <SvgIconsShow style={styles.animContainer} />
        <View style={styles.contentContainer}>
          <Text style={styles.welcomeText}>Welcome to payever</Text>
          <Text style={styles.subWelcomeText}>
            Start, run and grow your business or get personal offers
          </Text>
          <View style={styles.signInSignUpCont}>
            <TouchableOpacity onPress={::this.onSignInPress}>
              <View style={styles.authBtn}>
                <Text style={styles.authBtnText}>Sign In</Text>
                <Icon
                  style={styles.authBtnText}
                  source="icon-arrow-right-ios-16"
                />
              </View>
            </TouchableOpacity>
            <View style={styles.smallDivider} />
            <TouchableOpacity onPress={::this.onCreateAccountPress}>
              <View style={styles.authBtn}>
                <Text style={styles.authBtnText}>Create Account</Text>
                <Icon
                  style={styles.authBtnText}
                  source="icon-arrow-right-ios-16"
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  animContainer: {
    flexBasis: 40,
    flex: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },

  contentContainer: {
    flex: 40,
    paddingHorizontal: 10,
  },

  welcomeText: {
    fontSize: '3.1rem',
    alignSelf: 'center',
    fontWeight: '300',
    fontFamily: '$font_family',
  },

  subWelcomeText: {
    marginTop: 20,
    '@media (max-height: 620):': {
      marginTop: 10,
    },
    fontSize: '1.7rem',
    fontWeight: '400',
    textAlign: 'center',
    color: '$pe_color_gray_7d',
    fontFamily: '$font_family',
  },

  signInSignUpCont: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 20,
  },

  authBtn: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 35,
  },

  authBtnText: {
    fontSize: '2rem',
    fontWeight: '400',
    color: '$pe_color_blue',

  },

  smallDivider: {
    height: 1,
    backgroundColor: '$pe_color_apple_div',
    marginHorizontal: 35,
  },
});