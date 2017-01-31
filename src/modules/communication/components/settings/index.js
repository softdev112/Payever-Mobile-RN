import { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react/native';
import { TouchableOpacity } from 'react-native';
import { Container, StyleSheet, Text, View } from 'ui';
import type { Navigator } from 'react-native-navigation';

import type CommunicationStore
  from '../../../../store/CommunicationStore/index';
import settingsTempl from './templates/MainSettings';
import prefsFactory from './prefsFactory';
import CheckBoxPref from './CheckBoxPref';
import EnabledSliderPref from './EnabledSliderPref';

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

  onCheckBoxSwitch(propertyName) {
    const { userSettings } = this.props.communication.currentMsgrProfile;
    userSettings[propertyName] = !userSettings[propertyName];
    console.log(settingsTempl);
    prefsFactory('dddd', null);
  }

  onCancelPress() {
    this.context.navigator.pop();
  }

  render() {
    const { userSettings } = this.props.communication.currentMsgrProfile;
    return (
      <View style={styles.container}>
        <Container
          style={styles.settings}
          contentContainerStyle={styles.settingsContent}
        >
          <CheckBoxPref
            checked={userSettings.notificationDesktop}
            onSwitched={this.onCheckBoxSwitch.bind(this, 'notificationDesktop')}
            title="Desktop Notifications"
            icon="icon-mac-24"
          />
          <CheckBoxPref
            checked={userSettings.notificationPreview}
            onSwitched={this.onCheckBoxSwitch.bind(this, 'notificationPreview')}
            title="Message Preview"
            icon="icon-mail-2-16"
          />
          <EnabledSliderPref
            checked={userSettings.notificationSound}
            onSwitched={this.onCheckBoxSwitch.bind(this, 'notificationSound')}
            title="Message Preview"
            icon="icon-mail-2-16"
          />
        </Container>
        <View style={styles.buttons}>
          <TouchableOpacity onPress={::this.onCancelPress}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity onPress={() => console.log('save save save')}>
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
    justifyContent: 'center',
    alignItems: 'center',
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