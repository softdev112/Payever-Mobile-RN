import { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import { StyleSheet, Text } from 'ui';
import { inject, observer } from 'mobx-react/native';
import * as Animatable from 'react-native-animatable';

import CommunicationStore from '../../../../store/communication';
/* eslint-disable */
@inject('communication')
@observer
export default class UploadFileMsgView extends Component {
  props: {
    communication: CommunicationStore;
    style?: Object;
  };

  render() {
    const { style } = this.props;

    return (
      <Animatable.View
        style={[styles.container, style]}
        animation="fadeIn"
        duration={300}
      >
        <ActivityIndicator
          animating
          size="small"
          color="#50abf1"
        />
        <Text style={styles.text}>Image Loading</Text>
      </Animatable.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 300,
    maxHeight: 300,
    backgroundColor: '#FBF4CD',
    transform: [{ scaleY: -1 }],
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  text: {
    marginTop: 10,
    fontSize: 18,
    color: '#000',
  },
});