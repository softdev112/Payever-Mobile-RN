import { Component, PropTypes } from 'react';
import { TextInput } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import type { Navigator } from 'react-native-navigation';
import { Icon, StyleSheet, View } from 'ui';

import type CommunicationStore
  from '../../../../store/communication';

@inject('communication')
@observer
export default class Search extends Component {
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
  };

  static defaultProps = {
    showSettings: true,
  };

  $input: TextInput;

  context: {
    navigator: Navigator;
  };

  props: {
    communication?: CommunicationStore;
    showSettings?: boolean;
    onSearchAction?: Function;
    style?: Object;
    inputStyle?: Object;
    iconStyle?: Object;
  };

  onSearchPress() {
    this.$input.focus();
  }

  onSettingsPress() {
    this.context.navigator.push({
      screen: 'communication.Settings',
    });
  }

  onTextChange(text) {
    const { onSearchAction } = this.props;

    if (onSearchAction) {
      onSearchAction(text);
    } else {
      this.props.communication.search(text);
    }
  }

  render() {
    const { iconStyle, inputStyle, showSettings, style } = this.props;

    return (
      <View style={[styles.container, style]}>
        <View style={styles.searchBox}>
          <Icon
            style={[styles.iconSearch, iconStyle]}
            onPress={::this.onSearchPress}
            source="icon-search-16"
            touchStyle={styles.iconSearch_offset}
          />
          <TextInput
            style={[styles.input, inputStyle]}
            ref={i => this.$input = i}
            onChangeText={t => this.onTextChange(t)}
            autoCorrect={false}
            multiline={false}
            placeholder="Search"
            returnKeyType="search"
            underlineColorAndroid="transparent"
          />
        </View>
        {showSettings && (
          <Icon
            style={styles.iconSettings}
            hitSlop={14}
            onPress={::this.onSettingsPress}
            source="icon-settings-24"
            touchStyle={styles.iconSettings_offset}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 27,
    marginBottom: 20,
  },

  iconSearch: {
    color: '$pe_color_icon',
    fontSize: 15,
    height: 15,
    width: 15,
  },

  iconSearch_offset: {
    marginLeft: 10,
    marginTop: 7,
  },

  iconSettings: {
    color: '$pe_color_icon',
    fontSize: 17,
    height: 17,
    width: 17,
  },

  iconSettings_offset: {
    marginTop: 7,
    marginRight: 10,
  },

  input: {
    color: '$pe_color_dark_gray',
    flex: 1,
    fontSize: 14,
    fontWeight: '200',
    marginLeft: 12,
    padding: 0,
  },

  searchBox: {
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderColor: '$border_color',
    flex: 1,
    flexDirection: 'row',
    marginRight: 9,
  },
});