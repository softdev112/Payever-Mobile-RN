import { Component } from 'react';
import { Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

export default class Header extends Component {
  render() {
    let { children } = this.props;
    if (typeof children === 'string') {
      children = <Text>{children}</Text>
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
    padding: 20,
    borderBottomColor: '#e1e1e1',
    borderBottomWidth: 1
  }
});