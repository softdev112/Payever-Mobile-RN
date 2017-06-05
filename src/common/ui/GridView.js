import { Component } from 'react';
import { FlatList } from 'react-native';
import StyleSheet from './StyleSheet';
import { ScreenParams } from '../utils';

export default class GridView extends Component {
  static defaultProps = {
    renderFooter: () => null,
    itemWidth: 200,
    itemHeight: 200,
    centerContent: false,
    scrollEnabled: true,
    spacingVertical: 4,
  };

  props: {
    data: Array<any>;
    keyExtractor: () => any;
    renderItem: () => Component;
    renderFooter?: () => Component;
    style?: Object | number;
    itemWidth?: number;
    itemHeight?: number;
    centerContent?: boolean;
    numColumns?: number;
    scrollEnabled?: boolean;
    spacingVertical?: number;
  };

  $list: FlatList;

  constructor(props) {
    super(props);

    this.state = {
      gridHeight: 0,
    };
  }

  onLayout({ nativeEvent }) {
    this.setState({ gridHeight: nativeEvent.layout.height });
  }

  scrollToEnd(options = { animated: false }) {
    if (this.$list) {
      this.$list.scrollToEnd(options);
    }
  }

  render() {
    const {
      data,
      keyExtractor,
      renderItem,
      style,
      renderFooter,
      itemWidth,
      itemHeight,
      numColumns,
      centerContent,
      scrollEnabled,
      spacingVertical,
    } = this.props;

    const { gridHeight } = this.state;

    const numOfColumns = numColumns
      || Math.floor(ScreenParams.width / itemWidth);
    const marginLeft =
      (ScreenParams.width - (numOfColumns * itemWidth)) / (numOfColumns + 1);

    const contentStyle = [styles.content];
    const columnHeight =
      Math.ceil(data.length / numOfColumns) * (itemHeight + spacingVertical);
    const isCenteredAvailable = columnHeight < gridHeight;

    if (centerContent && isCenteredAvailable) {
      contentStyle.push(styles.centerContent);
    }

    return (
      <FlatList
        style={[styles.container, style]}
        scrollEnabled={scrollEnabled && !(centerContent && isCenteredAvailable)}
        contentContainerStyle={contentStyle}
        alwaysBounceHorizontal={false}
        ref={r => this.$list = r}
        initialNumToRender={30}
        data={data}
        renderItem={(info) => renderItem(info, marginLeft)}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={keyExtractor}
        numColumns={numOfColumns}
        contentInset={{ top: 10, bottom: 10 }}
        onLayout={::this.onLayout}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    alignSelf: 'center',
  },

  centerContent: {
    flex: 1,
    justifyContent: 'center',
  },
});