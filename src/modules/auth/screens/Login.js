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

  state: {
    isLoading: boolean;
  };

  $password: TextInput;

  username: string = '';
  password: string = '';

  constructor() {
    super();
    this.state = {
      isLoading: false,
      error: ''
    };
  }

  async onSignIn() {
    // Test if credentials not empty
    if (this.password === '' || this.username === '') {
      this.setState({ error: 'Username and password can not be empty!' });

      return;
    }

    this.setState({ isLoading: true, error: '' });
    const { auth, navigator } = this.props;

    const signInResult = await auth.signIn(this.username, this.password);
    this.setState({
      isLoading: false,
      error: signInResult.error,
    });

    if (signInResult.success) {
      navigator.resetTo({ screen: 'dashboard.ChooseAccount', animated: true });
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
    const { isLoading, error } = this.state;
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
                returnKeyType="next"
                value={this.username}
              />
            </View>
            <View>
              <TextInput
                inputStyle={StyleSheet.flatten(styles.inputStyle)}
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
              <Button title="Sign in" onPress={::this.onSignIn} />
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

  inputStyle: {
    '@media android': {
      paddingBottom: 5,
      paddingTop: 5,
    },
  },

  form: {
    flexDirection: 'column',
    marginTop: '10%',
  },

  submitContainer: {
    marginTop: 20,
  },
});