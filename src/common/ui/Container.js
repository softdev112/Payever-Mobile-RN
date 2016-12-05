import { Component } from 'react';
import { ScrollView } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

export default class Container extends Component {
  render() {
    return (
      <ScrollView
        {...this.props}
        style={[styles.container, this.props.style]}
      />
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    width: '80%',
    marginLeft: '10%'
  }
});