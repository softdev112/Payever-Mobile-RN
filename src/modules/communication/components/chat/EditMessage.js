import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { BottomOverlay, Icon, StyleSheet, Text, View } from 'ui';
import CommunicationStore from '../../../../store/communication';

@inject('communication')
@observer
export default class EditMessage extends Component {
  props: {
    communication: CommunicationStore;
    style?: Object;
  };

  onRemoveEditedMessage() {
    const { communication } = this.props;
    communication.removeMessageForEdit();
  }

  render() {
    const { communication, style } = this.props;
    const { messageForEdit: message } = communication;

    return (
      <BottomOverlay
        style={style}
        onRemove={::this.onRemoveEditedMessage}
        endBottom={communication.ui.chatFooterHeight}
      >
        <View style={styles.editIconCont}>
          <Icon
            style={styles.editIcon}
            source="icon-edit-16"
          />
        </View>
        <View style={styles.editMsgData}>
          <Text
            style={styles.editMsgAuthor}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {message.senderName}
          </Text>
          <Text
            style={styles.editMsgText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {message.editBody}
          </Text>
        </View>
      </BottomOverlay>
    );
  }
}

const styles = StyleSheet.create({
  editIconCont: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  editIcon: {
    color: '$pe_color_gray_7d',
  },

  editMsgData: {
    flex: 1,
    alignSelf: 'stretch',
    borderLeftColor: '$pe_color_blue',
    borderLeftWidth: 1,
    paddingLeft: 4,
  },

  editMsgAuthor: {
    color: '$pe_color_blue',
    fontWeight: '400',
    marginBottom: 2,
  },

  editMsgText: {
    fontWeight: '400',
  },
});