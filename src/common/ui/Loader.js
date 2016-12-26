import { Component } from 'react';
import { ActivityIndicator, View } from 'react-native';
import StyleSheet from './StyleSheet';

export default class Loader extends Component {
  props: {
    isLoading?: boolean;
    style?: Object | Number
  };

  renderInline() {
    const { isLoading, style } = this.props;
    if (!isLoading) {
      return null;
    }

    return (
      <View style={[styles.loaderContainer, style]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  renderContainer() {
    const { isLoading, children } = this.props;
    if (!isLoading) {
      if (Array.isArray(children)) {
        throw new Error('Loader can contain only a single element');
      }
      return children;
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});