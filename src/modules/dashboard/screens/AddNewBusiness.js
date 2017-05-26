import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { findNodeHandle, ScrollView, Text } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import DeviceInfo from 'react-native-device-info';
import * as Animatable from 'react-native-animatable';
import {
  Icon, FlatPicker, FlatTextInput, Loader, NavBar, StyleSheet,
  ValidationInformer, View,
} from 'ui';
import CountryPicker, {
  getAllCountries,
} from 'react-native-country-picker-modal';
import { log } from 'utils';
import ProfilesStore from '../../../store/profiles';

const KEYBOARD_SCROLL_ADJUST = 80;
const FORM_ELEMENTS_COUNT = 6;

/**
 * Form validation messages
 * 0 - Business Name
 * 1 - Legal Form
 * 2 - Phone Number
 * 3 - City
 * 4 - Zip Code
 * 5 - Address
 */
const neutralMessages = [];
neutralMessages[0] = 'Enter whatever name you like';
neutralMessages[1] = 'Select legal form of your business';
neutralMessages[2] = 'Enter your phone number';
neutralMessages[3] = 'Enter your city name';
neutralMessages[4] = 'Enter zip code of your area';
neutralMessages[5] = 'Enter street business address (street, building)';

const errorMessages = [];
errorMessages[0] = 'It can\'t be empty. Enter whatever name you like';
errorMessages[1] = 'You should select legal form of your company';
errorMessages[2] = 'It can\'t be empty. Enter phone number.';
errorMessages[3] = 'It can\'t be empty. Enter city name';
errorMessages[4] = 'It can\'t be empty. Enter zip code';
errorMessages[5] = 'It can\'t be empty. Enter street address';

const successMessages = [];
successMessages[0] = 'Your company name is:';
successMessages[1] = 'Company legal form is:';
successMessages[2] = 'Your phone is:';
successMessages[3] = 'Your city name is:';
successMessages[4] = 'Your zip code is:';
successMessages[5] = 'Your street address is:';

@inject('profiles')
@observer
export default class AddNewBusiness extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    profiles?: ProfilesStore;
  };

  state: {
    formElementsData: Array<string>;
    inputNodeId: number;
    isSaveAttempt: boolean;
    avatarChosen: boolean;
    logoFile: Object;
  };

  /**
   * Form Inputs indexes
   * 0 - Business Name
   * 1 - Legal Form
   * 2 - Phone Number
   * 3 - City
   * 4 - Zip Code
   * 5 - Address
   */
  $formInputs: Array<FlatTextInput | FlatPicker> = [];
  $scrollView: ScrollView;

  constructor(props) {
    super(props);

    const userLocaleCountryCode = DeviceInfo.getDeviceCountry();
    const userCountryData = getAllCountries()
      .filter((country) => country.cca2 === userLocaleCountryCode).pop();

    const currentCountry = userCountryData || {
      cca2: 'US',
      currency: 'USD',
      callingCode: '1',
      flag: undefined,
      name: {
        common: 'United States',
      },
    };

    this.state = {
      currentCountry,
      formElementsData: Array(FORM_ELEMENTS_COUNT).fill(''),
      inputNodeId: -1,
      isSaveAttempt: false,
      avatarChosen: false,
      logoFile: null,
    };
  }

  async onCreateBusiness() {
    const { profiles, navigator } = this.props;
    const { formElementsData, logoFile, currentCountry } = this.state;

    this.setState({ isSaveAttempt: true });
    const notValidIdx = formElementsData.findIndex(element => element === '');
    if (notValidIdx !== -1) {
      if (this.$formInputs[notValidIdx]) {
        this.$formInputs[notValidIdx].shakeElementAndSetFocus();
      }

      return;
    }

    let logoFileId = '';
    if (logoFile) {
      try {
        const logoResp = await profiles.uploadBusinessLogo(logoFile);
        if (logoResp && logoResp.respInfo.status === 200) {
          const data = await logoResp.json();
          logoFileId = data.details.id;
        }

        if (await RNFetchBlob.fs.exists(logoFile.uri)) {
          await RNFetchBlob.fs.unlink(logoFile.uri);
        }
      } catch (err) {
        log.error(err);
      }
    }

    const newBusiness = {
      companyName: formElementsData[0],
      legalForm: formElementsData[1],
      businessLogo: logoFileId,
      address: {
        phone: formElementsData[2],
        country: currentCountry.cca2,
        city: formElementsData[3],
        zipCode: formElementsData[4],
        street: formElementsData[5],
      },
    };

    try {
      await profiles.createNewBusiness(newBusiness);
      await profiles.load({ noCache: true });
    } catch (err) {
      log.error(err);
    }

    navigator.pop({ animated: true });
  }

  onInputInFocus({ nativeEvent }) {
    setTimeout(() => {
      const scrollResponder = this.$scrollView.getScrollResponder();
      scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
        findNodeHandle(nativeEvent.target),
        KEYBOARD_SCROLL_ADJUST,
        true
      );
    }, 200);

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
    }, 200);

    this.setState({ inputNodeId: -1 });
  }

  onInputValueChange(index, value) {
    const { formElementsData } = this.state;
    formElementsData[index] = value;
    this.setState({ formElementsData, isSaveAttempt: false });
  }

  onChooseAvatar() {
    const options = {
      title: 'Choose Avatar',
      maxHeight: 1024,
      maxWidth: 1024,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, async (response) => {
      if (!response || response.error || response.didCancel) {
        log.error(response.error);
        return;
      }

      if (!response.fileName) {
        response.fileName = response.uri.split('/').pop();
      }

      this.setState({ logoFile: response }, () => {
        if (this.$image) {
          this.$image.zoomIn(200);
        }
      });
    });
  }

  async onRemoveAvatar() {
    if (this.$image) {
      await this.$image.zoomOut(100);
    }

    this.setState({ logoFile: null }, () => this.$image.zoomIn(150));
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
    const { profiles } = this.props;
    const { logoFile, formElementsData, currentCountry } = this.state;

    return (
      <View style={styles.container}>
        <NavBar popup>
          <NavBar.Back />
          <NavBar.Title title="Add New Business" />
          <NavBar.Button title="Save" onPress={::this.onCreateBusiness} />
        </NavBar>
        <Loader isLoading={profiles.isLoading}>
          <ScrollView
            contentContainerStyle={styles.content}
            ref={ref => this.$scrollView = ref}
          >
            <View style={styles.avatarContainer}>
              <Animatable.View ref={r => this.$image = r}>
                <Icon
                  style={logoFile ? styles.avatarImage : styles.avatarIcon}
                  source={logoFile ? { uri: logoFile.uri } : 'icon-camera-64'}
                  onPress={::this.onChooseAvatar}
                />
              </Animatable.View>

              {logoFile && (
                <Icon
                  style={styles.removeIcon}
                  source="icon-minus-solid-16"
                  onPress={::this.onRemoveAvatar}
                  activeOpacity={0.7}
                />
              )}
            </View>

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

            <View style={styles.countryContainer}>
              <CountryPicker
                closeable
                cca2={currentCountry.cca2}
                onChange={value => this.setState({ currentCountry: value })}
              />
              <Text style={styles.countryText}>
                {currentCountry.name.common || currentCountry.name}
              </Text>
            </View>

            <FlatTextInput
              inputStyle={styles.subFieldsText}
              ref={ref => this.$formInputs[3] = ref}
              placeholder="City"
              onChangeText={text => this.onInputValueChange(3, text)}
              onFocus={::this.onInputInFocus}
              onBlur={::this.onInputBlur}
              value={formElementsData[3]}
              renderValidator={() => this.renderFieldValidator(3)}
            />

            <FlatTextInput
              inputStyle={styles.subFieldsText}
              ref={ref => this.$formInputs[4] = ref}
              placeholder="Zip Code"
              keyboardType="numeric"
              onChangeText={text => this.onInputValueChange(4, text)}
              onFocus={::this.onInputInFocus}
              onBlur={::this.onInputBlur}
              value={formElementsData[4]}
              renderValidator={() => this.renderFieldValidator(4)}
            />

            <FlatTextInput
              inputStyle={styles.subFieldsText}
              ref={ref => this.$formInputs[5] = ref}
              placeholder="Street"
              onChangeText={text => this.onInputValueChange(5, text)}
              onFocus={::this.onInputInFocus}
              onBlur={::this.onInputBlur}
              value={formElementsData[5]}
              renderValidator={() => this.renderFieldValidator(5)}
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

  countryContainer: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '$pe_color_light_gray_1',
    borderBottomWidth: 1,
  },

  countryText: {
    color: '$pe_color_gray',
    fontSize: 18,
    fontWeight: '200',
    alignSelf: 'center',
    marginLeft: 8,
  },

  subFieldsText: {
    fontSize: 18,
  },

  avatarContainer: {
    alignSelf: 'center',
    marginVertical: 16,
    height: 100,
  },

  avatarIcon: {
    color: '$pe_color_icon',
    fontSize: 80,
    alignSelf: 'center',
    marginTop: 10,
  },

  logoSizeText: {
    color: '$pe_color_icon',
  },

  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
  },

  removeIcon: {
    fontSize: 24,
    position: 'absolute',
    bottom: 0,
    right: 0,
    color: '$pe_color_blue',
    backgroundColor: 'transparent',
  },
});