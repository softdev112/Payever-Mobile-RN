import { Component, PropTypes } from 'react';
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
    source: 'icon-arrow-left-ios-24',
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
  };

  onPress() {
    this.context.navigator.pop();
  }

  render() {
    let { source, style } = this.props;

    if (this.context.popup) {
      if (source === Back.defaultProps.source) {
        source = 'icon-x-24';
      }
      style = [style, styles.title_popup];
    }

    const onPress = this.props.onPress || ::this.onPress;
    return (
      <IconButton
        imageStyle={style}
        onPress={onPress}
        source={source}
        title={this.props.title}
        titleStyle={styles.title}
      />
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 15,
    fontWeight: '400',
    marginLeft: 12,
  },

  title_popup: {
    color: '$pe_color_black',
  },
});