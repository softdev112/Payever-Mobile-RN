import type { Navigator } from 'react-native-navigation/src/Screen';
import type AuthStore from '../../../store/AuthStore';

import { Component } from 'react';
import { observer, inject } from 'mobx-react/native';

import {
  Button, Container, Error, Header, Link, Loader, StyleSheet, Text,
  TextInput, View
} from 'ui';


@inject('auth')
@observer
export default class Login extends Component {
  static navigatorStyle = {
    navBarHidden: true
  };

  props: {
    auth: AuthStore,
    navigator: Navigator
  };

  state: {
    isLoading: boolean
  };

  refs: {
    password: TextInput
  };

  username: string = '';
  password: string = '';

  constructor() {
    super();
    this.state = { isLoading: false };
  }

  async onSignIn() {
    this.setState({ isLoading: true, error: null });
    const { auth, navigator } = this.props;

    const signInResult = await auth.signIn(this.username, this.password);
    this.setState({
      isLoading: false,
      error: signInResult.error
    });

    if (signInResult.success) {
      navigator.resetTo({ screen: 'dashboard.ChooseAccount', animated: true });
    }
  }

  render() {
    const { isLoading, error } = this.state;
    return (
      <View style={styles.component}>
        <Header style={styles.header}>
          <Link>Sign up for free</Link>
        </Header>
        <Container layout="small" contentContainerStyle={styles.container}>
          <Loader isLoading={isLoading}>
            <Error message={error} />
            <View>
              <TextInput
                label="Your e-mail"
                keyboardType="email-address"
                returnKeyType="next"
                autoCapitalize="none"
                autoCorrect={false}
                autoFocus={true}
                onChangeText={ username => this.username = username }
                onSubmitEditing={() => this.refs.password.focus() }
              />
            </View>
            <View>
              <TextInput
                ref="password"
                label="Your password"
                secureTextEntry={true}
                returnKeyType="send"
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={ password => this.password = password }
                onSubmitEditing={::this.onSignIn}
              />
            </View>
            <View style={styles.submitContainer}>
              <Button title="Sign in" onPress={::this.onSignIn} />
            </View>
          </Loader>
        </Container>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    justifyContent: 'flex-start'
  },

  component: {
    flex: 1,
  },

  container: {
    marginTop: '10%'
  },

  submitContainer: {
    marginTop: 20
  }
});