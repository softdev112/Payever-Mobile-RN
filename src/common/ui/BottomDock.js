import { Component } from 'react';
import { ScrollView } from 'react-native';
import * as Animatable from 'react-native-animatable';

import StyleSheet from './StyleSheet';

export default class BottomDock extends Component {
  props: {
    items: Array<any>;
    style?: Object;
    scrollStyle?: Object;
    renderItem: (any, number) => Component;
  };

  $scrollView: ScrollView;

  onScrollContentSizeChange() {
    if (!this.$scrollView) return;

    this.$scrollView.scrollToEnd({ animated: true });
  }

  renderContent() {
    const { items, renderItem } = this.props;

    return items.map((item, index) => renderItem(item, index));
  }

  render() {
    const { style, scrollStyle } = this.props;

    return (
      <Animatable.View
        style={[styles.container, style]}
        animation="fadeIn"
        duration={300}
      >
        <ScrollView
          contentContainerStyle={[styles.scrollContainer, scrollStyle]}
          horizontal
          showsHorizontalScrollIndicator={false}
          ref={(ref) => this.$scrollView = ref}
          onContentSizeChange={::this.onScrollContentSizeChange}
          keyboardShouldPersistTaps="always"
        >
          {this.renderContent()}
        </ScrollView>
      </Animatable.View>
    );
  }
}

const styles = StyleSheet.create({
  $maxHeight: '82%',

  container: {
    position: 'absolute',
    top: '$maxHeight - 60',
    '@media (max-height: 620):': {
      top: '$maxHeight - 80',
    },
    '@media (max-height: 620) && android:': {
      top: '$maxHeight - 95',
    },
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    height: 60,
  },

  scrollContainer: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
});