import { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react/native';
import { TouchableOpacity } from 'react-native';
import { Container, StyleSheet, Text, View } from 'ui';
import type { Navigator } from 'react-native-navigation';

import type CommunicationStore
  from '../../../../store/CommunicationStore/index';
import CheckBoxPref from './CheckBoxPref';
import SwitchableSliderPref from './SwitchableSliderPref';
import SwitchableTimePeriodPref from './SwitchableTimePeriodPref';

@inject('communication')
@observer
export default class Settings extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  static contextTypes = {
    navigator: PropTypes.object.isRequired,
  };

  context: {
    navigator: Navigator;
  };

  props: {
    communication: CommunicationStore;
  };

  onCancelPress() {
    this.context.navigator.pop();
  }

  onSavePress() {
    this.props.communication.saveUserSettings();
    this.context.navigator.pop();
  }

  render() {
    const { userSettings } = this.props.communication.messengerInfo;

    return (
      <View style={styles.container}>
        <Container
          style={styles.settings}
          contentContainerStyle={styles.settingsContent}
        >
          <CheckBoxPref
            prefName="notificationDesktop"
            title="Desktop Notifications"
            icon="icon-mac-24"
            settings={userSettings}
          />
          <CheckBoxPref
            prefName="notificationPreview"
            title="Message Preview"
            icon="icon-mail-2-16"
            settings={userSettings}
          />
          <SwitchableSliderPref
            switchPrefName="notificationSound"
            switchTitle="Sound Notifications"
            switchIcon="icon-check2-16"
            sliderPrefName="notificationVolume"
            sliderMin={0}
            sliderMax={100}
            sliderTitle="Sound Volume"
            sliderIcon="icon-check2-16"
            settings={userSettings}
          />
          <SwitchableTimePeriodPref
            switchPrefName="silentPeriodState"
            switchTitle="Do not disturb period"
            switchIcon="icon-check2-16"
            periodTitle={'Select time period during which desktop and sound' +
              'notifications will not be shown.'}
            periodIcon="icon-check2-16"
            periodFromPrefName="silentPeriodStart"
            periodToPrefName="silentPeriodStop"
            settings={userSettings}
          />
        </Container>
        <View style={styles.buttons}>
          <TouchableOpacity onPress={::this.onCancelPress}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity onPress={::this.onSavePress}>
            <Text style={styles.saveBtnText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: '22%',
  },

  settings: {
    alignSelf: 'stretch',
  },

  settingsContent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  buttons: {
    flexDirection: 'row',
    width: '40%',
    padding: 10,
    justifyContent: 'space-between',
  },

  cancelBtnText: {
    fontSize: 18,
  },

  saveBtnText: {
    fontSize: 18,
    color: '$pe_color_blue',
  },

  divider: {
    alignSelf: 'stretch',
    backgroundColor: '$pe_color_light_gray_1',
    width: 1,
  },
});