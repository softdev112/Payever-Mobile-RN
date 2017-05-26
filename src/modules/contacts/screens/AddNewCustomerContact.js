import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { findNodeHandle, ScrollView, Switch } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import DeviceInfo from 'react-native-device-info';
import DateTimePicker from 'react-native-modal-datetime-picker';
import * as Animatable from 'react-native-animatable';
import CountryPicker, {
  getAllCountries,
} from 'react-native-country-picker-modal';
import moment from 'moment';

import { Icon, FlatTextInput, Loader, NavBar, StyleSheet, Text, TextButton,
  ValidationInformer, View,
} from 'ui';
import { log } from 'utils';
import ContactsStore from '../../../store/contacts';

const KEYBOARD_SCROLL_ADJUST = 80;
const EMAIL_VALID_PATTERN =
  '^([a-z0-9_-]+\\.)*[a-z0-9_-]+@[a-z0-9_-]+(\\.[a-z0-9_-]+)*\\.[a-z]{2,6}$';

@inject('contacts')
@observer
export default class AddNewCustomerContact extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    contacts: ContactsStore;
  };

  state: {
    formElementsData: Array<FormElementInfo>;
    inputNodeId: number;
    isSaveAttempt: boolean;
    avatarChosen: boolean;
    logoFile: Object;
    sendInvitation: boolean;
    isBirthdayPickerOn: boolean;
    birthday: Date;
  };

  /**
   * Form Inputs indexes
   * 0 - First name
   * 1 - Last name
   * 2 - Email
   * 3 - Phone Number
   * 4 - City
   * 5 - Zip Code
   * 6 - Address
   */
  $formInputs: Array<FlatTextInput> = [];
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
      formElementsData: formElements,
      inputNodeId: -1,
      isSaveAttempt: false,
      avatarChosen: false,
      logoFile: null,
      sendInvitation: true,
      isBirthdayPickerOn: false,
      birthday: null,
    };
  }

  async onCreateContact() {
    const { contacts, navigator } = this.props;
    const {
      birthday, formElementsData, logoFile, currentCountry, sendInvitation,
    } = this.state;

    if (contacts.isLoading) return;

    this.setState({ isSaveAttempt: true });
    const notValidIdx = formElementsData.findIndex(
      e => e.value === '' && e.needsValidation
    );
    if (notValidIdx !== -1) {
      if (this.$formInputs[notValidIdx]) {
        this.$formInputs[notValidIdx].shakeElementAndSetFocus();
      }

      return;
    }

    let logoFileId = '';
    if (logoFile) {
      try {
        const logoResp = await contacts.uploadContactLogo(logoFile);
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

    const userBirthday = birthday ? moment(birthday).format('DD.MM.Y') : '';
    const newContact = {
      sendInvitation,
      birthday: userBirthday,
      email: formElementsData[2].value,
      avatar: logoFileId,
      address: {
        firstName: formElementsData[0].value,
        lastName: formElementsData[1].value,
        phone: formElementsData[3].value,
        country: currentCountry.cca2,
        city: formElementsData[4].value,
        zipCode: formElementsData[5].value,
        street: formElementsData[6].value,
      },
    };

    try {
      await contacts.createNewContact(newContact);
      await contacts.loadAllContacts({ fromFirstPage: true });
    } catch (err) {
      log.error(err);
    }

    navigator.pop({ animated: false });
  }

  onSendInvitationChange(value) {
    this.setState({ sendInvitation: value });
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
    formElementsData[index].value = value;
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

  onBirthdayPicked(birthday) {
    if (!birthday) return;

    this.hideBirthdayPicker();
    this.setState({ birthday });
  }

  showBirthdayPicker() {
    this.setState({ isBirthdayPickerOn: true });
  }

  hideBirthdayPicker() {
    this.setState({ isBirthdayPickerOn: false });
  }

  renderFieldValidator(fieldIndex: number) {
    const { formElementsData, isSaveAttempt } = this.state;
    let isFieldValid = formElementsData[fieldIndex].value !== '';

    if (formElementsData[fieldIndex].isEmail) {
      isFieldValid =
        formElementsData[fieldIndex].value.match(EMAIL_VALID_PATTERN);
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
        neutralMessage={formElementsData[fieldIndex].neutralMessage}
        errorMessage={formElementsData[fieldIndex].errorMessage}
        successMessage={formElementsData[fieldIndex].successMessage}
        currentState={validState}
      />
    );
  }

  render() {
    const { contacts } = this.props;
    const {
      birthday, logoFile, formElementsData, currentCountry, sendInvitation,
    } = this.state;

    const contactBirth = birthday || new Date();

    return (
      <View style={styles.container}>
        <NavBar popup>
          <NavBar.Back />
          <NavBar.Title showTitle="always" title="Add New Contact" />
          <NavBar.Button
            title="Save"
            onPress={::this.onCreateContact}
            disabled={contacts.isLoading}
          />
        </NavBar>
        <Loader isLoading={contacts.isLoading}>
          <ScrollView
            contentContainerStyle={styles.content}
            ref={ref => this.$scrollView = ref}
            keyboardShouldPersistTaps="always"
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

            <Text style={styles.customerInfoText}>
              Customer Info:
            </Text>

            <FlatTextInput
              inputStyle={styles.fieldsText}
              ref={ref => this.$formInputs[0] = ref}
              placeholder="First name"
              onChangeText={text => this.onInputValueChange(0, text)}
              onFocus={::this.onInputInFocus}
              onBlur={::this.onInputBlur}
              value={formElementsData[0].value}
              renderValidator={() => this.renderFieldValidator(0)}
            />

            <FlatTextInput
              inputStyle={styles.fieldsText}
              ref={ref => this.$formInputs[1] = ref}
              placeholder="Last name"
              onChangeText={text => this.onInputValueChange(1, text)}
              onFocus={::this.onInputInFocus}
              onBlur={::this.onInputBlur}
              value={formElementsData[1].value}
              renderValidator={() => this.renderFieldValidator(1)}
            />

            <FlatTextInput
              inputStyle={styles.fieldsText}
              ref={ref => this.$formInputs[2] = ref}
              placeholder="Email Address"
              onChangeText={text => this.onInputValueChange(2, text)}
              onFocus={::this.onInputInFocus}
              onBlur={::this.onInputBlur}
              value={formElementsData[2].value}
              renderValidator={
                () => this.renderFieldValidator(2, { isEmail: true })
              }
              onSubmitEditing={() => this.onSubmitEditing(2)}
              returnKeyType="next"
            />

            <View style={styles.birthdayContainer}>
              <TextButton
                style={styles.birthdayBtn}
                titleStyle={styles.birthdayText}
                title={`Birthday:  ${moment(contactBirth).format('DD/MM/Y')}`}
                onPress={::this.showBirthdayPicker}
              />
            </View>

            <FlatTextInput
              inputStyle={styles.fieldsText}
              ref={ref => this.$formInputs[3] = ref}
              placeholder="Phone"
              keyboardType="phone-pad"
              onChangeText={text => this.onInputValueChange(3, text)}
              onFocus={::this.onInputInFocus}
              onBlur={::this.onInputBlur}
              value={formElementsData[3].value}
            />

            <View style={styles.countryContainer}>
              <CountryPicker
                closeable
                cca2={currentCountry.cca2}
                onChange={value => this.setState({ currentCountry: value })}
              />
              <Text style={styles.countryName}>
                {currentCountry.name.common || currentCountry.name}
              </Text>
            </View>

            <FlatTextInput
              inputStyle={styles.fieldsText}
              ref={ref => this.$formInputs[4] = ref}
              placeholder="City"
              onChangeText={text => this.onInputValueChange(4, text)}
              onFocus={::this.onInputInFocus}
              onBlur={::this.onInputBlur}
              value={formElementsData[4].value}
            />

            <FlatTextInput
              inputStyle={styles.fieldsText}
              ref={ref => this.$formInputs[5] = ref}
              placeholder="Zip Code"
              keyboardType="numeric"
              onChangeText={text => this.onInputValueChange(5, text)}
              onFocus={::this.onInputInFocus}
              onBlur={::this.onInputBlur}
              value={formElementsData[5].value}
            />

            <FlatTextInput
              inputStyle={styles.fieldsText}
              ref={ref => this.$formInputs[6] = ref}
              placeholder="Street"
              onChangeText={text => this.onInputValueChange(6, text)}
              onFocus={::this.onInputInFocus}
              onBlur={::this.onInputBlur}
              value={formElementsData[6].value}
            />

            <View style={styles.sendInvitation}>
              <Switch
                value={sendInvitation}
                onValueChange={::this.onSendInvitationChange}
              />
              <Text style={styles.sendInvitationText}>Send Invitation</Text>
            </View>
          </ScrollView>
        </Loader>

        <DateTimePicker
          mode="date"
          isVisible={this.state.isBirthdayPickerOn}
          onConfirm={::this.onBirthdayPicked}
          onCancel={::this.hideBirthdayPicker}
          titleIOS="Choose your birthday"
          timeZoneOffsetInMinutes={0}
        />
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
    paddingBottom: 16,
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },

  birthdayContainer: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '$pe_color_light_gray_1',
    borderBottomWidth: 1,
  },

  birthdayBtn: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  birthdayText: {
    color: '$pe_color_gray',
    fontSize: 18,
    fontWeight: '200',
    alignSelf: 'center',
  },

  countryContainer: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '$pe_color_light_gray_1',
    borderBottomWidth: 1,
  },

  customerInfoText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '400',
  },

  countryName: {
    color: '$pe_color_gray',
    fontSize: 18,
    fontWeight: '200',
    alignSelf: 'center',
    marginLeft: 8,
  },

  fieldsText: {
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

  sendInvitation: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 55,
  },

  sendInvitationText: {
    color: '$pe_color_gray',
    fontSize: 18,
    fontWeight: '200',
    marginLeft: 10,
  },
});

/**
 * Form validation messages
 * 0 - Customer First Name
 * 1 - Customer Last Name
 * 2 - Email
 * 3 - Phone Number
 * 4 - City
 * 5 - Zip Code
 * 6 - Address
 */
/* eslint-disable max-len */
const formElements = [
  {
    value: '',
    needsValidation: true,
    neutralMessage: 'Enter customer first name',
    errorMessage: 'It can\'t be empty. Enter customer first name',
    successMessage: 'Customer first name is:',
  },
  {
    value: '',
    needsValidation: false,
    neutralMessage: 'Enter customer last name',
    errorMessage: 'It can\'t be empty. Enter customer last name',
    successMessage: 'Customer last name is:',
  },
  {
    value: '',
    needsValidation: true,
    neutralMessage: 'Enter valid email',
    errorMessage: 'It should be not empty valid email address for example someone@gmail.de',
    successMessage: 'Customer email is:',
    isEmail: true,
  },
  {
    value: '',
    needsValidation: false,
    neutralMessage: 'Enter customer phone number',
    errorMessage: 'It can\'t be empty. Enter valid phone number.',
    successMessage: 'Customer phone is:',
  },
  {
    value: '',
    needsValidation: false,
    neutralMessages: 'Enter customer city name',
    errorMessages: 'It can\'t be empty. Enter customer city name',
    successMessages: 'Customer city name is:',
  },
  {
    value: '',
    needsValidation: false,
    neutralMessage: 'Enter zip code of customer area',
    errorMessage: 'It can\'t be empty. Enter customer zip code',
    successMessage: 'Customer zip code is:',
  },
  {
    value: '',
    needsValidation: false,
    neutralMessage: 'Enter street business address (street, building)',
    errorMessage: 'It can\'t be empty. Enter customer street address',
    successMessage: 'Customer street address is:',
  },
];
/* eslint-enable max-len */

type FormElementInfo = {
  value: string;
  needsValidation: boolean;
  neutralMessage: string;
  errorMessage: string;
  successMessage: string;
  isEmail?: ?boolean;
};