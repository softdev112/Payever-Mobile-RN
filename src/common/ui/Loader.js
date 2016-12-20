import { Component, PropTypes } from 'react';
import { ActivityIndicator, View } from 'react-native';
import StyleSheet from './StyleSheet';

export default class Loader extends Component {
  static propTypes = {
    isLoading: PropTypes.bool,
    style: ActivityIndicator.propTypes.style,
    containerStyle: View.propTypes.style,
  };

  props: {
    isLoading?: boolean;
    style?: Object | Number;
    containerStyle? : Object | Number;
  };

  renderInline() {
    const { isLoading, style } = this.props;
    if (!isLoading) {
      return null;
    }

    return (
      <ActivityIndicator size="large" style={[styles.container, style]} />
    );
  }

  renderContainer() {
    const { isLoading, children, containerStyle } = this.props;
    if (!isLoading) {
      return <View style={containerStyle}>{children}</View>;
    } else {
      return this.renderInline();
    }
  }

  render() {
    const { children } = this.props;
    if (children) {
      return this.renderContainer();
    } else {
      return this.renderInline();
    }
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30
  }
});