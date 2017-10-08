import { Component } from 'react';
import { Image } from 'react-native';
import { images, Text, View } from 'ui';
import { screenParams } from 'utils';

import StyleSheet from '../../../common/ui/StyleSheet';

export default class NoInetErrorPage extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  render() {
    return (
      <Image
        style={[styles.container, StyleSheet.absoluteFillObject]}
        source={images.background}
        resizeMode="cover"
        blurRadius={10}
      >
        <View style={styles.blackOverlay}>
          <Image
            style={styles.logoImage}
            source={images.bigLogo}
            resizeMode="contain"
          />
          <View style={styles.belowTextCont}>
            <Text style={styles.bigText}>payever services not available</Text>
            <Text style={styles.smallText}>No internet connection</Text>
          </View>
        </View>
      </Image>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    width: screenParams.width,
    height: screenParams.height,
  },

  logoImage: {
    marginTop: 100,
    width: 300,
    height: 50,
  },

  bigText: {
    backgroundColor: 'transparent',
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },

  smallText: {
    backgroundColor: 'transparent',
    color: '#FFF',
    fontSize: 16,
  },

  blackOverlay: {
    flex: 1,
    width: '100%',
    backgroundColor: '#000000BB',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  belowTextCont: {
    alignItems: 'center',
    height: '60%',
  },
});