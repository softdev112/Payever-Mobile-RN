import { Component } from 'react';
import { Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

export default class Header extends Component {
  render() {
    let { children } = this.props;
    if (typeof children === 'string') {
      children = <Text style={styles.text}>{children}</Text>
    }

    return (
      <View
        {...this.props}
        children={children}
        style={[styles.component, this.props.style]}
      />
    );
  }
}

const styles = EStyleSheet.create({
  component: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
    borderBottomColor: '#e1e1e1',
    borderBottomWidth: 1
  },

  text: {
    textAlign: 'center',
    color: '$pe_color_dark_gray'
  }
});