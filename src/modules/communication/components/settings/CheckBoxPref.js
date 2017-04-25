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
    value?: boolean;
    settings?: UserSettings | Object;
    onValueChange?: (value: boolean) => {};
    style?: Object;
  };

  state: {
    checked: boolean;
  };

  constructor(props) {
    super(props);

    const { prefName, settings, value } = props;

    this.state = {
      checked: settings ? settings[prefName] : value,
    };
  }

  componentWillReceiveProps(newProps) {
    if (this.props.value !== newProps.value) {
      this.setState({
        checked: newProps.value,
      });
    }
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
    const { title, icon, style } = this.props;

    return (
      <View style={[styles.container, style]}>
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