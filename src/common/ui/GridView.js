import { Component } from 'react';
import { ListView } from 'react-native';
import StyleSheet from './StyleSheet';

export default class GridView extends Component {
  static DataSource: DataSource = ListView.DataSource;
  static defaultProps = { renderFooter: () => null };

  props: {
    contentContainerStyle?: Object | number;
    dataSource: ListView.DataSource;
    renderRow: () => any;
    renderFooter?: () => any;
    style?: Object | number;
  };

  render() {
    const {
      contentContainerStyle,
      dataSource,
      renderRow,
      style,
      renderFooter,
    } = this.props;

    return (
      <ListView
        initialListSize={30}
        style={[styles.container, style]}
        contentContainerStyle={[styles.list, contentContainerStyle]}
        dataSource={dataSource}
        renderRow={renderRow}
        renderFooter={renderFooter}
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

declare class DataSource extends ListView.DataSource {
  getRowCount(): number;
}