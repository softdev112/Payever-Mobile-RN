import { Component } from 'react';
import {
  FlatList, View, TouchableOpacity, Image, StyleSheet,
} from 'react-native';
import ActionTypes from './actionTypes';
import Icons from '../icons';
import type ZssRichTextEditor from '../index';

const defaultActions = [
  ActionTypes.heading1,
  ActionTypes.heading2,
  ActionTypes.heading3,
  ActionTypes.setStrikethrough,
  ActionTypes.setUnderline,
  ActionTypes.removeFormat,
  ActionTypes.setQuote,
  ActionTypes.setBold,
  ActionTypes.setItalic,
  ActionTypes.insertBulletsList,
  ActionTypes.insertOrderedList,
  ActionTypes.insertLink,
];

function getDefaultIcon() {
  const icons = {};
  icons[ActionTypes.heading1] = Icons.h1;
  icons[ActionTypes.heading2] = Icons.h2;
  icons[ActionTypes.heading3] = Icons.h3;
  icons[ActionTypes.setStrikethrough] = Icons.strike;
  icons[ActionTypes.setUnderline] = Icons.underline;
  icons[ActionTypes.removeFormat] = Icons.removeFormat;
  icons[ActionTypes.setQuote] = Icons.quote;
  icons[ActionTypes.setBold] = Icons.setBold;
  icons[ActionTypes.setItalic] = Icons.setItalic;
  icons[ActionTypes.insertBulletsList] = Icons.insertBulletsList;
  icons[ActionTypes.insertOrderedList] = Icons.insertOrderedList;
  icons[ActionTypes.insertLink] = Icons.insertLink;

  return icons;
}


export default class RichTextToolbar extends Component {
  props: {
    getEditor: Function;
    actions: Array<string>;
    onPressAddLink?: Function;
    onPressAddImage?: Function;
    selectedButtonStyle?: Object;
    iconTint?: Object;
    selectedIconTint?: Object;
    unselectedButtonStyle?: Object;
    renderAction?: Function;
    iconMap?: Object;
    style?: Object;
  };

  state: {
    editor: ZssRichTextEditor;
    selectedItems: Array;
    actions: Array;
    data: Array;
  };

  constructor(props) {
    super(props);

    const actions = this.props.actions ? this.props.actions : defaultActions;
    this.state = {
      editor: undefined,
      selectedItems: [],
      actions,
      data: this.getRows(actions, []),
    };
  }

  componentWillMount() {
    const editor = this.props.getEditor();
    if (!editor) {
      throw new Error('Toolbar has no editor!');
    } else {
      editor.registerToolbar(
        selectedItems => this.setSelectedItems(selectedItems)
      );
      this.setState({ editor });
    }
  }

  componentWillReceiveProps(newProps) {
    const actions = newProps.actions ? newProps.actions : defaultActions;
    this.setState({
      actions,
      data: this.getRows(actions, this.state.selectedItems),
    });
  }

  onPress(action) {
    const { onPressAddLink, onPressAddImage } = this.props;
    const { editor } = this.state;

    switch (action) {
      case ActionTypes.setBold:
      case ActionTypes.setItalic:
      case ActionTypes.insertBulletsList:
      case ActionTypes.insertOrderedList:
      case ActionTypes.setUnderline:
      case ActionTypes.heading1:
      case ActionTypes.heading2:
      case ActionTypes.heading3:
      case ActionTypes.heading4:
      case ActionTypes.heading5:
      case ActionTypes.heading6:
      case ActionTypes.setParagraph:
      case ActionTypes.removeFormat:
      case ActionTypes.alignLeft:
      case ActionTypes.alignCenter:
      case ActionTypes.alignRight:
      case ActionTypes.alignFull:
      case ActionTypes.setSubscript:
      case ActionTypes.setSuperscript:
      case ActionTypes.setStrikethrough:
      case ActionTypes.setHR:
      case ActionTypes.setIndent:
      case ActionTypes.setOutdent:
        this.state.editor.sendAction(action);
        break;

      case ActionTypes.insertLink:
        editor.prepareInsert();
        if (onPressAddLink) {
          onPressAddLink();
        } else {
          editor.getSelectedText().then(selectedText => {
            editor.showLinkDialog(selectedText);
          });
        }

        break;

      case ActionTypes.insertImage:
        editor.prepareInsert();
        if (onPressAddImage) {
          onPressAddImage();
        }

        break;

      default:
        break;
    }
  }

  getRows(actions, selectedItems) {
    return actions.map((action) => {
      return {
        action,
        selected: selectedItems.includes(action),
      };
    });
  }

  setSelectedItems(selectedItems) {
    if (selectedItems !== this.state.selectedItems) {
      this.setState({
        selectedItems,
        data: this.getRows(this.state.actions, selectedItems),
      });
    }
  }

  getBtnSelectedStyle() {
    return [styles.defaultSelectedButton, this.props.selectedButtonStyle];
  }

  getBtnUnselectedStyle() {
    return [styles.defaultUnselectedButton, this.props.unselectedButtonStyle];
  }

  getButtonIcon(action) {
    const { iconMap } = this.props;

    if (iconMap && iconMap[action]) {
      return iconMap[action];
    } else if (getDefaultIcon()[action]) {
      return getDefaultIcon()[action];
    }

    return undefined;
  }

  defaultRenderAction(action, selected) {
    const { selectedIconTint, iconTint } = this.props;
    const icon = this.getButtonIcon(action);

    return (
      <TouchableOpacity
        style={[
          styles.btn,
          selected ? this.getBtnSelectedStyle() : this.getBtnUnselectedStyle(),
        ]}
        onPress={() => this.onPress(action)}
      >
        {icon ? (
          <Image
            style={{ tintColor: selected ? selectedIconTint : iconTint }}
            source={icon}
          />
        ) :
          null
        }
      </TouchableOpacity>
    );
  }

  renderItem({ item }) {
    const { renderAction } = this.props;

    if (renderAction) {
      return renderAction(item.action, item.selected);
    }

    return this.defaultRenderAction(item.action, item.selected);
  }

  render() {
    const { style } = this.props;

    return (
      <View style={[styles.container, style]}>
        <FlatList
          horizontal
          contentContainerStyle={styles.content}
          data={this.state.data}
          renderItem={::this.renderItem}
          keyExtractor={(item, index) => String(index)}
          initialNumToRender={12}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    backgroundColor: '#e1e1e1',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  btn: {
    height: 50,
    width: 50,
    justifyContent: 'center',
    backgroundColor: '#e1e1e1',
  },

  defaultSelectedButton: {
    backgroundColor: 'red',
  },

  defaultUnselectedButton: {
    backgroundColor: '#e1e1e1',
  },
});