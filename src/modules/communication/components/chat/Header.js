import { Component } from 'react';
import { Icon, StyleSheet, Text, View } from 'ui';

import OnlineStatus from '../OnlineStatus';

export default class UserInfoHeader extends Component {
  props: {
    online: boolean;
    status: string;
    userName: string;
  };

  onSettingsPress() {
    console.log('Settings settings');
  }

  render() {
    const { online, status, userName } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.titleRow}>
          <Text style={styles.userName} numberOfLines={1}>{userName}</Text>
          <Icon
            style={styles.iconSettings}
            hitSlop={14}
            onPress={::this.onSettingsPress}
            source="icon-settings-24"
            touchStyle={styles.iconSettings_offset}
          />
        </View>
        <View style={styles.status}>
          {online && (
            <OnlineStatus style={styles.status_led} isOnline />
          )}
          <Text style={styles.status_text}>{status}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 70,
    paddingLeft: 30,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 14,
    borderBottomColor: '$pe_color_light_gray_1',
    borderBottomWidth: 1,
  },

  userName: {
    color: '$pe_color_dark_gray',
    fontSize: 24,
    fontWeight: '200',
  },

  iconSettings: {
    color: '$pe_color_icon',
    fontSize: 20,
  },

  iconSettings_offset: {
    marginTop: 3,
    marginRight: 10,
  },

  titleRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  status: {
    alignItems: 'center',
    flexDirection: 'row',
  },

  status_led: {
    marginRight: 8,
  },

  status_text: {
    color: '#959ba3',
    fontSize: 12,
  },
});