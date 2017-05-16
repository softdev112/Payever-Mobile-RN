import { Component } from 'react';
import { ScrollView } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import { NavBar, StyleSheet, View } from 'ui';
import type { Navigator } from 'react-native-navigation';

import type CommunicationStore from '../../../store/communication';
import type UserSettings
  from '../../../store/communication/models/UserSettings';
import SwitchableSliderPref from '../components/settings/SwitchableSliderPref';
import SwitchableTimePeriodPref
  from '../components/settings/SwitchableTimePeriodPref';

@inject('communication')
@observer
export default class GeneralSettings extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    communication: CommunicationStore;
    navigator: Navigator;
  };

  state: {
    settings: UserSettings;
  };

  constructor(props) {
    super(props);

    // Make a local copy off settings to the state
    const { userSettings } = this.props.communication.messengerInfo;
    this.state = {
      settings: Object.assign({}, userSettings),
    };
  }

  onSavePress() {
    const { settings } = this.state;
    this.props.communication.saveUserSettings(settings);
    this.props.navigator.pop();
  }

  render() {
    const { settings } = this.state;

    return (
      <View style={styles.container}>
        <NavBar popup>
          <NavBar.Back />
          <NavBar.Title title="User Settings" />
          <NavBar.Button title="Save" onPress={::this.onSavePress} />
        </NavBar>
        <ScrollView contentContainerStyle={styles.settings}>
          <SwitchableSliderPref
            settings={settings}
            switchPrefName="notificationSound"
            switchTitle="Sound Notifications"
            switchIcon="fa-volume-off"
            sliderPrefName="notificationVolume"
            sliderMin={0}
            sliderMax={100}
            sliderTitle="Sound Volume"
            sliderIcon="fa-volume-up"
          />
          <SwitchableTimePeriodPref
            settings={settings}
            switchPrefName="silentPeriodState"
            switchTitle="Do not disturb period"
            switchIcon="fa-exclamation-triangle"
            periodTitle={'Select time period during which desktop and sound' +
              'notifications will not be shown.'}
            periodFromPrefName="silentPeriodStart"
            periodToPrefName="silentPeriodStop"
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