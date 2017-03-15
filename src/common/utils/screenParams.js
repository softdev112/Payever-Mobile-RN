import { Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');

export default {
  width,
  height,
  ratio: PixelRatio.get(),
};