import { Component } from 'react';
import { StyleSheet, Text } from 'ui';
import { inject, observer } from 'mobx-react/native';
import * as Animatable from 'react-native-animatable';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

import CommunicationStore from '../../../../store/communication';

@inject('communication')
@observer
export default class UploadFileMsgView extends Component {
  props: {
    communication: CommunicationStore;
    message: any;
    style?: Object;
  };

  componentWillUnmount() {
    const { message, communication } = this.props;
    communication.removeFileUploadingProgress(message.id);
  }

  render() {
    const { communication, message, style } = this.props;
    const value = communication.filesUploadingProgress.has(message.id)
      ? communication.filesUploadingProgress.get(message.id) : 0;

    return (
      <Animatable.View
        style={[styles.container, style]}
        animation="fadeIn"
        duration={300}
      >
        <AnimatedCircularProgress
          size={50}
          width={1}
          fill={value}
          tintColor="#0084ff"
          backgroundColor="#e1e1e1"
        >
          {(fill) => (
            <Text style={styles.progress}>
              {Math.round(fill)}%
            </Text>
          )}
        </AnimatedCircularProgress>
        <Text style={styles.text}>Image Loading</Text>
      </Animatable.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 300,
    backgroundColor: '#FBF4CD',
    transform: [{ scaleY: -1 }],
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginLeft: 40,
  },

  text: {
    marginTop: 10,
    fontSize: 18,
    color: '#000',
  },

  progress: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 17,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#7591af',
    fontSize: 15,
    fontWeight: '100',
  },
});