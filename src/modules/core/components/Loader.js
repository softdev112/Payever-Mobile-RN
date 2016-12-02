import { Component } from 'react';
import { connect } from 'react-redux';
import { Text, View } from 'react-native';

@connect(state => ({
  isLoading: state.loader.get('isLoading')
}))
export default class Loader extends Component {
  render() {
    const { isLoading } = this.props;
    if (!isLoading) {
      return null;
    }

    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
}