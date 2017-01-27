import { Component } from 'react';
import { ListView, ListViewDataSource } from 'react-native';
import { StyleSheet } from 'ui';

import data from './dummyData';
import ChatMessage from './ChatMessage';

export default class MessgesList extends Component {

  dataSource: ListViewDataSource;

  constructor(props) {
    super(props);

    this.state = {};
    this.dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
  }

  renderRow(row) {
    return <ChatMessage message={row} />;
  }

  render() {
    const ds = this.dataSource.cloneWithRows(data);

    return (
      <ListView
        contentContainerStyle={styles.container}
        dataSource={ds}
        renderRow={::this.renderRow}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});