import { Component, PropTypes } from 'react';
import { Alert } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import type { Navigator } from 'react-native-navigation';
import * as Animatable from 'react-native-animatable';
import { Icon, StyleSheet } from 'ui';

import CommunicationStore from '../../../../store/communication';

@inject('communication')
@observer
export default class SelectionFooter extends Component {
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
  };

  context: {
    navigator: Navigator;
  };

  props: {
    communication?: CommunicationStore;
  };

  onForwardMessages() {
    this.props.communication.setSelectMode(false);
    this.context.navigator.push({
      screen: 'communication.SelectContact',
      animated: true,
    });
  }

  onDeleteMessages() {
    const { communication } = this.props;
    const messagesCount = communication.selectedMessages.length;

    if (messagesCount === 0) return;

    let warningText = `Delete selected ${messagesCount}`;
    if (messagesCount === 1) {
      warningText += ' message?';
    } else {
      warningText += ' messages?';
    }

    Alert.alert(
      'Attention!',
      warningText,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            communication.deleteSelectedMessages();
            communication.setSelectMode(false);
          },
        },
      ],
      { cancelable: false }
    );
  }

  render() {
    return (
      <Animatable.View
        ref={c => this.$container = c}
        style={styles.container}
        animation="slideInUp"
        duration={300}
      >
        <Icon
          style={styles.icon}
          onPress={::this.onDeleteMessages}
          source="fa-trash-o"
          touchStyle={styles.icon_action_touch}
        />
        <Icon
          style={styles.icon}
          hitSlop={14}
          onPress={::this.onForwardMessages}
          source="fa-share"
          touchStyle={styles.icon_touch}
        />
      </Animatable.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    borderTopColor: '$pe_color_light_gray_1',
    borderTopWidth: 1,
    borderBottomColor: '$pe_color_light_gray_1',
    borderBottomWidth: 1,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-between',
    zIndex: 50,
  },

  icon: {
    color: '$pe_color_icon',
    fontSize: 24,
  },

  icon_action_touch: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },

  icon_touch: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },

  input: {
    flex: 1,
    paddingHorizontal: 22,
  },
});