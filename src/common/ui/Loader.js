import { Component } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default class Loader extends Component {
  renderInline() {
    const { isLoading } = this.props;
    if (!isLoading) {
      return null;
    }

    return (
      <ActivityIndicator size="large" style={{ marginTop: 30 }} />
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