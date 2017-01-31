/**
 * Created by Elf on 30.01.2017.
 */
import { Component } from 'react';
import { Slider, Switch } from 'react-native';
import { Icon, StyleSheet, Text, View } from 'ui';

export default class CheckBoxPref extends Component {
  props: {
    icon: string;
    checked?: boolean;
    title: string;
    onSwitched: (prefName: string) => {};
  };

  state: {
    checked: boolean;
  };

  constructor(props) {
    super(props);

    this.state = {
      checked: !!props.checked,
    };
  }

  onSwitchPress() {
    this.setState({ checked: !this.state.checked });
    this.props.onSwitched();
  }

  render() {
    const { title, icon } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.checkBoxBlock}>
          <View style={styles.titleBlock}>
            {icon && <Icon style={styles.icon} source={icon} />}
            <Text style={styles.title}>{title}</Text>
          </View>
          <Switch
            value={this.state.checked}
            onValueChange={::this.onSwitchPress}
          />
        </View>
        {this.state.checked && <Slider />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 3,
  },

  checkBoxBlock: {
    flexDirection: 'row',
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
    marginLeft: 0,
  },
});