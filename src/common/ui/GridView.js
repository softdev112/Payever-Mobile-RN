import { Component, PropTypes } from 'react';
import { ListView } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

export default class GridView extends Component {
  static DataSource = ListView.DataSource;

  static propTypes = {
    contentContainerStyle: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number
    ]),
    dataSource: PropTypes.instanceOf(ListView.DataSource).isRequired,
    renderRow: PropTypes.func.isRequired
  };


  props: {
    contentContainerStyle: Object | number,
    dataSource: ListView.DataSource,
    renderRow: () => any
  };

  render() {
    const { dataSource, renderRow, contentContainerStyle, initialListSize } = this.props;
    return (
      <ListView
        initialListSize={30}
        contentContainerStyle={[styles.list, contentContainerStyle]}
        dataSource={dataSource}
        renderRow={renderRow}
      />
    );
  }
}

const styles = EStyleSheet.create({
  list: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap'
  }
});