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
  };

  constructor(props) {
    super(props);

    this.state = {
      isAgreed: true,
    };
  }

  async componentWillMount() {
    let isAgreed = false;
    try {
      const storeItem = await AsyncStorage.getItem(IS_AGREED_TAG);
      isAgreed = storeItem ? !!JSON.parse(storeItem) : false;
    } catch (error) {
      log.error(error);
    }

    this.setState({ isAgreed });
  }

  async onAgreedPress() {
    try {
      await AsyncStorage.setItem(IS_AGREED_TAG, JSON.stringify(true));
    } catch (error) {
      log.error(error);
    }

    this.setState({ isAgreed: true });
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
    const { isAgreed } = this.state;

    return (
      <View style={styles.container}>
        <SvgIconsShow style={styles.animContainer} />
        <View style={styles.contentContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.welcomeText}>Welcome to payever</Text>
            { isAgreed ? (
              <Text style={styles.termsAndPolicyText}>
                {'Start, run and grow your business or get personal offers'}
              </Text>
            ) : (
              <View>
                <Text style={styles.termsAndPolicyText}>
                  {'Tap "Agree & Continue" to accept the payever'}
                </Text>
                <Text
                  style={styles.termsAndPolicyLinks}
                  onPress={::this.onTermsPress}
                >
                  Terms of Service
                  <Text style={styles.termsAndPolicyText}>{' and '}</Text>
                  <Text
                    style={styles.termsAndPolicyLinks}
                    onPress={::this.onPolicyPress}
                  >
                    Privacy Policy
                  </Text>
                </Text>
              </View>
            )}
          </View>
          { isAgreed ? (
            <Animatable.View
              style={styles.signInSignUpCont}
              animation="zoomIn"
              duration={300}
              easing="ease-in-out-cubic"
            >
              <View style={styles.bigDivider} />
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
              <View style={styles.bigDivider} />
            </Animatable.View>
          ) : (
            <View style={styles.agreeBtnCont}>
              <TouchableOpacity onPress={::this.onAgreedPress}>
                <Text style={styles.agreeBtn}>
                  Agree & Continue
                </Text>
              </TouchableOpacity>
            </View>
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

  contentContainer: {
    flex: 40,
  },

  textContainer: {
    paddingHorizontal: 10,
  },

  agreeBtnCont: {
    flex: 1,
    alignItems: 'center',
  },

  welcomeText: {
    fontSize: '3.1rem',
    alignSelf: 'center',
    fontWeight: '300',
    fontFamily: '$font_family',
  },

  termsAndPolicyText: {
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

  termsAndPolicyLinks: {
    fontSize: '1.7rem',
    fontWeight: '400',
    color: '$pe_color_blue',
    textAlign: 'center',
    fontFamily: '$font_family',
  },

  agreeBtn: {
    marginTop: '7%',
    fontSize: '2.4rem',
    fontWeight: '400',
    color: '$pe_color_blue',
  },

  signInSignUpCont: {
    flex: 1,
    justifyContent: 'center',
  },

  authBtn: {
    height: 40,
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
    marginLeft: 35,
  },

  bigDivider: {
    height: 24,
    backgroundColor: '$pe_color_apple_div',
  },
});