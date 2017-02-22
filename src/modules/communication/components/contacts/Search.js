import { Component, PropTypes } from 'react';
import { TextInput } from 'react-native';
import type { Navigator } from 'react-native-navigation';
import { Icon, StyleSheet, View } from 'ui';

export default class Search extends Component {
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
  };

  $input: TextInput;

  context: {
    navigator: Navigator;
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
    console.log(text);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.searchBox}>
          <Icon
            style={styles.iconSearch}
            onPress={::this.onSearchPress}
            source="icon-search-16"
            touchStyle={styles.iconSearch_offset}
          />
          <TextInput
            style={styles.input}
            ref={i => this.$input = i}
            onChangeText={t => this.onTextChange(t)}
            autoCorrect={false}
            multiline={false}
            placeholder="Search"
            returnKeyType="search"
            underlineColorAndroid="transparent"
          />
        </View>
        <Icon
          style={styles.iconSettings}
          hitSlop={14}
          onPress={::this.onSettingsPress}
          source="icon-settings-24"
          touchStyle={styles.iconSettings_offset}
        />
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
    fontSize: 14,
    height: 14,
    width: 14,
  },

  iconSearch_offset: {
    marginLeft: 10,
    marginTop: 7,
  },

  iconSettings: {
    color: '$pe_color_icon',
    fontSize: 16,
    height: 16,
    width: 16,
  },

  iconSettings_offset: {
    marginTop: 7,
    marginRight: 10,
  },

  input: {
    color: '$pe_color_dark_gray',
    flex: 1,
    fontSize: 13,
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