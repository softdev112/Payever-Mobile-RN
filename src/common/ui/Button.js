import { Component } from 'react';
import { Button as ReactButton } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

export default class Button extends Component {
  render() {
    return (
      <ReactButton {...this.props} style={styles.button} />
    );
  }
}

const styles = EStyleSheet.create({
  button: {

  }
});