import { Component } from 'react';
import { connect } from 'react-redux';
import {
  Button, Dimensions, StyleSheet, Text, TextInput, View
} from 'react-native';

import { signIn } from '../actions/auth';

@connect((state) => ({
  error: state.auth.get('error')
}))
export default class Login extends Component {
  static navigatorStyle = {
    navBarHidden: true
  };

  constructor() {
    super();
    this.state = {
      username: '',
      password: ''
    }
  }

  onSignIn() {
    const { dispatch, navigator } = this.props;
    const { username, password } = this.state;
    dispatch(signIn(username, password, navigator));
  }

  render() {
    const { error } = this.props;
    const width = Dimensions.get('window').width;
    return (
      <View style={{ alignItems: 'center' }}>
        <View style={{ width: width * .8 }}>
          <View style={styles.inputContainer}>
            <TextInput
              onChangeText={username => this.setState({ username })}
              placeholder="Your e-mail"
              autoCorrect={false}
              autoFocus={true}

            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Your password"
              secureTextEntry={true}
              autoCorrect={false}
              onChangeText={password => this.setState({ password })}
            />
          </View>
          <View>
            <Text>{error}</Text>
          </View>
          <View>
            <Button title="Sign in" onPress={::this.onSignIn}/>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  form: {

  },
  inputContainer: {

  }
});