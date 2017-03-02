import { Component, PropTypes } from 'react';
import { Icon, StyleSheet, Text, View } from 'ui';
import type { Navigator } from 'react-native-navigation';

const TITLES = {
  contacts: 'DIRECT MESSAGES',
  groups:   'GROUPS',
  foundMessages: 'FOUND MESSAGES',
};

export default class ListHeader extends Component {
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
  };

  context: {
    navigator: Navigator;
  };

  props: {
    type: 'contacts' | 'groups' | 'foundMessages';
    hideMessages: boolean;
  };

  onPlusClick() {
    const { navigator } = this.context;
    const { type } = this.props;

    if (type === 'contacts') {
      navigator.push({ screen: 'communication.AddContact' });
    }

    if (type === 'groups') {
      navigator.push({ screen: 'communication.AddGroup' });
    }
  }

  render() {
    const { hideMessages, type } = this.props;

    if (type === 'foundMessages' && hideMessages) {
      //noinspection JSConstructorReturnsPrimitive
      return null;
    }

    return (
      <View style={styles.container}>
        <Text style={styles.title}>{TITLES[type]}</Text>
        {type !== 'foundMessages' && (
          <Icon
            style={styles.add}
            source="icon-plus-circle-24"
            onPress={::this.onPlusClick}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    margin: 10,
  },

  title: {
    color: '#959ba3',
    flex: 1,
    fontSize: 10,
    fontWeight: '200',
  },

  add: {
    color: '$pe_color_icon',
    fontSize: 16,
    width: 16,
    height: 17,
  },
});