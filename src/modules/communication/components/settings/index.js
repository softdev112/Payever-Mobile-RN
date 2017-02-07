import { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react/native';
import { NavBar, StyleSheet, View } from 'ui';
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

  static childContextTypes = {
    settings: PropTypes.object.isRequired,
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

  getChildContext() {
    const { userSettings } = this.props.communication.messengerInfo;

    return {
      settings: userSettings,
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <NavBar popup>
          <NavBar.Back style={styles.closeBtn} />
          <NavBar.Title icon="icon-settings-24" title="Settings" />
          <NavBar.Button
            style={styles.saveBtnText}
            title="Save"
            onPress={::this.onSavePress}
          />
        </NavBar>

        <View style={styles.settings}>
          <CheckBoxPref
            prefName="notificationDesktop"
            title="Desktop Notifications"
            icon="icon-mac-24"
          />
          <CheckBoxPref
            prefName="notificationPreview"
            title="Message Preview"
            icon="icon-mail-2-16"
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
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  settings: {
    justifyContent: 'flex-start',
    marginTop: 20,
    alignSelf: 'stretch',
    paddingHorizontal: 25,
  },

  settingsContent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  closeBtn: {
    color: '$pe_color_light_gray_1',
  },

  saveBtnText: {
    color: '$pe_color_blue',
  },
});