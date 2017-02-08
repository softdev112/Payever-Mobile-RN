import { Component } from 'react';
import { Switch } from 'react-native';
import { Icon, StyleSheet, Text, View } from 'ui';

import type UserSettings
  from '../../../../store/CommunicationStore/models/UserSettings';

export default class CheckBoxPref extends Component {
  props: {
    icon?: string;
    title: string;
    prefName: string;
    settings: UserSettings;
    onValueChange?: () => {};
  };

  state: {
    checked: boolean;
  };

  constructor(props) {
    super(props);

    this.state = {
      checked: !!(props.settings[props.prefName]),
    };
  }

  onSwitchPress() {
    const { onValueChange, prefName, settings } = this.props;

    if (onValueChange) {
      onValueChange();
    }

    settings[prefName] = !this.state.checked;
    this.setState({ checked: !this.state.checked });
  }

  render() {
    const { title, icon } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.titleBlock}>
          {icon && <Icon style={styles.icon} source={icon} />}
          <Text style={styles.title}>{title}</Text>
        </View>
        <Switch
          value={this.state.checked}
          onValueChange={::this.onSwitchPress}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 3,
    height: 40,
  },

  titleBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon: {
    marginRight: 8,
    fontSize: 16,
  },

  title: {
    fontSize: 14,
  },
});