import { Component } from 'react';
import { Switch } from 'react-native';
import { StyleSheet, View } from 'ui';

import Title from './Title';
import type UserSettings
  from '../../../../store/CommunicationStore/models/UserSettings';

export default class CheckBoxPref extends Component {
  props: {
    icon: string;
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