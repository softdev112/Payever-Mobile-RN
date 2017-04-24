import { Dimensions, PixelRatio } from 'react-native';

const TABLET_MIN_WIDTH = 700;
const { width, height } = Dimensions.get('window');
const widthWithRatio = width * PixelRatio.get();
const heightWithRatio = height * PixelRatio.get();

function isTabletLayout(): boolean {
  return width >= TABLET_MIN_WIDTH;
}

export default {
  width,
  height,
  widthWithRatio,
  heightWithRatio,
  isTabletLayout,
  ratio: PixelRatio.get(),
};