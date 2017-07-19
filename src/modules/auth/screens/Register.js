import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import type { Navigator } from 'react-native-navigation';
import { google, facebook, linkedIn, twitter } from 'react-native-simple-auth';
import { SocialIconButton, NavBar, StyleSheet, TextButton, View } from 'ui';
import { log } from 'utils';
import { showScreen } from '../../../common/Navigation';
import type { Config } from '../../../config';
import type AuthStore from '../../../store/auth';

@inject('auth', 'config')
@observer
export default class Register extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    config: Config;
    auth: AuthStore;
    navigator: Navigator;
  };

  onRegisterWithTwitter() {
    const { auth, config: { siteUrl, oauthData } } = this.props;
    twitter({
      appId: oauthData.twitter.appId,
      appSecret: oauthData.twitter.appSecret,
      callback: siteUrl + oauthData.twitter.callback,
    }).then(async ({ credentials }) => {
      await auth.signInWithSocial('twitter', credentials);

      const isLoggedIn = await auth.checkAuth();
      if (isLoggedIn) {
        showScreen('dashboard.ChooseAccount');
      }
    }).catch(log.error);
  }

  onRegisterWithFacebook() {
    const { auth, config: { oauthData } } = this.props;

    facebook({
      appId: oauthData.facebook.appId,
      appSecret: oauthData.facebook.appSecret,
      callback: oauthData.facebook.callback,
      scope: oauthData.facebook.scope,
      fields: oauthData.facebook.fields,
    }).then(async ({ credentials }) => {
      await auth.signInWithSocial('facebook', credentials);

      const isLoggedIn = await auth.checkAuth();
      if (isLoggedIn) {
        showScreen('dashboard.ChooseAccount');
      }
    }).catch(log.error);
  }

  onRegisterWithGoogle() {
    const { auth, config: { oauthData } } = this.props;

    google({
      appId: oauthData.google.appId,
      appSecret: oauthData.google.appSecret,
      callback: oauthData.google.callback,
      scope: oauthData.google.scope,
    }).then(async ({ credentials }) => {
      await auth.signInWithSocial('google', credentials);

      const isLoggedIn = await auth.checkAuth();
      if (isLoggedIn) {
        showScreen('dashboard.ChooseAccount');
      }
    }).catch(log.error);
  }

  onRegisterWithLinkedIn() {
    const { auth, config: { oauthData } } = this.props;

    linkedIn({
      appId: oauthData.linkedIn.appId,
      appSecret: oauthData.linkedIn.appSecret,
      callback: oauthData.linkedIn.callback,
      scope: oauthData.linkedIn.scope,
    }).then(async ({ credentials }) => {
      await auth.signInWithSocial('linkedin', credentials);

      const isLoggedIn = await auth.checkAuth();
      if (isLoggedIn) {
        showScreen('dashboard.ChooseAccount');
      }
    }).catch(log.error);
  }

  onRegisterWithEmail() {
    const { navigator } = this.props;
    navigator.push({ screen: 'auth.RegisterWithEmail', animated: true });
  }

  render() {
    return (
      <View style={styles.container}>
        <NavBar>
          <NavBar.Back title="Back" />
          <NavBar.Title title="Add a contact" />
        </NavBar>

        <View style={styles.content}>
          <SocialIconButton
            style={styles.facebookBtn}
            title="REGISTER WITH FACEBOOK"
            iconSource="fa-facebook"
            onPress={::this.onRegisterWithFacebook}
          />

          <SocialIconButton
            style={styles.googleBtn}
            title="REGISTER WITH GOOGLE"
            iconSource="fa-google"
            onPress={::this.onRegisterWithGoogle}
          />

          <SocialIconButton
            style={styles.twitterBtn}
            title="REGISTER WITH TWITTER"
            iconSource="fa-twitter"
            onPress={::this.onRegisterWithTwitter}
          />

          <SocialIconButton
            style={styles.linkedInBtn}
            title="REGISTER WITH LINKEDIN"
            iconSource="fa-linkedin"
            onPress={::this.onRegisterWithLinkedIn}
          />

          <TextButton
            style={styles.withEmailBtn}
            title="REGISTER WITH EMAIL"
            onPress={::this.onRegisterWithEmail}
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

  content: {
    alignItems: 'center',
    marginTop: 50,
    flex: 1,
  },

  facebookBtn: {
    backgroundColor: '$pe_color_facebook',
  },

  googleBtn: {
    marginTop: 16,
    backgroundColor: '$pe_color_google',
  },

  twitterBtn: {
    backgroundColor: '$pe_color_twitter',
    marginTop: 16,
  },

  linkedInBtn: {
    marginTop: 16,
    backgroundColor: '$pe_color_linkedIn',
  },

  withEmailBtn: {
    marginTop: 16,
    alignSelf: 'center',
  },
});