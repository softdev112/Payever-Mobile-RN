/**
 * Created by Elf on 30.01.2017.
 */
import { Component } from 'react';
import { Switch } from 'react-native';
import { Icon, StyleSheet, Text, View } from 'ui';

export default class CheckBoxPref extends Component {
  props: {
    icon: string;
    checked?: boolean;
    settings: Object;
    title: string;
    prefName: string;
    onSwitched?: (prefName: string) => {};
  };

  state: {
    checked: boolean;
  };

  constructor(props) {
    super(props);

    this.state = {
      checked: !!(props.settings && props.settings[props.prefName]),
    };
  }

  onSwitchPress() {
    const { onSwitched, prefName, settings } = this.props;

    if (onSwitched) {
      onSwitched();
    }

    settings[prefName] = !this.state.checked;
    this.setState({ checked: !this.state.checked });
  }

  render() {
    const { title, icon, checked } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.titleBlock}>
          {icon && <Icon style={styles.icon} source={icon} />}
          <Text style={styles.title}>{title}</Text>
        </View>
        <Switch
          value={this.state.checked || checked}
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