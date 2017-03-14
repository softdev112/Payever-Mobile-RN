import { Component } from 'react';
import { Linking, TouchableOpacity, AsyncStorage } from 'react-native';
import { observer, inject } from 'mobx-react/native';
import { Icon, View, Text, StyleSheet } from 'ui';
import { Navigator } from 'react-native-navigation';
import * as Animatable from 'react-native-animatable';
import { log } from 'utils';

import SvgIconsShow from './SvgIconsShow';
import type { Config } from '../../../../config';

const IS_AGREED_TAG = '@DE_PAYEVER:IS_AGREED';

const termsUrl = 'https://payever.de/en/about/terms-of-service/';
const policyUrl = 'https://getpayever.com/about/privacy/';

@inject('config')
@observer
export default class LaunchScreen extends Component {
  static navigatorStyle = { navBarHidden: true };

  props: {
    navigator: Navigator;
    config: Config;
  };

  state: {
    isAgreed: boolean;
    isSwitchToAgreed: boolean;
  };

  constructor(props) {
    super(props);

    this.state = {
      isAgreed: false,
      isSwitchToAgreed: false,
    };
  }

  async componentWillMount() {
    try {
      const isAgreed = await AsyncStorage.getItem(IS_AGREED_TAG);
      if (isAgreed !== null) {
        this.setState({ isAgreed: JSON.parse(isAgreed) });
      }
    } catch (error) {
      log.error(error);
    }
  }

  async onAgreedPress() {
    try {
      await AsyncStorage.setItem(IS_AGREED_TAG, JSON.stringify(true));
    } catch (error) {
      log.error(error);
    }

    this.setState({ isSwitchToAgreed: true });
  }

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

  onTermsPress() {
    Linking.openURL(termsUrl).catch(log.error);
  }

  onPolicyPress() {
    Linking.openURL(policyUrl).catch(log.error);
  }

  render() {
    const { isAgreed, isSwitchToAgreed } = this.state;

    return (
      <View style={styles.container}>
        <SvgIconsShow style={styles.animContainer} />
        <View style={styles.infoContainer}>
          <Text style={styles.welcomeText}>Welcome to Payever</Text>
          { isAgreed ? (
            <Animatable.View
              style={styles.signInSignUpCont}
              animation={isSwitchToAgreed ? 'zoomIn' : ''}
              duration={400}
              delay={400}
              easing="ease-in-out-cubic"
              onAnimationEnd={() => this.setState({ isSwitchToAgreed: false })}
            >
              <TouchableOpacity onPress={::this.onSignInPress}>
                <View style={styles.authBtn}>
                  <Text style={styles.authBtnText}>Sign In</Text>
                  <Icon
                    style={styles.authBtnText}
                    source="icon-arrow-right-ios-16"
                  />
                </View>
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity onPress={::this.onCreateAccountPress}>
                <View style={styles.authBtn}>
                  <Text style={styles.authBtnText}>Create Account</Text>
                  <Icon
                    style={styles.authBtnText}
                    source="icon-arrow-right-ios-16"
                  />
                </View>
              </TouchableOpacity>
            </Animatable.View>
          ) : (
            <Animatable.View
              style={styles.termsAgreedCont}
              animation={isSwitchToAgreed ? 'zoomOut' : ''}
              duration={400}
              easing="ease-in-out-cubic"
              onAnimationEnd={() => this.setState({ isAgreed: true })}
            >
              <Text style={styles.termsAndPolicyText}>
                {'Tap "Agree & Continue" to accept the Payever'}
              </Text>
              <Text>
                <Text
                  style={styles.termsAndPolicyLinks}
                  onPress={::this.onTermsPress}
                >
                  Terms of Service
                </Text>
                <Text style={styles.termsAndPolicyText}>{' and '}</Text>
                <Text
                  style={styles.termsAndPolicyLinks}
                  onPress={::this.onPolicyPress}
                >
                  Privacy Policy
                </Text>
              </Text>
              <Text
                style={styles.agreeBtn}
                onPress={::this.onAgreedPress}
              >
                Agree & Continue
              </Text>
            </Animatable.View>
          )}
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

  infoContainer: {
    flex: 40,
  },

  termsAgreedCont: {
    flex: 1,
    alignItems: 'center',
  },

  welcomeText: {
    fontSize: '3.7rem',
    fontWeight: '400',
    alignSelf: 'center',
    '@media ios': {
      fontFamily: 'Helvetica Neue',
    },
    '@media android': {
      fontFamily: 'Roboto',
    },
  },

  termsAndPolicyText: {
    marginTop: 20,
    fontSize: '1.7rem',
    fontWeight: '400',
    textAlign: 'center',
    '@media ios': {
      fontFamily: 'Helvetica Neue',
    },
    '@media android': {
      fontFamily: 'Roboto',
    },
  },

  termsAndPolicyLinks: {
    fontSize: '1.7rem',
    fontWeight: '400',
    color: '$pe_color_blue',
    textAlign: 'center',
    '@media ios': {
      fontFamily: 'Helvetica Neue',
    },
    '@media android': {
      fontFamily: 'Roboto',
    },
  },

  agreeBtn: {
    marginTop: '7%',
    fontSize: '2.6rem',
    fontWeight: '400',
    color: '$pe_color_blue',
  },

  signInSignUpCont: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 35,
  },

  authBtn: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  authBtnText: {
    fontSize: '2.2rem',
    fontWeight: '400',
    color: '$pe_color_blue',

  },

  divider: {
    height: 1,
    backgroundColor: '$pe_color_light_gray_1',
  },
});