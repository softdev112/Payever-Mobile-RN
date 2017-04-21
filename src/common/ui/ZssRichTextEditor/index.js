import { Component } from 'react';
import {
  Modal, View, Text, StyleSheet, TextInput, TouchableOpacity,
  Platform, PixelRatio, Keyboard, KeyboardAvoidingView, Dimensions, WebView,
} from 'react-native';
import { log } from 'utils';

import handleAction from './components/WebviewMessageHandler';
import RichTextToolbar from './components/RichTextToolbar';
import ActionTypes, { messages } from './components/actionTypes';

const TOOLBAR_HEIGHT = 55;

const PlatformIOS = Platform.OS === 'ios';
const iOSEditor = require('./components/editor.html');

export default class ZssRichTextEditor extends Component {
  static defaultProps = {
    contentInset: {},
    style: {},
    showToolbar: true,
    contentPlaceholder: 'Enter Message',
  };

  static Toolbar = RichTextToolbar;

  props: {
    initialTitleHTML?: string;
    initialContentHTML?: string;
    titlePlaceholder?: string;
    contentPlaceholder?: string;
    editorInitializedCallback?: Function;
    customCSS?: string;
    hiddenTitle?: boolean;
    showToolbar?: boolean;
    enableOnChange?: boolean;
    footerHeight?: number;
    contentInset?: Object;
    style?: Object;
  };

  state: {
    selectionChangeListeners: Array<any>;
    onChange: Array<any>;
    showLinkDialog: boolean;
    linkInitialUrl: string;
    linkTitle: string;
    linkUrl: string;
    keyboardHeight: number;
  };

  $webView: WebView;
  keyboardListeners: Object;

  constructor(props) {
    super(props);
    this.sendAction = this.sendAction.bind(this);
    this.registerToolbar = this.registerToolbar.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.onKeyboardWillShow = this.onKeyboardWillShow.bind(this);
    this.onKeyboardWillHide = this.onKeyboardWillHide.bind(this);
    this.state = {
      selectionChangeListeners: [],
      onChange: [],
      showLinkDialog: false,
      linkInitialUrl: '',
      linkTitle: '',
      linkUrl: '',
      keyboardHeight: 0,
    };
    this.selectedTextChangeListeners = [];
  }

  componentWillMount() {
    if (PlatformIOS) {
      this.keyboardListeners = [
        Keyboard.addListener('keyboardWillShow', this.onKeyboardWillShow),
        Keyboard.addListener('keyboardWillHide', this.onKeyboardWillHide),
      ];
    } else {
      this.keyboardListeners = [
        Keyboard.addListener('keyboardDidShow', this.onKeyboardWillShow),
        Keyboard.addListener('keyboardDidHide', this.onKeyboardWillHide),
      ];
    }
  }

  componentWillUnmount() {
    if (this.keyboardListeners) {
      this.keyboardListeners.forEach(listener => listener.remove());
    }
  }

  onKeyboardWillShow(event) {
    const newKeyboardHeight = event.endCoordinates.height;
    if (this.state.keyboardHeight === newKeyboardHeight) {
      return;
    }

    if (newKeyboardHeight) {
      this.setEditorAvailableHeightBasedOnKeyboardHeight(newKeyboardHeight);
    }

    this.setState({ keyboardHeight: newKeyboardHeight });
  }

  onKeyboardWillHide() {
    this.setState({ keyboardHeight: 0 });
  }

  onMessage(event) {
    const {
      customCSS, titlePlaceholder, contentPlaceholder, hiddenTitle,
      enableOnChange, initialTitleHTML, initialContentHTML,
      editorInitializedCallback,
    } = this.props;

    try {
      const message = JSON.parse(event.nativeEvent.data);

      switch (message.type) {
        case messages.TITLE_HTML_RESPONSE: {
          if (this.titleResolve) {
            this.titleResolve(message.data);
            this.titleResolve = undefined;
            this.titleReject = undefined;
            if (this.pendingTitleHtml) {
              clearTimeout(this.pendingTitleHtml);
              this.pendingTitleHtml = undefined;
            }
          }
          break;
        }

        case messages.TITLE_TEXT_RESPONSE: {
          if (this.titleTextResolve) {
            this.titleTextResolve(message.data);
            this.titleTextResolve = undefined;
            this.titleTextReject = undefined;
            if (this.pendingTitleText) {
              clearTimeout(this.pendingTitleText);
              this.pendingTitleText = undefined;
            }
          }
          break;
        }

        case messages.CONTENT_HTML_RESPONSE: {
          if (this.contentResolve) {
            this.contentResolve(message.data);
            this.contentResolve = undefined;
            this.contentReject = undefined;
            if (this.pendingContentHtml) {
              clearTimeout(this.pendingContentHtml);
              this.pendingContentHtml = undefined;
            }
          }
          break;
        }

        case messages.SELECTED_TEXT_RESPONSE: {
          if (this.selectedTextResolve) {
            this.selectedTextResolve(message.data);
            this.selectedTextResolve = undefined;
            this.selectedTextReject = undefined;
            if (this.pendingSelectedText) {
              clearTimeout(this.pendingSelectedText);
              this.pendingSelectedText = undefined;
            }
          }
          break;
        }

        case messages.ZSS_INITIALIZED: {
          if (customCSS) {
            this.setCustomCSS(customCSS);
          }
          this.setTitlePlaceholder(titlePlaceholder);
          this.setContentPlaceholder(contentPlaceholder);

          // To avoid undefined the '' passing
          this.setTitleHTML(initialTitleHTML);
          this.setContentHTML(initialContentHTML);

          /* eslint-disable no-unused-expressions */
          hiddenTitle && this.hideTitle();
          enableOnChange && this.enableOnChange();
          editorInitializedCallback && this.props.editorInitializedCallback();
          /* eslint-enable no-unused-expressions */
          break;
        }

        case messages.LINK_TOUCHED: {
          this.prepareInsert();
          const { title, url } = message.data;
          this.showLinkDialog(title, url);
          break;
        }

        case messages.LOG:
          log.debug('FROM ZSS', message.data);
          break;

        case messages.SCROLL:
          this.webView.setNativeProps({ contentOffset: { y: message.data } });
          break;

        case messages.TITLE_FOCUSED: {
          if (this.titleFocusHandler) {
            this.titleFocusHandler();
          }

          break;
        }

        case messages.CONTENT_FOCUSED: {
          if (this.contentFocusHandler) {
            this.contentFocusHandler();
          }

          break;
        }

        case messages.SELECTION_CHANGE: {
          const items = message.data.items;
          this.state.selectionChangeListeners.map(listener => listener(items));
          break;
        }

        case messages.CONTENT_CHANGE: {
          const content = message.data.content;
          this.state.onChange.map(listener => listener(content));
          break;
        }

        case messages.SELECTED_TEXT_CHANGED: {
          const selectedText = message.data;
          this.selectedTextChangeListeners.forEach(
            listener => listener(selectedText)
          );
          break;
        }

        default:
          log.error(message.type);
          break;
      }
    } catch (e) {
      log.error(e);
    }
  }

  setEditorAvailableHeightBasedOnKeyboardHeight(keyboardHeight) {
    const { top = 0, bottom = 0 } = this.props.contentInset;
    const { marginTop = 0, marginBottom = 0 } = this.props.style;
    const spacing = marginTop + marginBottom + top + bottom;

    const editorAvailableHeight =
      Dimensions.get('window').height - keyboardHeight - spacing;
    this.setEditorHeight(editorAvailableHeight);
  }

  linkIsNew() {
    return !this.state.linkInitialUrl;
  }

  upperCaseButtonTextIfNeeded(buttonText) {
    return PlatformIOS ? buttonText : buttonText.toUpperCase();
  }

  hideModal() {
    this.setState({
      showLinkDialog: false,
      linkInitialUrl: '',
      linkTitle: '',
      linkUrl: '',
    });
  }

  sendAction(action, data) {
    this.$webView.injectJavaScript(handleAction({ type: action, data }));
  }

  // --------------- Public API
  showLinkDialog(optionalTitle = '', optionalUrl = '') {
    this.setState({
      linkInitialUrl: optionalUrl,
      linkTitle: optionalTitle,
      linkUrl: optionalUrl,
      showLinkDialog: true,
    });
  }

  focusTitle() {
    this.sendAction(ActionTypes.focusTitle);
  }

  focusContent() {
    this.sendAction(ActionTypes.focusContent);
  }

  registerToolbar(listener) {
    this.setState({
      selectionChangeListeners: [
        ...this.state.selectionChangeListeners,
        listener,
      ],
    });
  }

  enableOnChange() {
    this.sendAction(ActionTypes.enableOnChange);
  }

  registerContentChangeListener(listener) {
    this.setState({
      onChange: [...this.state.onChange, listener],
    });
  }

  setTitleHTML(html) {
    this.sendAction(ActionTypes.setTitleHtml, html);
  }

  hideTitle() {
    this.sendAction(ActionTypes.hideTitle);
  }

  showTitle() {
    this.sendAction(ActionTypes.showTitle);
  }

  toggleTitle() {
    this.sendAction(ActionTypes.toggleTitle);
  }

  setContentHTML(html) {
    this.sendAction(ActionTypes.setContentHtml, html);
  }

  blurTitleEditor() {
    this.sendAction(ActionTypes.blurTitleEditor);
  }

  blurContentEditor() {
    this.sendAction(ActionTypes.blurContentEditor);
  }

  setBold() {
    this.sendAction(ActionTypes.setBold);
  }

  setItalic() {
    this.sendAction(ActionTypes.setItalic);
  }

  setUnderline() {
    this.sendAction(ActionTypes.setUnderline);
  }

  heading1() {
    this.sendAction(ActionTypes.heading1);
  }

  heading2() {
    this.sendAction(ActionTypes.heading2);
  }

  heading3() {
    this.sendAction(ActionTypes.heading3);
  }

  heading4() {
    this.sendAction(ActionTypes.heading4);
  }

  heading5() {
    this.sendAction(ActionTypes.heading5);
  }

  heading6() {
    this.sendAction(ActionTypes.heading6);
  }

  setParagraph() {
    this.sendAction(ActionTypes.setParagraph);
  }

  removeFormat() {
    this.sendAction(ActionTypes.removeFormat);
  }

  alignLeft() {
    this.sendAction(ActionTypes.alignLeft);
  }

  alignCenter() {
    this.sendAction(ActionTypes.alignCenter);
  }

  alignRight() {
    this.sendAction(ActionTypes.alignRight);
  }

  alignFull() {
    this.sendAction(ActionTypes.alignFull);
  }

  insertBulletsList() {
    this.sendAction(ActionTypes.insertBulletsList);
  }

  insertOrderedList() {
    this.sendAction(ActionTypes.insertOrderedList);
  }

  insertLink(url, title) {
    this.sendAction(ActionTypes.insertLink, { url, title });
  }

  updateLink(url, title) {
    this.sendAction(ActionTypes.updateLink, { url, title });
  }

  insertImage(attributes) {
    this.sendAction(ActionTypes.insertImage, attributes);

    // This must be called BEFORE insertImage. But WebViewBridge uses a stack :/
    this.prepareInsert();
  }

  setSubscript() {
    this.sendAction(ActionTypes.setSubscript);
  }

  setSuperscript() {
    this.sendAction(ActionTypes.setSuperscript);
  }

  setStrikethrough() {
    this.sendAction(ActionTypes.setStrikethrough);
  }

  setHR() {
    this.sendAction(ActionTypes.setHR);
  }

  setIndent() {
    this.sendAction(ActionTypes.setIndent);
  }

  setOutdent() {
    this.sendAction(ActionTypes.setOutdent);
  }

  setBackgroundColor(color) {
    this.sendAction(ActionTypes.setBackgroundColor, color);
  }

  setTextColor(color) {
    this.sendAction(ActionTypes.setTextColor, color);
  }

  setTitlePlaceholder(placeholder) {
    this.sendAction(ActionTypes.setTitlePlaceholder, placeholder);
  }

  setContentPlaceholder(placeholder) {
    this.sendAction(ActionTypes.setContentPlaceholder, placeholder);
  }

  setCustomCSS(css) {
    this.sendAction(ActionTypes.setCustomCSS, css);
  }

  prepareInsert() {
    this.sendAction(ActionTypes.prepareInsert);
  }

  restoreSelection() {
    this.sendAction(ActionTypes.restoreSelection);
  }

  init() {
    this.sendAction(ActionTypes.init);
    this.setPlatform();
    if (this.props.footerHeight) {
      this.setFooterHeight();
    }
  }

  setEditorHeight(height) {
    this.sendAction(ActionTypes.setEditorHeight, height);
  }

  setFooterHeight() {
    this.sendAction(ActionTypes.setFooterHeight, this.props.footerHeight);
  }

  setPlatform() {
    this.sendAction(ActionTypes.setPlatform, Platform.OS);
  }

  async getTitleHtml() {
    return new Promise((resolve, reject) => {
      this.titleResolve = resolve;
      this.titleReject = reject;
      this.sendAction(ActionTypes.getTitleHtml);

      this.pendingTitleHtml = setTimeout(() => {
        if (this.titleReject) {
          this.titleReject('timeout');
        }
      }, 5000);
    });
  }

  async getTitleText() {
    return new Promise((resolve, reject) => {
      this.titleTextResolve = resolve;
      this.titleTextReject = reject;
      this.sendAction(ActionTypes.getTitleText);

      this.pendingTitleText = setTimeout(() => {
        if (this.titleTextReject) {
          this.titleTextReject('timeout');
        }
      }, 5000);
    });
  }

  async getContentHtml() {
    return new Promise((resolve, reject) => {
      this.contentResolve = resolve;
      this.contentReject = reject;
      this.sendAction(ActionTypes.getContentHtml);

      this.pendingContentHtml = setTimeout(() => {
        if (this.contentReject) {
          this.contentReject('timeout');
        }
      }, 5000);
    });
  }

  async getSelectedText() {
    return new Promise((resolve, reject) => {
      this.selectedTextResolve = resolve;
      this.selectedTextReject = reject;
      this.sendAction(ActionTypes.getSelectedText);

      this.pendingSelectedText = setTimeout(() => {
        if (this.selectedTextReject) {
          this.selectedTextReject('timeout');
        }
      }, 5000);
    });
  }

  setTitleFocusHandler(callbackHandler) {
    this.titleFocusHandler = callbackHandler;
    this.sendAction(ActionTypes.setTitleFocusHandler);
  }

  setContentFocusHandler(callbackHandler) {
    this.contentFocusHandler = callbackHandler;
    this.sendAction(ActionTypes.setContentFocusHandler);
  }

  addSelectedTextChangeListener(listener) {
    this.selectedTextChangeListeners.push(listener);
  }

  renderLinkModal() {
    return (
      <Modal
        animationType="fade"
        transparent
        visible={this.state.showLinkDialog}
        onRequestClose={() => this.setState({ showLinkDialog: false })}
      >
        <View style={styles.modal}>
          <View
            style={[
              styles.innerModal,
              { marginBottom: PlatformIOS ? this.state.keyboardHeight : 0 },
            ]}
          >
            <Text style={styles.inputTitle}>Title</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                onChangeText={(text) => this.setState({ linkTitle: text })}
                value={this.state.linkTitle}
              />
            </View>
            <Text style={[styles.inputTitle, { marginTop: 10 }]}>URL</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                onChangeText={(text) => this.setState({ linkUrl: text })}
                value={this.state.linkUrl}
                keyboardType="url"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {PlatformIOS && <View style={styles.lineSeparator} />}
            {this.renderModalButtons()}
          </View>
        </View>
      </Modal>
    );
  }

  renderModalButtons() {
    const { linkTitle, linkUrl } = this.state;
    const insertUpdateDisabled =
      linkTitle.trim().length <= 0 || linkUrl.trim().length <= 0;
    const containerPlatformStyle = [
      styles.btnsContainer,
      PlatformIOS ? { justifyContent: 'space-between' } : { paddingTop: 15 },
    ];
    const buttonPlatformStyle =
      PlatformIOS ? { flex: 1, height: 45, justifyContent: 'center' } : {};

    return (
      <View style={containerPlatformStyle}>
        {!PlatformIOS && <View style={{ flex: 1 }} />}
        <TouchableOpacity
          onPress={() => this.hideModal()}
          style={buttonPlatformStyle}
        >
          <Text style={[styles.button, { paddingRight: 10 }]}>
            {this.upperCaseButtonTextIfNeeded('Cancel')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (this.linkIsNew()) {
              this.insertLink(this.state.linkUrl, this.state.linkTitle);
            } else {
              this.updateLink(this.state.linkUrl, this.state.linkTitle);
            }
            this.hideModal();
          }}
          disabled={insertUpdateDisabled}
          style={buttonPlatformStyle}
        >
          <Text
            style={[
              styles.button,
              { opacity: insertUpdateDisabled ? 0.5 : 1 },
            ]}
          >
            {this.upperCaseButtonTextIfNeeded(
              this.linkIsNew() ? 'Insert' : 'Update'
            )}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { showToolbar, style } = this.props;
    const { keyboardHeight } = this.state;
    const isKeyboardOn = keyboardHeight > 0;
    const bottomInset = isKeyboardOn ? (keyboardHeight + TOOLBAR_HEIGHT) : 0;

    // In release build, external html files in Android can't be required,
    // so they must be placed in the assets folder and accessed via uri
    const pageSource = PlatformIOS
      ? iOSEditor : { uri: 'file:///android_asset/editor.html' };

    return (
      <KeyboardAvoidingView
        style={[styles.container, style]}
        contentContainerStyle={styles.container}
        keyboardVerticalOffset={isKeyboardOn ? 0 : TOOLBAR_HEIGHT}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
      >
        <WebView
          {...this.props}
          style={styles.webView}
          contentInset={{ top: 20, left: 0, bottom: bottomInset, right: 0 }}
          ref={ref => this.$webView = ref}
          onMessage={(message) => this.onMessage(message)}
          source={pageSource}
          onLoad={() => this.init()}
        />
        {showToolbar && (
          <RichTextToolbar
            getEditor={() => this}
          />
        )}
        {this.renderLinkModal()}
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  webView: {
    width: Dimensions.get('window').width,
    paddingTop: 5,
    borderColor: 'red',
    borderWidth: 2,
  },

  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  innerModal: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingTop: 20,
    paddingBottom: PlatformIOS ? 0 : 20,
    paddingLeft: 20,
    paddingRight: 20,
    alignSelf: 'stretch',
    margin: 40,
    borderRadius: PlatformIOS ? 8 : 2,
  },

  btnsContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
  },

  button: {
    fontSize: 16,
    color: '#4a4a4a',
    textAlign: 'center',
  },

  inputWrapper: {
    marginTop: 5,
    marginBottom: 10,
    borderBottomColor: '#4a4a4a',
    borderBottomWidth: PlatformIOS ? 1 / PixelRatio.get() : 0,
  },

  inputTitle: {
    color: '#4a4a4a',
  },

  input: {
    height: PlatformIOS ? 20 : 40,
    paddingTop: 0,
  },

  lineSeparator: {
    height: 1 / PixelRatio.get(),
    backgroundColor: '#d5d5d5',
    marginLeft: -20,
    marginRight: -20,
    marginTop: 20,
  },
});