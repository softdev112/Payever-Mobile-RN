import { Component } from 'react';
import { ScrollView } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import { NavBar, StyleSheet, View } from 'ui';
import type { Navigator } from 'react-native-navigation';
import { log } from 'utils';

import type CommunicationStore from '../../../store/CommunicationStore';
import CheckBoxPref from '../components/settings/CheckBoxPref';
import SwitchableSliderPref from '../components/settings/SwitchableSliderPref';
import SwitchableTimePeriodPref
  from '../components/settings/SwitchableTimePeriodPref';

@inject('communication')
@observer
export default class Settings extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    communication: CommunicationStore;
    navigator: Navigator;
  };

  onSavePress() {
    this.props.communication.saveUserSettings().catch(log.error);
    this.props.navigator.pop();
  }

  render() {
    const { userSettings } = this.props.communication.messengerInfo;

    return (
      <View style={styles.container}>
        <NavBar popup>
          <NavBar.Back />
          <NavBar.Button title="Save" onPress={::this.onSavePress} />
        </NavBar>
        <ScrollView contentContainerStyle={styles.settings}>
          <CheckBoxPref
            prefName="notificationDesktop"
            title="Desktop Notifications"
            icon="fa-desktop"
            settings={userSettings}
          />
          <CheckBoxPref
            prefName="notificationPreview"
            title="Message Preview"
            icon="fa-envelope-o"
            settings={userSettings}
          />
          <SwitchableSliderPref
            switchPrefName="notificationSound"
            switchTitle="Sound Notifications"
            switchIcon="fa-volume-off"
            sliderPrefName="notificationVolume"
            sliderMin={0}
            sliderMax={100}
            sliderTitle="Sound Volume"
            sliderIcon="fa-volume-up"
            settings={userSettings}
          />
          <SwitchableTimePeriodPref
            switchPrefName="silentPeriodState"
            switchTitle="Do not disturb period"
            switchIcon="fa-exclamation-triangle"
            periodTitle={'Select time period during which desktop and sound' +
              'notifications will not be shown.'}
            periodFromPrefName="silentPeriodStart"
            periodToPrefName="silentPeriodStop"
            settings={userSettings}
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

  settings: {
    paddingHorizontal: 25,
    paddingVertical: 15,
  },
});