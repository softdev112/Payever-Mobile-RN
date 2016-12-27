import { Component } from 'react';
import { Text } from 'react-native';
import StyleSheet from './StyleSheet';

export default class Error extends Component {
  props: {
    message: string;
    style: Object | number;
  };

  render() {
    const { message } = this.props;
    if (!message) {
      return null;
    }

    return (
      <Text {...this.props} style={[styles.component, this.props.style]}>
        {message}
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  component: {
    padding: 5,
    textAlign: 'center',
    color: 'red',
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 4,
  },
});