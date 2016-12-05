import { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Container, Text, TextInput, View } from 'ui';

import { signIn } from '../actions/auth';
import Loader from '../../core/components/Loader';

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
      <Container>
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
        <View>
          <Text>{error}</Text>
        </View>
        <View>
          <Button title="Sign In" onPress={::this.onSignIn} />
        </View>
        <Loader />
      </Container>
    );
  }
}