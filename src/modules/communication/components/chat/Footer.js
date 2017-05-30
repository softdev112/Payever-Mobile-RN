import { Component, PropTypes } from 'react';
import { Keyboard, TextInput } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import type { Navigator } from 'react-native-navigation';
import * as Animatable from 'react-native-animatable';
import ImagePicker from 'react-native-image-picker';
import { Icon, StyleSheet } from 'ui';
import { log } from 'utils';

import CommunicationStore from '../../../../store/communication';
import type { ConversationType } from
  '../../../../store/communication/models/Conversation';

@inject('communication')
@observer
export default class Footer extends Component {
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
  };

  context: {
    navigator: Navigator;
  };

  $input: TextInput;

  props: {
    communication?: CommunicationStore;
    conversationId: number;
    textValue?: string;
    conversationType: ConversationType;
    onInputInFocus?: () => void;
  };

  state: {
    text: string;
  };

  constructor(props) {
    super(props);

    this.state = {
      text: props.textValue || '',
    };

    this.onType = ::this.onType;
  }

  componentWillReceiveProps(newProps) {
    if (newProps.textValue !== this.props.textValue) {
      this.setState({ text: newProps.textValue });
    }
  }

  onActionPress() {
    const { conversationId, communication } = this.props;
    const options = {
      title: 'Attachments',
      customButtons: [{
        name: 'offer',
        title: 'Send New Offer',
      }],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (!response || response.error || response.didCancel) {
        log.error(response.error);
        return;
      }

      if (response.customButton) {
        this.context.navigator.push({
          screen: 'marketing.CreateOffer',
          passProps: { conversationId },
        });
        return;
      }

      if (!response.fileName) {
        response.fileName = response.uri.split('/').pop();
      }


      communication.sendMessageWithMedias(
        this.state.text,
        {
          data: response.data,
          fileName: response.fileName,
          uri: response.uri,
          width: response.width,
          height: response.height,
        },
        conversationId
      );

      this.setState({ text: '' });
    });
  }

  onFocus() {
    const { onInputInFocus } = this.props;

    if (onInputInFocus) {
      onInputInFocus();
    }
  }

  onSend() {
    const { text } = this.state;
    const { communication, conversationId, conversationType } = this.props;
    const { messageForEdit } = communication;

    if (messageForEdit) {
      communication.editMessage(messageForEdit.id, text);
      communication.removeMessageForEdit();
      return;
    }

    if (text) {
      if (conversationType === 'marketing-group') {
        communication.sendMsgToMarketingGroup(
          `marketing-group-${conversationId}`,
          text
        );
      } else {
        communication.sendMessage(conversationId, text);
      }
    }

    if (communication.selectedMessages.length > 0) {
      communication.forwardSelectedMessages();
    }

    Keyboard.dismiss();
    this.setState({ text: '' });
  }

  onType(text) {
    this.setState({ text });
    const { communication, conversationId, conversationType } = this.props;

    // Update conversation typing status only for chat group and contacts
    if (conversationType !== 'marketing-group') {
      communication.updateTypingStatus(conversationId);
    }
  }

  setFocusToInput() {
    if (this.$input) {
      this.$input.focus();
    }
  }

  removeFocusFromInput() {
    if (this.$input) {
      this.$input.blur();
    }
  }

  render() {
    const {
      messengerInfo, selectedMessages, messageForReply, messageForEdit,
    } = this.props.communication;
    const { text } = this.state;

    let isBusiness = false;
    if (messengerInfo) {
      isBusiness = messengerInfo.isBusiness;
    }

    const sendBtnStyle = [styles.icon];
    if (selectedMessages.length > 0 || messageForReply
      || messageForEdit || text !== '') {
      sendBtnStyle.push(styles.activeSendBtn);
    }

    return (
      <Animatable.View
        ref={c => this.$container = c}
        style={styles.container}
        animation="slideInUp"
        duration={300}
      >
        {isBusiness && (
          <Icon
            style={styles.icon}
            onPress={::this.onActionPress}
            source="icon-plus-24"
            touchStyle={styles.icon_action_touch}
          />
        )}
        <TextInput
          style={styles.input}
          ref={ref => this.$input = ref}
          onFocus={::this.onFocus}
          onChangeText={this.onType}
          onSubmitEditing={::this.onSend}
          placeholder="Send message"
          returnKeyType="send"
          underlineColorAndroid="transparent"
          value={this.state.text}
        />
        <Icon
          style={sendBtnStyle}
          hitSlop={14}
          onPress={::this.onSend}
          source={messageForEdit ? 'fa-check' : 'fa-paper-plane'}
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
    elevation: 20,
  },

  icon: {
    color: '$pe_color_icon',
    fontSize: 24,
  },

  icon_action_touch: {
    borderRightColor: '$pe_color_light_gray_1',
    borderRightWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },

  icon_touch: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },

  activeSendBtn: {
    color: '$pe_color_blue',
  },

  input: {
    flex: 1,
    paddingHorizontal: 22,
  },
});