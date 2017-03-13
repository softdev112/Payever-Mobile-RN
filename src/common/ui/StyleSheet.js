import { StyleSheet, Platform, PixelRatio } from 'react-native';
import Api from 'react-native-extended-stylesheet/src/api';
import { ScreenParams } from 'utils';

const styleSheet = new Api();

// Set values from
// https://github.com/payeverworldwide/ui-kit/blob/master/scss/pe_variables.scss
styleSheet.build({
  rem: (ScreenParams.height * PixelRatio.get() > 1280) ? 10 : 8,
  pe_color_twitter: '#50abf1',
  pe_color_black: '#000',
  pe_color_blue: '#0084ff',
  pe_color_dark_gray: '#3d3d3d',
  pe_color_dark_red: '#c02f1d',
  pe_color_gray: '#6d6d6d',
  pe_color_gray_2: '#b3b3b3',
  pe_color_icon: '#b5b9be',
  pe_color_light_gray_1: '#e1e1e1',
  pe_color_red: '#ff3c30',
  pe_color_white: '#fff',
  border_color: '#f4f4f4',
  font_family: Platform.OS === 'ios' ? 'Helvetica Neue' : 'Open Sans',
});

styleSheet.flatten = StyleSheet.flatten;

export default styleSheet;