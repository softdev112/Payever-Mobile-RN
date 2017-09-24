import { Component } from 'react';
import { Image, StyleSheet, Text } from 'react-native';
import images from '../images';
import ScreenParams from '../../utils/screenParams';

const MAX_BLUR = 18;
const BLUR_STEP = 2;

export default class WebViewLoader extends Component {
  state: {
    value: number;
    growing: boolean;
  };

  blurTimeInterval: number;

  constructor(props) {
    super(props);

    this.state = {
      value: 0,
      growing: true,
    };
  }

  componentDidMount() {
    this.blurTimeInterval = setInterval(() => {
      let { value: nextValue, growing: currentGrowing } = this.state;

      if (nextValue >= MAX_BLUR) {
        currentGrowing = false;
      } else if (nextValue <= 0) {
        currentGrowing = true;
      }

      if (currentGrowing) {
        nextValue += BLUR_STEP;
      } else {
        nextValue -= BLUR_STEP;
      }

      if (this.blurTimeInterval) {
        this.setState({ value: nextValue, growing: currentGrowing });
      }
    }, 400);
  }

  componentWillUnmount() {
    clearInterval(this.blurTimeInterval);
    this.blurTimeInterval = null;
  }

  render() {
    const { value } = this.state;

    return (
      <Image
        style={[styles.container, StyleSheet.absoluteFillObject]}
        source={images.background}
        resizeMode="cover"
        blurRadius={value}
      >
        <Image
          style={styles.logoImage}
          source={images.bigLogo}
          resizeMode="contain"
        />
        <Text style={styles.text}>Loading...</Text>
      </Image>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    width: ScreenParams.width,
    height: ScreenParams.height,
  },

  logoImage: {
    marginTop: 100,
    width: 300,
    height: 50,
  },

  text: {
    backgroundColor: 'transparent',
    color: '#FFF',
    fontSize: 22,
    marginBottom: 50,
  },
});