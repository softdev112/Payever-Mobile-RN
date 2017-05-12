import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { findNodeHandle, Keyboard, ScrollView } from 'react-native';
import { FlatTextInput, Loader, NavBar, StyleSheet, ValidationInformer, View,
} from 'ui';
import { Navigator } from 'react-native-navigation';

import AuthStore from '../../../store/auth';

const KEYBOARD_SCROLL_ADJUST = 80;
const FORM_ELEMENTS_COUNT = 5;

const EMAIL_VALID_PATTERN =
  '^([a-z0-9_-]+\\.)*[a-z0-9_-]+@[a-z0-9_-]+(\\.[a-z0-9_-]+)*\\.[a-z]{2,6}$';

/**
 * Form validation messages
 * 0 - First Name
 * 1 - Last Name
 * 2 - Email Address
 * 3 - Password
 * 4 - Confirm Password
 */
/* eslint-disable max-len */
const neutralMessages = [];
neutralMessages[0] = 'Enter your first name please';
neutralMessages[1] = 'Enter your last name please';
neutralMessages[2] = 'Enter your email address please';
neutralMessages[3] = 'Choose and enter your password';
neutralMessages[4] = 'Confirm your password please';

const errorMessages = [];
errorMessages[0] = 'It can\'t be empty. Enter your first name please';
errorMessages[1] = 'It can\'t be empty. Enter your last name please';
errorMessages[2] = 'It should be not empty valid email address for example someone@gmail.de';
errorMessages[3] = 'It can\'t be empty. Choose your password please';
errorMessages[4] = 'Should match with password. Try to enter it again';

const successMessages = [];
successMessages[0] = 'Your first name is:';
successMessages[1] = 'Your last name is:';
successMessages[2] = 'Your email is:';
successMessages[3] = 'Your password is:';
successMessages[4] = 'Your password is confirmed:';
/* eslint-enable max-len */

@inject('auth')
@observer
export default class RegisterWithEmail extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    auth: AuthStore;
    navigator: Navigator;
  };

  state: {
    formElementsData: Array<string>;
    inputNodeId: number;
    isSaveAttempt: boolean;
  };

  /**
   * Form validation messages
   * 0 - First Name
   * 1 - Last Name
   * 2 - Email Address
   * 3 - Password
   * 4 - Confirm Password
   */
  $formInputs: Array<FlatTextInput> = [];
  $scrollView: ScrollView;

  constructor(props) {
    super(props);

    this.state = {
      formElementsData: Array(FORM_ELEMENTS_COUNT).fill(''),
      inputNodeId: -1,
      isSaveAttempt: false,
    };
  }

  async onCreateNewUser() {
    const { auth, navigator } = this.props;
    const { formElementsData } = this.state;

    this.setState({ isSaveAttempt: true });

    const notValidIdx = formElementsData.findIndex(element => element === '');

    if ((notValidIdx === -1 || notValidIdx > 2)
      && !formElementsData[2].match(EMAIL_VALID_PATTERN)) {
      if (this.$formInputs[2]) {
        this.$formInputs[2].shakeElementAndSetFocus();
      }
      return;
    }

    if (notValidIdx !== -1) {
      if (this.$formInputs[notValidIdx]) {
        this.$formInputs[notValidIdx].shakeElementAndSetFocus();
      }
      return;
    }

    if (formElementsData[3] !== formElementsData[4]) {
      if (this.$formInputs[4]) {
        this.$formInputs[4].shakeElementAndSetFocus();
      }
      return;
    }

    const newUser = {
      email: formElementsData[2],
      plainPassword: {
        first: formElementsData[3],
        second: formElementsData[4],
      },
      billingAddress: {
        firstName: formElementsData[0],
        lastName: formElementsData[1],
      },
    };

    Keyboard.dismiss();
    await auth.registerNewUser(newUser);

    navigator.showLightBox({
      screen: 'auth.RegCompletedDialog',
      animated: true,
      style: {
        backgroundBlur: 'dark',
      },
    });
  }

  onInputInFocus({ nativeEvent }) {
    if (!nativeEvent || !nativeEvent.target) return;

    setTimeout(() => {
      const scrollResponder = this.$scrollView.getScrollResponder();
      scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
        findNodeHandle(nativeEvent.target),
        KEYBOARD_SCROLL_ADJUST,
        true
      );
    }, 50);

    this.setState({ inputNodeId: nativeEvent.target });
  }

  onInputBlur({ nativeEvent }) {
    if (!nativeEvent || !nativeEvent.target) return;

    setTimeout(() => {
      // Scroll back only if there are no inputs in focus
      if (this.state.inputNodeId === -1) {
        const scrollResponder = this.$scrollView.getScrollResponder();
        scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
          findNodeHandle(nativeEvent.target),
          0,
          true
        );
      }
    }, 50);

    this.setState({ inputNodeId: -1 });
  }

  onInputValueChange(index, value) {
    const { formElementsData } = this.state;
    formElementsData[index] = value;
    this.setState({ formElementsData, isSaveAttempt: false });
  }

  onSubmitEditing(index: number) {
    if (index < FORM_ELEMENTS_COUNT - 1 && this.$formInputs[index + 1]) {
      this.$formInputs[index + 1].setFocus();
    }
  }

  renderFieldValidator(fieldIndex: number, options: ValidationOptions = {}) {
    const { formElementsData, isSaveAttempt } = this.state;
    let isFieldValid = formElementsData[fieldIndex] !== '';

    if (options.isEmail) {
      isFieldValid = formElementsData[fieldIndex].match(EMAIL_VALID_PATTERN);
    }

    const matchIndex = options.shouldMatchField;
    if (matchIndex !== undefined) {
      isFieldValid = formElementsData[fieldIndex] !== '' &&
        formElementsData[fieldIndex] === formElementsData[matchIndex];
    }

    let validState = 'neutral';
    if (isSaveAttempt) {
      if (isFieldValid) {
        validState = 'success';
      } else {
        validState = 'error';
      }
    } else if (isFieldValid) {
      validState = 'success';
    }

    return (
      <ValidationInformer
        neutralMessage={neutralMessages[fieldIndex]}
        errorMessage={errorMessages[fieldIndex]}
        successMessage={successMessages[fieldIndex]}
        currentState={validState}
      />
    );
  }

  render() {
    const { auth } = this.props;
    const { formElementsData } = this.state;

    return (
      <View style={styles.container}>
        <NavBar popup>
          <NavBar.Back />
          <NavBar.Title showTitle="always" title="Add New User" />
          <NavBar.Button title="Sign Up" onPress={::this.onCreateNewUser} />
        </NavBar>
        <Loader isLoading={auth.isLoading}>
          <ScrollView
            scrollEnabled={false}
            contentContainerStyle={styles.content}
            ref={ref => this.$scrollView = ref}
          >
            <FlatTextInput
              inputStyle={styles.fieldsText}
              ref={ref => this.$formInputs[0] = ref}
              placeholder="First Name"
              onChangeText={text => this.onInputValueChange(0, text)}
              onFocus={::this.onInputInFocus}
              onBlur={::this.onInputBlur}
              value={formElementsData[0]}
              renderValidator={() => this.renderFieldValidator(0)}
              onSubmitEditing={() => this.onSubmitEditing(0)}
              returnKeyType="next"
            />

            <FlatTextInput
              inputStyle={styles.fieldsText}
              ref={ref => this.$formInputs[1] = ref}
              placeholder="Last Name"
              onChangeText={text => this.onInputValueChange(1, text)}
              onFocus={::this.onInputInFocus}
              onBlur={::this.onInputBlur}
              value={formElementsData[1]}
              renderValidator={() => this.renderFieldValidator(1)}
              onSubmitEditing={() => this.onSubmitEditing(1)}
              returnKeyType="next"
            />

            <FlatTextInput
              inputStyle={styles.fieldsText}
              ref={ref => this.$formInputs[2] = ref}
              placeholder="Email Address"
              onChangeText={text => this.onInputValueChange(2, text)}
              onFocus={::this.onInputInFocus}
              onBlur={::this.onInputBlur}
              value={formElementsData[2]}
              renderValidator={
                () => this.renderFieldValidator(2, { isEmail: true })
              }
              onSubmitEditing={() => this.onSubmitEditing(2)}
              returnKeyType="next"
            />

            <FlatTextInput
              inputStyle={styles.fieldsText}
              secureTextEntry
              ref={ref => this.$formInputs[3] = ref}
              placeholder="Password"
              onChangeText={text => this.onInputValueChange(3, text)}
              onFocus={::this.onInputInFocus}
              onBlur={::this.onInputBlur}
              renderValidator={() => this.renderFieldValidator(3)}
              onSubmitEditing={() => this.onSubmitEditing(3)}
              returnKeyType="next"
            />

            <FlatTextInput
              inputStyle={styles.fieldsText}
              secureTextEntry
              ref={ref => this.$formInputs[4] = ref}
              placeholder="Confirm Password"
              onChangeText={text => this.onInputValueChange(4, text)}
              onFocus={::this.onInputInFocus}
              onBlur={::this.onInputBlur}
              renderValidator={
                () => this.renderFieldValidator(4, { shouldMatchField: 3 })
              }
              onSubmitEditing={() => {}}
              returnKeyType="done"
            />
          </ScrollView>
        </Loader>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 12,
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },

  fieldsText: {
    fontSize: 18,
  },
});

type ValidationOptions = {
  isEmail: boolean;
  shouldMatchField: number;
};