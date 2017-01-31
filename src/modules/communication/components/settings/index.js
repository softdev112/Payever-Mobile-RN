import { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react/native';
import { TouchableOpacity } from 'react-native';
import { Container, StyleSheet, Text, View } from 'ui';
import type { Navigator } from 'react-native-navigation';

import type CommunicationStore
  from '../../../../store/CommunicationStore/index';
import settingsTempl from './templates/MainSettings';
import prefsFactory from './prefsFactory';

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

  renderPrefs() {
    const { userSettings } = this.props.communication.currentMsgrProfile;

    return settingsTempl.map(pref => prefsFactory(pref, userSettings));
  }

  render() {
    return (
      <View style={styles.container}>
        <Container
          style={styles.settings}
          contentContainerStyle={styles.settingsContent}
        >
          {this.renderPrefs()}
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