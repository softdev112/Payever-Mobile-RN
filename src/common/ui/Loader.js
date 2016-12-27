import { Component, PropTypes } from 'react';
import { ActivityIndicator, View } from 'react-native';
import StyleSheet from './StyleSheet';

export default class Loader extends Component {
  static propTypes = {
    isLoading: PropTypes.bool,
    style: ActivityIndicator.propTypes.style,
    loaderStyle: View.propTypes.style,
  };

  props: {
    isLoading?: boolean;
    style?: Object | Number;
    loaderStyle? : Object | Number;
    color?: string
  };

  renderInline(style) {
    const { isLoading } = this.props;
    if (!isLoading) {
      return null;
    }

    return (
      <ActivityIndicator
        size="large"
        style={style}
        color={this.props.color || '#5AC8FA'}/>
    );
  }

  renderContainer(style) {
    const { isLoading, children, loaderStyle } = this.props;
    if (!isLoading) {
      return <View style={style}>{children}</View>;
    } else {
      return this.renderInline([styles.loader, loaderStyle]);
    }
  }

  render() {
    const { children, style } = this.props;
    if (children) {
      return this.renderContainer([styles.container, style]);
    } else {
      return this.renderInline([styles.loader, style]);
    }
  }
}

const styles = StyleSheet.create({
  container: {

  },

  loader: {
    marginTop: 30
  }
});