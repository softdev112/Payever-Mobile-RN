import { Component, PropTypes } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Navigator } from 'react-native-navigation';
import { StyleSheet, Text } from 'ui';

export default class Contact extends Component {
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
  };

  context: {
    navigator: Navigator;
  };

  props: {
    item: Object;
    type: 'contacts' | 'groups';
  };

  onContactClick(item) {
    this.context.navigator.push({
      screen: 'communication.Chat',
      passProps: {
        title: item.name,
      },
    });
  }

  renderContact(item) {
    const statusStyle = item.online ? styles.status_online : null;
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => this.onContactClick(item)}
      >
        <View style={[styles.status, statusStyle]} />
        <Text style={styles.title}>{item.name}</Text>
      </TouchableOpacity>
    );
  }

  renderGroup(item) {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => this.onContactClick(item)}
      >
        <Text style={styles.title}>#{item.name}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    const { item, type } = this.props;
    if (type === 'groups') {
      return this.renderGroup(item);
    }
    return this.renderContact(item);
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  add: {
    color: '$pe_icons_color',
    fontSize: 16,
    height: 17,
    width: 16,
  },

  status: {
    borderColor: '#d8d8d8',
    borderRadius: 4,
    borderWidth: 1,
    height: 8,
    marginRight: 9,
    width: 8,
  },

  status_online: {
    backgroundColor: '#75b636',
    borderWidth: 0,
  },

  title: {
    color: '#9ba2b1',
    flex: 1,
    fontSize: 12,
  },
});