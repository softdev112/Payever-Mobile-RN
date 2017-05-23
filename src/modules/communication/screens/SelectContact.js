import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import type { Navigator } from 'react-native-navigation';
import { NavBar, SegmentedControl, StyleSheet, View } from 'ui';

import Contacts from '../components/contacts';
import CommunicationStore from '../../../store/communication';

@inject('communication')
@observer
export default class SelectContact extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    communication: CommunicationStore;
    navigator: Navigator;
  };

  componentDidMount() {
    const { communication } = this.props;
    communication.ui.setForwardMode(true);
  }

  componentWillUnmount() {
    const { communication } = this.props;
    communication.ui.setForwardMode(false);
  }

  onCancelFroward() {
    const { communication, navigator } = this.props;
    communication.ui.setForwardMode(false);
    communication.ui.setSelectMode(true);
    navigator.pop({ animated: true });
  }

  onContactsSwitch() {
  }

  render() {
    return (
      <View style={styles.container}>
        <NavBar>
          <NavBar.Button
            title="Cancel"
            align="left"
            onPress={::this.onCancelFroward}
          />
          <NavBar.Title showTitle="always" title="Forward" />
        </NavBar>
        <View style={styles.content}>
          <Contacts
            style={styles.content}
            pickUpMode
            phoneView
          />
          <View style={styles.footer}>
            <SegmentedControl
              style={styles.segmentedControl}
              values={['Conversations', 'Contacts']}
              selectedIndex={0}
              onValueChange={::this.onContactsSwitch}
            />
          </View>
        </View>
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
  },

  footer: {
    borderTopColor: '$pe_color_light_gray_1',
    borderTopWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },

  segmentedControl: {
    height: 28,
    width: 200,
  },
});