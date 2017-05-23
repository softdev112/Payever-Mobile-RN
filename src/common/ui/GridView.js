import { Component } from 'react';
import { FlatList } from 'react-native';
import StyleSheet from './StyleSheet';
import { ScreenParams } from '../utils';

export default class GridView extends Component {
  static defaultProps = {
    renderFooter: () => null,
    itemWidth: 200,
  };

  props: {
    data: Array<any>;
    keyExtractor: () => any;
    renderItem: () => Component;
    renderFooter?: () => Component;
    style?: Object | number;
    itemWidth?: number;
  };

  $list: FlatList;

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
    } = this.props;

    const numberOfColumns = Math.floor(ScreenParams.width / itemWidth);

    return (
      <FlatList
        style={[styles.container, style]}
        ref={r => this.$list = r}
        initialNumToRender={30}
        data={data}
        renderItem={renderItem}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={keyExtractor}
        numColumns={numberOfColumns}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    paddingTop: 8,
  },
});