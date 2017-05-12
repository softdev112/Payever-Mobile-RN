import { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react/native';
import type { Navigator } from 'react-native-navigation';
import { Icon, TextButton, StyleSheet, Text, View } from 'ui';

import { showScreen } from '../../../common/Navigation';
import type AuthStore from '../../../store/auth';

/* eslint-disable max-len */
const successMessage = `  New user was successfully created. Confirmation email was sent to your address.
                          Check out it please and confirm it. After that you will be able to login with
                          your email and password. Thanks and welcome to Payever!`.replace(/\s+/g, ' ');

const errorMessage = 'Sorry. There are some errors occurred. Try again later please!';
/* eslint-enable max-len */

@inject('auth')
@observer
export default class RegCompletedDialog extends Component {
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
  };

  props: {
    auth: AuthStore;
  };

  context: {
    navigator: Navigator;
  };

  onCLoseDialog() {
    const { navigator } = this.context;
    navigator.dismissLightBox({ animated: true });
    showScreen('core.LaunchScreen');
  }

  render() {
    const { auth } = this.props;
    const isError = auth.error !== '';

    const iconStyle = [styles.icon];
    if (isError) {
      iconStyle.push(styles.errorIcon);
    }

    return (
      <View style={styles.container}>
        <Icon
          style={iconStyle}
          source={isError ? 'icon-alert-32' : 'icon-checked-64'}
        />

        { isError ? (
          <View>
            <Text style={styles.message}>{errorMessage}</Text>
            <Text style={styles.message}>{auth.error}</Text>
          </View>
        ) : (
          <Text style={styles.message}>{successMessage}</Text>
        )}

        <TextButton
          style={styles.btn}
          title="OK"
          onPress={::this.onCLoseDialog}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 15,
    backgroundColor: '#FFF',
    alignItems: 'center',
    height: 300,
    width: 250,
    paddingHorizontal: 15,
    paddingTop: 15,
  },

  icon: {
    fontSize: 28,
    color: '$pe_color_green',
    marginBottom: 10,
  },

  errorIcon: {
    color: '$pe_color_red',
  },

  message: {
    fontSize: 15,
    fontFamily: '$font_family',
    textAlign: 'justify',
  },

  btn: {
    position: 'absolute',
    bottom: 20,
    right: 40,
  },
});