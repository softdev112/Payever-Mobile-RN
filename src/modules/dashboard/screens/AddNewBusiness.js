import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { findNodeHandle, ScrollView } from 'react-native';
import {
  FlatPicker, FlatTextInput, NavBar, StyleSheet, ValidationInformer, View,
} from 'ui';
import { Navigator } from 'react-native-navigation';

import ProfilesStore from '../../../store/profiles';

const KEYBOARD_SCROLL_ADJUST = 80;
const FORM_ELEMENTS_COUNT = 7;

/**
 * Form validation messages
 * 0 - Business Name
 * 1 - Legal Form
 * 2 - Phone Number
 * 3 - Country
 * 4 - City
 * 5 - Zip Code
 * 6 - Address
 */
const neutralMessages = [];
neutralMessages[0] = 'Enter whatever name you like';
neutralMessages[1] = 'Select legal form of your business';
neutralMessages[2] = 'Enter your phone number';
neutralMessages[3] = 'Select your country';
neutralMessages[4] = 'Enter your city name';
neutralMessages[5] = 'Enter zip code of your area';
neutralMessages[6] = 'Enter street business address (street, building)';

const errorMessages = [];
errorMessages[0] = 'It can\'t be empty. Enter whatever name you like';
errorMessages[1] = 'You should select legal form of your company';
errorMessages[2] = 'It can\'t be empty. Enter phone number.';
errorMessages[3] = 'You should select your county name';
errorMessages[4] = 'It can\'t be empty. Enter city name';
errorMessages[5] = 'It can\'t be empty. Enter zip code';
errorMessages[6] = 'It can\'t be empty. Enter street address';

const successMessages = [];
successMessages[0] = 'Your company name is:';
successMessages[1] = 'Company legal form is:';
successMessages[2] = 'Your phone is:';
successMessages[3] = 'Your country is:';
successMessages[4] = 'Your city name is:';
successMessages[5] = 'Your zip code is:';
successMessages[6] = 'Your street address is:';

@inject('profiles')
@observer
export default class AddNewBusiness extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    profiles?: ProfilesStore;
    navigator: Navigator;
  };

  state: {
    formElementsData: Array<string>;
    inputNodeId: number;
    isSaveAttempt: boolean;
  };

  /**
   * Form Inputs indexes
   * 0 - Business Name
   * 1 - Legal Form
   * 2 - Phone Number
   * 3 - Country
   * 4 - City
   * 5 - Zip Code
   * 6 - Address
   */
  $formInputs: Array<FlatTextInput | FlatPicker> = [];
  $scrollView: ScrollView;

  constructor(props) {
    super(props);

    this.state = {
      formElementsData: Array(FORM_ELEMENTS_COUNT).fill(''),
      inputNodeId: -1,
      isSaveAttempt: false,
    };
  }

  async onCreateBusiness() {
    const { profiles, navigator } = this.props;
    const { formElementsData } = this.state;

    this.setState({ isSaveAttempt: true });

    const notValidIdx = formElementsData.findIndex(element => element === '');
    if (notValidIdx !== -1) {
      if (this.$formInputs[notValidIdx]) {
        this.$formInputs[notValidIdx].shakeElementAndSetFocus();
      }
      return;
    }

    const newBusiness = {
      companyName: formElementsData[0],
      legalForm: formElementsData[1],
      businessLogo: '',
      address: {
        phone: formElementsData[2],
        country: formElementsData[3],
        city: formElementsData[4],
        zipCode: formElementsData[5],
        street: formElementsData[6],
      },
    };

    navigator.pop({ animated: true });
    await profiles.createNewBusiness(newBusiness);
    await profiles.load({ noCache: true });
  }

  onInputInFocus({ nativeEvent }) {
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

  renderFieldValidator(fieldIndex: number) {
    const { formElementsData, isSaveAttempt } = this.state;
    const isFieldValid = formElementsData[fieldIndex] !== '';

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
    const { formElementsData } = this.state;

    return (
      <View style={styles.container}>
        <NavBar popup>
          <NavBar.Back />
          <NavBar.Title title="Add New Business" />
          <NavBar.Button title="Save" onPress={::this.onCreateBusiness} />
        </NavBar>
        <ScrollView
          scrollEnabled={false}
          contentContainerStyle={styles.content}
          ref={ref => this.$scrollView = ref}
        >
          <FlatTextInput
            ref={ref => this.$formInputs[0] = ref}
            placeholder="Company Name"
            onChangeText={text => this.onInputValueChange(0, text)}
            onFocus={::this.onInputInFocus}
            onBlur={::this.onInputBlur}
            value={formElementsData[0]}
            renderValidator={() => this.renderFieldValidator(0)}
          />
          <FlatPicker
            placeholder="Legal Form"
            placeholderStyle={styles.subFieldsText}
            ref={ref => this.$formInputs[1] = ref}
            onValueChange={value => this.onInputValueChange(1, value)}
            type="legal-forms"
            renderValidator={() => this.renderFieldValidator(1)}
          />
          <FlatTextInput
            inputStyle={styles.subFieldsText}
            ref={ref => this.$formInputs[2] = ref}
            placeholder="Phone"
            keyboardType="phone-pad"
            onChangeText={text => this.onInputValueChange(2, text)}
            onFocus={::this.onInputInFocus}
            onBlur={::this.onInputBlur}
            value={formElementsData[2]}
            renderValidator={() => this.renderFieldValidator(2)}
          />
          <FlatPicker
            placeholder="Country"
            ref={ref => this.$formInputs[3] = ref}
            placeholderStyle={styles.subFieldsText}
            onValueChange={value => this.onInputValueChange(3, value)}
            type="countries"
            renderValidator={() => this.renderFieldValidator(3)}
          />
          <FlatTextInput
            inputStyle={styles.subFieldsText}
            ref={ref => this.$formInputs[4] = ref}
            placeholder="City"
            onChangeText={text => this.onInputValueChange(4, text)}
            onFocus={::this.onInputInFocus}
            onBlur={::this.onInputBlur}
            value={formElementsData[4]}
            renderValidator={() => this.renderFieldValidator(4)}
          />
          <FlatTextInput
            inputStyle={styles.subFieldsText}
            ref={ref => this.$formInputs[5] = ref}
            placeholder="Zip Code"
            keyboardType="numeric"
            onChangeText={text => this.onInputValueChange(5, text)}
            onFocus={::this.onInputInFocus}
            onBlur={::this.onInputBlur}
            value={formElementsData[5]}
            renderValidator={() => this.renderFieldValidator(5)}
          />
          <FlatTextInput
            inputStyle={styles.subFieldsText}
            ref={ref => this.$formInputs[6] = ref}
            placeholder="Street"
            onChangeText={text => this.onInputValueChange(6, text)}
            onFocus={::this.onInputInFocus}
            onBlur={::this.onInputBlur}
            value={formElementsData[6]}
            renderValidator={() => this.renderFieldValidator(6)}
          />
        </ScrollView>
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

  subFieldsText: {
    fontSize: 18,
  },
});