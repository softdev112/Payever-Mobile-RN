import { Component } from 'react';
import { ListView } from 'react-native';
import StyleSheet from './StyleSheet';

export default class GridView extends Component {
  static DataSource = ListView.DataSource;

  props: {
    contentContainerStyle?: Object | number;
    dataSource: ListView.DataSource;
    renderRow: () => any;
    style?: Object | number;
  };

  render() {
    const { contentContainerStyle, dataSource, renderRow, style } = this.props;
    return (
      <ListView
        initialListSize={30}
        style={[styles.container, style]}
        contentContainerStyle={[styles.list, contentContainerStyle]}
        dataSource={dataSource}
        renderRow={renderRow}
        showsVerticalScrollIndicator={false}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },

  list: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
});