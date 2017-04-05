import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { findNodeHandle, ScrollView } from 'react-native';
import { FlatPicker, FlatTextInput, NavBar, StyleSheet, View } from 'ui';
import { Navigator } from 'react-native-navigation';

import ProfilesStore from '../../../store/profiles';

const KEYBOARD_SCROLL_ADJUST = 80;
const FORM_ELEMENTS_COUNT = 7;

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
    };
  }

  async onCreateBusiness() {
    const { profiles, navigator } = this.props;
    const { formElementsData } = this.state;

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
    this.setState({ formElementsData });
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
          />
          <FlatPicker
            placeholder="Legal Form"
            placeholderStyle={styles.subFieldsText}
            ref={ref => this.$formInputs[1] = ref}
            onValueChange={value => this.onInputValueChange(1, value)}
            type="legal-forms"
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
          />
          <FlatPicker
            placeholder="Country"
            ref={ref => this.$formInputs[3] = ref}
            placeholderStyle={styles.subFieldsText}
            onValueChange={value => this.onInputValueChange(3, value)}
            type="countries"
          />
          <FlatTextInput
            inputStyle={styles.subFieldsText}
            ref={ref => this.$formInputs[4] = ref}
            placeholder="City"
            onChangeText={text => this.onInputValueChange(4, text)}
            onFocus={::this.onInputInFocus}
            onBlur={::this.onInputBlur}
            value={formElementsData[4]}
          />
          <FlatTextInput
            inputStyle={styles.subFieldsText}
            ref={ref => this.$formInputs[5] = ref}
            placeholder="Zip Code"
            keyboardType="numbers-and-punctuation"
            onChangeText={text => this.onInputValueChange(5, text)}
            onFocus={::this.onInputInFocus}
            onBlur={::this.onInputBlur}
            value={formElementsData[5]}
          />
          <FlatTextInput
            inputStyle={styles.subFieldsText}
            ref={ref => this.$formInputs[6] = ref}
            placeholder="Street"
            onChangeText={text => this.onInputValueChange(6, text)}
            onFocus={::this.onInputInFocus}
            onBlur={::this.onInputBlur}
            value={formElementsData[6]}
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
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },

  subFieldsText: {
    fontSize: 18,
  },
});