import { Component, PropTypes } from 'react';
import { Animated, Keyboard, Platform, TextInput } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import type { Navigator } from 'react-native-navigation';
import * as Animatable from 'react-native-animatable';
import ImagePicker from 'react-native-image-picker';
import {
  DocumentPickerUtil, DocumentPicker,
} from 'react-native-document-picker';
import { Icon, StyleSheet } from 'ui';
import { log } from 'utils';

import CommunicationStore from '../../../../store/communication';
import type { ConversationType } from
  '../../../../store/communication/models/Conversation';

const INIT_TEXT_HEIGHT = 20;
const MIN_FOOTER_HEIGHT = 50;
const FOOTER_HEIGHT_ADJUST = 8;
const MAX_FOOTER_HEIGHT = 100;

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
    textHeight: number;
    animValue: Animated.Value;
  };

  constructor(props) {
    super(props);

    this.state = {
      text: props.textValue || '',
      textHeight: INIT_TEXT_HEIGHT,
      animValue: new Animated.Value(MIN_FOOTER_HEIGHT),
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
    const { text } = this.state;
    const options = {
      title: 'Attachments',
      customButtons: [{
        name: 'offer',
        title: 'Send New Offer...',
      }, {
        name: 'file',
        title: 'Send Document...',
      }],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, async (logoFileInfo) => {
      if (!logoFileInfo || logoFileInfo.error || logoFileInfo.didCancel) {
        log.error(logoFileInfo.error);
        return;
      }

      switch (logoFileInfo.customButton) {
        case 'offer':
          this.context.navigator.push({
            screen: 'marketing.CreateOffer',
            passProps: { conversationId },
          });
          return;

        case 'file':
          DocumentPicker.show(
            { filetype: [DocumentPickerUtil.allFiles()] },
            (err, url) => {
              const documentFile = {
                ...url,
                isPicture: false,
              };

              communication.sendMessageWithMedias(
                text, documentFile, conversationId
              );
            });
          return;

        default:
          logoFileInfo.isPicture = true;
          if (!logoFileInfo.fileName) {
            logoFileInfo.fileName = logoFileInfo.uri.split('/').pop();
          }

          communication.sendMessageWithMedias(
            text, logoFileInfo, conversationId
          );
          break;
      }

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

  onInputContentSizeChange({ nativeEvent: { contentSize: { height } } }) {
    const { communication } = this.props;
    const { animValue } = this.state;

    let footerHeight = height + FOOTER_HEIGHT_ADJUST;
    if (height <= MIN_FOOTER_HEIGHT) {
      footerHeight = MIN_FOOTER_HEIGHT;
    } else if (height >= MAX_FOOTER_HEIGHT) {
      footerHeight = MAX_FOOTER_HEIGHT;
    }

    Animated.timing(animValue, {
      toValue: footerHeight,
      duration: 200,
    }).start();

    communication.ui.setChatFooterHeight(footerHeight);
    this.setState({ textHeight: height });
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
    const { text, animValue } = this.state;

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
        style={[styles.container, { height: animValue }]}
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
          multiline
          onFocus={::this.onFocus}
          onChangeText={this.onType}
          onSubmitEditing={::this.onSend}
          placeholder="Send message"
          placeholderTextColor="#b5b9be"
          returnKeyType="done"
          underlineColorAndroid="transparent"
          value={this.state.text}
          onContentSizeChange={
            Platform.OS === 'ios' ? ::this.onInputContentSizeChange : null
          }
          onChange={
            Platform.OS === 'android' ? ::this.onInputContentSizeChange : null
          }
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
    height: MIN_FOOTER_HEIGHT,
    justifyContent: 'space-between',

    '@media ios': {
      zIndex: 50,
    },
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
    paddingRight: 8,
    paddingLeft: 10,
    fontSize: 16,
    '@media ios': {
      alignSelf: 'center',
    },
  },
});