import { StyleSheet, Platform, Dimensions, PixelRatio } from 'react-native';
import Api from 'react-native-extended-stylesheet/src/api';

const styleSheet = new Api();

const { height } = Dimensions.get('window');

// Set values from
// https://github.com/payeverworldwide/ui-kit/blob/master/scss/pe_variables.scss
styleSheet.build({
  rem: (height * PixelRatio.get() > 1280) ? 8 : 8,
  pe_color_black: '#000',
  pe_color_blue: '#0084ff',
  pe_color_dark_gray: '#3d3d3d',
  pe_color_gray: '#6d6d6d',
  pe_color_gray_2: '#b3b3b3',
  pe_color_icon: '#b5b9be',
  pe_color_light_gray_1: '#e1e1e1',
  pe_color_white: '#fff',
  border_color: '#f4f4f4',
  font_family: Platform.OS === 'ios' ? 'Helvetica Neue' : 'Open Sans',
});

styleSheet.flatten = StyleSheet.flatten;

export default styleSheet;