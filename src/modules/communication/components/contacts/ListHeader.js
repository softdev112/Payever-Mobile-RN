import { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react/native';
import { Icon, StyleSheet, Text, View } from 'ui';
import type { Navigator } from 'react-native-navigation';
import type CommunicationStore
  from '../../../../store/communication';

import CountBadge from './CountBadge';

const TITLES = {
  contacts: 'DIRECT MESSAGES',
  groups:   'GROUPS',
  foundMessages: 'FOUND MESSAGES',
};

const PICKUP_MODE_TITLES = {
  contacts: 'CONTACTS',
  groups:   'GROUPS',
};

@inject('communication')
@observer
export default class ListHeader extends Component {
  static defaultProps = {
    pickUpMode: false,
  };

  static contextTypes = {
    navigator: PropTypes.object.isRequired,
  };

  context: {
    navigator: Navigator;
  };

  props: {
    communication: CommunicationStore;
    hideMessages: boolean;
    pickUpMode: boolean;
    type: 'contacts' | 'groups' | 'foundMessages';
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
    const { communication, hideMessages, pickUpMode, type } = this.props;

    if (type === 'foundMessages' && hideMessages) {
      //noinspection JSConstructorReturnsPrimitive
      return null;
    }

    const inf = communication.messengerInfo;
    const count = type === 'contacts' ? inf.unreadCount : inf.unreadGroupCount;

    return (
      <View style={styles.container}>
        <View style={styles.title}>
          <Text style={styles.title_text}>
            {pickUpMode ? PICKUP_MODE_TITLES[type] : TITLES[type]}
          </Text>
          <CountBadge value={count} />
        </View>

        {(type !== 'foundMessages' && !pickUpMode) && (
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
    marginVertical: 8,
    padding: 5,
    backgroundColor: '#FFF',
  },

  add: {
    color: '$pe_color_icon',
    fontSize: 16,
    height: 17,
    width: 16,
  },

  title: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },

  title_text: {
    color: '#959ba3',
    fontSize: 14,
    fontWeight: '200',
  },
});