import { Component } from 'react';
import { Image, View } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import * as Animatable from 'react-native-animatable';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { StyleSheet, Text } from 'ui';

import CommunicationStore from '../../../../store/communication';
import { calcImageDimensions } from '../chat/MediaView';

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

  renderProgressIndicator() {
    const { communication, message } = this.props;
    const value = communication.filesUploadingProgress.has(message.id)
      ? communication.filesUploadingProgress.get(message.id) : 0;

    return (
      <View style={styles.progressContainer}>
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
      </View>
    );
  }

  render() {
    const { message, style } = this.props;

    const imageStyle = [
      styles.image,
      calcImageDimensions({ width: message.width, height: message.height }),
    ];

    return (
      <Animatable.View
        style={[styles.container, style]}
        animation="fadeIn"
        duration={300}
      >
        {message.isPicture ? (
          <Image
            style={imageStyle}
            blurRadius={10}
            source={{ uri: message.uri }}
          >
            {this.renderProgressIndicator()}
          </Image>
        ) : (
          <View style={styles.file}>
            {this.renderProgressIndicator()}
          </View>
        )}
      </Animatable.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    minHeight: 70,
    transform: [{ scaleY: -1 }],
    marginLeft: 54,
    paddingTop: 20,
  },

  progressContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'transparent',
  },

  progress: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 17,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'white',
    fontSize: 15,
    fontWeight: '300',
  },

  image: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  file: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: '$pe_color_gray',
    padding: 14,
    height: 70,
  },
});