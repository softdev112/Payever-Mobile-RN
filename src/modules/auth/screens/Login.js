import { Component } from 'react';
import { Keyboard } from 'react-native';
import { observer, inject } from 'mobx-react/native';
import {
  Button, Container, Error, Header, Link, Loader, StyleSheet,
  TextInput, View,
} from 'ui';
import type { Navigator } from 'react-native-navigation';

import type AuthStore from '../../../store/AuthStore';
import type { Config } from '../../../config/index';

@inject('auth', 'config')
@observer
export default class Login extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    auth: AuthStore;
    navigator: Navigator;
    config: Config;
  };

  $password: TextInput;

  username: string = '';
  password: string = '';

  async onSignIn() {
    const { auth, navigator } = this.props;

    if (this.password === '' || this.username === '') {
      auth.setError('E-mail and password can\'t be empty!');
      return;
    }

    const signInResult = await auth.signIn(this.username, this.password);

    if (signInResult) {
      //noinspection JSUnresolvedFunction
      Keyboard.dismiss();
      navigator.resetTo({ screen: 'dashboard.ChooseAccount' });
    }
  }

  onSignUp() {
    const { config, navigator } = this.props;
    //noinspection JSUnresolvedFunction
    Keyboard.dismiss();
    navigator.push({
      screen: 'core.WebView',
      passProps: { url: config.siteUrl + '/register' },
    });
  }

  render() {
    const { isLoading, error } = this.props.auth;
    return (
      <View style={styles.container}>
        <Header style={styles.header}>
          <Link onPress={::this.onSignUp}>Sign up for free</Link>
        </Header>
        <Loader isLoading={isLoading}>
          <Container contentContainerStyle={styles.form} layout="small">
            <Error
              duration={5000}
              message={error}
            />
            <View>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                autoFocus
                inputStyle={StyleSheet.flatten(styles.inputStyle)}
                keyboardType="email-address"
                label="Your e-mail"
                onChangeText={username => this.username = username}
                onSubmitEditing={() => this.$password.focus()}
                returnKeyType="next"
                value={this.username}
              />
            </View>
            <View>
              <TextInput
                ref={f => this.$password = f}
                label="Your password"
                secureTextEntry
                returnKeyType="send"
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={password => this.password = password}
                onSubmitEditing={::this.onSignIn}
              />
            </View>
            <View style={styles.submitContainer}>
              <Button title="Sign In" onPress={::this.onSignIn} />
            </View>
          </Container>
        </Loader>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
  },

  header: {
    justifyContent: 'flex-start',
  },

  form: {
    flexDirection: 'column',
    marginTop: '10%',
  },

  submitContainer: {
    marginTop: 20,
  },
});