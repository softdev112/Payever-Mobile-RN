import { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import { Navigator } from 'react-native-navigation';
import { Icon, View, Text, StyleSheet } from 'ui';
import { deepLinksHelper } from 'utils';
import UIStore from '../../../../store/ui';
import ProfilesStore from '../../../../store/profiles';
import SvgIconsShow from './SvgIconsShow';

@inject('profiles', 'ui')
@observer
export default class LaunchScreen extends Component {
  static navigatorStyle = { navBarHidden: true };

  props: {
    navigator: Navigator;
    profiles: ProfilesStore;
    ui: UIStore;
  };

  componentDidMount() {
    const { navigator, profiles, ui } = this.props;
    if (ui.deepLink !== '') {
      deepLinksHelper.processDeepLink(ui.deepLink, profiles, navigator);
    }
  }

  onCreateAccountPress() {
    this.props.navigator.push({
      screen: 'auth.Register',
      animated: true,
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
          <View style={styles.textContainer}>
            <Text style={styles.welcomeText}>Welcome to payever</Text>
            <Text style={styles.subWelcomeText}>
              Start, run and grow your business or get personal offers
            </Text>
          </View>
          <View style={styles.signInSignUpCont}>
            <View style={styles.smallDivider} />
            <TouchableOpacity onPress={::this.onSignInPress}>
              <View style={styles.authBtn}>
                <Text style={styles.authBtnText}>Sign In</Text>
                <Icon
                  style={styles.authBtnIcon}
                  source="icon-arrow-right-ios-16"
                />
              </View>
            </TouchableOpacity>
            <View style={styles.smallDivider} />
            <TouchableOpacity onPress={::this.onCreateAccountPress}>
              <View style={styles.authBtn}>
                <Text style={styles.authBtnText}>Create Account</Text>
                <Icon
                  style={styles.authBtnIcon}
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
  },

  textContainer: {
    paddingHorizontal: 16,
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
  },

  authBtn: {
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 10,
  },

  authBtnText: {
    fontSize: 16,
    fontWeight: '400',
    color: '$pe_color_blue',

  },

  authBtnIcon: {
    fontSize: 16,
    fontWeight: '300',
    color: '$pe_color_light_gray_1',
  },

  smallDivider: {
    height: 1,
    backgroundColor: '$pe_color_apple_div',
    marginLeft: 20,
  },
});