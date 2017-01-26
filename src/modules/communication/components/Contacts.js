import { Component } from 'react';
import { ListView, ListViewDataSource } from 'react-native';
import { Loader, StyleSheet, View } from 'ui';

import Contact from './Contact';
import Header from './Header';
import Search from './Search';

export default class Contacts extends Component {

  dataSource: ListViewDataSource;

  constructor(props) {
    super(props);
    this.state = {};
    this.dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (r1, r2) => r1 !== r2,
    });
  }

  componentWillMount() {

  }

  render() {
    const ds = this.dataSource.cloneWithRowsAndSections({
      direct: [
        { name: 'User 1' },
        { name: 'User 2' },
      ],
      groups: [
        { name: 'Group 1' },
        { name: 'Group 2' },
      ],
    }, ['direct', 'groups']);

    return (
      <Loader isLoading={this.state.isLoading}>
        <View style={styles.container}>
          <Search />
          <ListView
            dataSource={ds}
            renderRow={(item, type) => <Contact item={item} type={type} />}
            renderSectionHeader={(_, type) => <Header type={type} />}
          />
        </View>
      </Loader>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 37,
    paddingVertical: 30,
  },
});