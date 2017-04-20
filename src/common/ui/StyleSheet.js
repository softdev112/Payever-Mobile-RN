import { StyleSheet, Platform, PixelRatio } from 'react-native';
import Api from 'react-native-extended-stylesheet/src/api';
import { ScreenParams } from 'utils';

const styleSheet = new Api();

// Set values from
// https://github.com/payeverworldwide/ui-kit/blob/master/scss/pe_variables.scss
styleSheet.build({
  rem: getRemKoef(),
  pe_color_twitter: '#50abf1',
  pe_color_black: '#000',
  pe_color_blue: '#0084ff',
  pe_color_dark_gray: '#3d3d3d',
  pe_color_dark_red: '#c02f1d',
  pe_color_green: '#75b636',
  pe_color_dark_green: '#057b05',
  pe_color_gray: '#6d6d6d',
  pe_color_gray_7d: '#7d7d7d',
  pe_color_gray_2: '#b3b3b3',
  pe_color_icon: '#b5b9be',
  pe_color_light_gray_1: '#e1e1e1',
  pe_color_red: '#ff3c30',
  pe_color_white: '#fff',
  pe_color_apple_div: '#f0eff5',
  border_color: '#f4f4f4',
  font_family: Platform.OS === 'ios' ? 'Helvetica Neue' : 'Open Sans',
});

styleSheet.flatten = StyleSheet.flatten;

function getRemKoef(): number {
  if (ScreenParams.width * PixelRatio.get() <= 640) {
    return 8;
  }

  if (ScreenParams.width * PixelRatio.get() <= 1250) {
    return 10;
  }

  if (ScreenParams.width * PixelRatio.get() <= 2000) {
    return 14;
  }

  return 8;
}

export default styleSheet;