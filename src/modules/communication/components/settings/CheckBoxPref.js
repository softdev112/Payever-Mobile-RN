import { Component } from 'react';
import { Switch } from 'react-native';
import { StyleSheet, View } from 'ui';

import Title from './Title';
import type UserSettings
  from '../../../../store/communication/models/UserSettings';

export default class CheckBoxPref extends Component {
  props: {
    icon: string;
    title: string;
    prefName?: string;
    initValue?: boolean;
    settings?: UserSettings | Object;
    onValueChange?: (value: boolean) => {};
  };

  state: {
    checked: boolean;
  };

  constructor(props) {
    super(props);

    const { initValue, prefName, settings } = props;

    this.state = {
      checked: settings ? settings[prefName] : initValue,
    };
  }

  onSwitchPress() {
    const { onValueChange, prefName, settings } = this.props;
    const checked = !this.state.checked;

    if (onValueChange) {
      onValueChange(checked);
    }

    if (settings) {
      settings[prefName] = checked;
    }

    this.setState({ checked });
  }

  render() {
    const { title, icon } = this.props;

    return (
      <View style={styles.container}>
        <Title icon={icon} title={title} />
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
    alignItems: 'center',
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    height: 40,
  },
});