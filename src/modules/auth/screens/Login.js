import { Component } from 'react';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  Button, Container, Error, Header, Link, Loader, Text, TextInput, View
} from 'ui';

import { signIn } from '../actions/auth';

@connect((state) => ({
  error: state.auth.get('error')
}))
export default class Login extends Component {
  static navigatorStyle = {
    navBarHidden: true
  };

  username = '';
  password = '';

  constructor() {
    super();
  }

  onSignIn() {
    const { dispatch, navigator } = this.props;
    dispatch(signIn(this.username, this.password, navigator));
  }

  render() {
    const { error } = this.props;
    return (
      <View style={{flex:1}}>
        <Header>
          <Link>Sign up for free</Link>
        </Header>
        <Container contentContainerStyle={styles.container}>
          <Loader>
            <Error message={error} />
            <View>
              <TextInput
                label="Your e-mail"
                keyboardType="email-address"
                returnKeyType="next"
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

const styles = EStyleSheet.create({
  container: {
    marginTop: '10%'
  },
  submitContainer: {
    marginTop: 20
  }
});