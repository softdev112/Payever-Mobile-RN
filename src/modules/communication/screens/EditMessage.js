import { Component } from 'react';
import { Navigator } from 'react-native-navigation';
import { NavBar, StyleSheet, View, ZssRichTextEditor } from 'ui';

import type Message from '../../../store/communication/models/Message';

export default class EditMessage extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    message: Message | string;
    navigator: Navigator;
    fullEditorMode: boolean;
    onSave: (message: string) => void;
  };

  $richEditor: ZssRichTextEditor;

  async onSaveMessage() {
    const { onSave, navigator } = this.props;

    if (onSave) {
      const messageHtml = await this.$richEditor.getContentHtml();
      onSave(messageHtml);
    }

    navigator.pop({ animated: true });
  }

  render() {
    const { fullEditorMode, message } = this.props;
    const initMsgValue = typeof message === 'string' ? message : message.body;

    return (
      <View style={styles.container}>
        <NavBar popup>
          <NavBar.Back />
          <NavBar.Title title="Edit Message" />
          <NavBar.Button title="Save" onPress={::this.onSaveMessage} />
        </NavBar>
        <ZssRichTextEditor
          ref={ref => this.$richEditor = ref}
          style={styles.richText}
          hiddenTitle
          initialContentHTML={initMsgValue || ' '}
          showToolbar={fullEditorMode}
        />
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
    padding: 8,
  },

  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: '$font_family',
    justifyContent: 'flex-start',
  },
});