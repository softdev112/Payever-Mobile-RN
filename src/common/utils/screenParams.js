import { Dimensions, PixelRatio } from 'react-native';

const TABLET_MIN_WIDTH = 700;
const { width, height } = Dimensions.get('window');

function isTabletLayout(): number {
  return width >= TABLET_MIN_WIDTH;
}

export default {
  width,
  height,
  isTabletLayout,
  ratio: PixelRatio.get(),
};