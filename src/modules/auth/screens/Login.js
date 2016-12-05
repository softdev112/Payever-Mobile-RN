import { Component } from 'react';
import { connect } from 'react-redux';
import {
  Button, Dimensions, StyleSheet, Text, TextInput, View
} from 'react-native';

import { signIn } from '../actions/auth';
import Loader from '../../core/components/Loader';

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
        <View>
          <View>
            <Text></Text>
            <TextInput
              style={{height: 40, borderColor: 'gray', borderWidth: 1}}
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
            <Button title="Sign In" onPress={::this.onSignIn} />
          </View>
          <Loader />
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