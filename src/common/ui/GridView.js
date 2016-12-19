import { Component, PropTypes } from 'react';
import { ListView } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

export default class GridView extends Component {
  static DataSource = ListView.DataSource;

  static propTypes = {
    contentContainerStyle: ListView.propTypes.contentContainerStyle,
    dataSource: PropTypes.instanceOf(ListView.DataSource).isRequired,
    renderRow: PropTypes.func.isRequired
  };


  props: {
    contentContainerStyle: Object | number,
    dataSource: ListView.DataSource,
    renderRow: () => any
  };

  render() {
    const { dataSource, renderRow, contentContainerStyle } = this.props;
    return (
      <ListView
        initialListSize={30}
        style={styles.container}
        contentContainerStyle={[styles.list, contentContainerStyle]}
        dataSource={dataSource}
        renderRow={renderRow}
        showsVerticalScrollIndicator={false}
      />
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    alignSelf: 'center',
  },

  list: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap'
  }
});