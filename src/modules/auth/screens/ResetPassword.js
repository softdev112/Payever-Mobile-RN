import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { Navigator, Navigation } from 'react-native-navigation';
import {
  Button, Container, Error, Loader, NavBar, StyleSheet, TextInput, View,
} from 'ui';

import AuthStore from '../../../store/auth';

/* eslint-disable max-len */
const RESP_SUCCESS_MSG = 'Password was reset successfully. Checkout your email please.';
const RESP_ERROR_MSG = 'There were some errors while resetting password. Try it later please.';
const EMAIL_VALID_PATTERN = '^([a-z0-9_-]+\\.)*[a-z0-9_-]+@[a-z0-9_-]+(\\.[a-z0-9_-]+)*\\.[a-z]{2,6}$';

const errorMessage = 'It should be not empty valid email address for example someone@gmail.de';
/* eslint-enable max-len */

@inject('auth')
@observer
export default class ResetPassword extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    auth: AuthStore;
    navigator: Navigator;
  };

  state: {
    email: string;
  };

  $input: TextInput;

  constructor(props) {
    super(props);

    this.state = {
      email: '',
    };
  }

  componentDidMount() {
    // To avoid blinking while screen push animation going on
    if (this.$input) {
      setTimeout(() => this.$input.focus(), 500);
    }
  }

  async onResetPassword() {
    const { auth, navigator } = this.props;
    const { email } = this.state;

    if (email === '' || !email.match(EMAIL_VALID_PATTERN)) {
      auth.setError(errorMessage);
      return;
    }

    const isSuccess = await auth.resetPassword(email);
    const message = isSuccess ? RESP_SUCCESS_MSG : RESP_ERROR_MSG;

    Navigation.showInAppNotification({
      screen: 'core.PushNotification',
      title: '',
      passProps: {
        message,
      },
      navigatorStyle: {
        screenBackgroundColor: 'rgba(0,0,0,0.0)',
      },
    });

    navigator.pop({ animated: true });
  }

  render() {
    const { auth } = this.props;
    const { email } = this.state;

    return (
      <View style={styles.container}>
        <NavBar>
          <NavBar.Back title="Login" showTitle="always" />
          <NavBar.Title title="Reset Password" />
        </NavBar>
        <Loader isLoading={auth.isLoading}>
          <Container contentContainerStyle={styles.form} layout="small">
            <Error
              onShowEnd={() => auth.setError('')}
              duration={5000}
              message={auth.error}
            />
            <View>
              <TextInput
                ref={ref => this.$input = ref}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                label="Email address"
                onChangeText={text => this.setState({ email: text })}
                returnKeyType="next"
                value={email}
              />
            </View>
            <View style={styles.submitContainer}>
              <Button
                animated
                disabled={!email.match(EMAIL_VALID_PATTERN)}
                title="Resset Password"
                onPress={::this.onResetPassword}
              />
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