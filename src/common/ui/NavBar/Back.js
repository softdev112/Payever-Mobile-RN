import { Component, PropTypes } from 'react';
import { Platform } from 'react-native';
import type { Navigator } from 'react-native-navigation';
import IconButton from './IconButton';
import StyleSheet from '../StyleSheet';

export default class Back extends Component {
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    popup: PropTypes.bool,
  };

  static defaultProps = {
    align: 'left',
    ...Platform.select({
      ios: {
        source: 'icon-arrow-left-ios-24',
      },

      android: {
        source: 'icon-arrow-left-24',
      },
    }),
    showTitle: 'size-dep',
  };

  context: {
    navigator: Navigator;
    popup: boolean;
  };

  props: {
    onPress?: () => any;
    source: Object | string;
    style?: Object | number;
    title?: string;

    /**
     * Show or not title with back button error iOS only
     * in Android will set to 'never'
     */
    showTitle?: 'size-dep' | 'always' | 'never';
  };

  onPress() {
    this.context.navigator.pop();
  }

  render() {
    const { source, style, onPress, showTitle, title } = this.props;

    let iconSource = source;
    let iconStyle = style;
    if (this.context.popup) {
      if (source === Back.defaultProps.source) {
        iconSource = 'icon-x-24';
      }
      iconStyle = [style, styles.title_popup];
    }

    const onPressAction = onPress || ::this.onPress;

    return (
      <IconButton
        imageStyle={iconStyle}
        onPress={onPressAction}
        source={iconSource}
        title={title}
        showTitle={Platform.OS === 'android' ? 'never' : showTitle}
        titleStyle={styles.title}
      />
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: '400',
    marginLeft: 2,
  },

  title_popup: {
    color: '$pe_color_black',
  },
});