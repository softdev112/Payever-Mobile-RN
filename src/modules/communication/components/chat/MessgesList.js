import { Component } from 'react';
import { ListView, ListViewDataSource } from 'react-native';
import { Loader, StyleSheet } from 'ui';

import Contact from '../contacts/Contact';
import ListHeader from '../contacts/ListHeader';
import Search from '../contacts/Search';

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
      contacts: [
        { name: 'Alexey Prokhorov' },
        { name: 'Personal Assistant', online: true },
        { name: 'Fredrik Malmqvist', online: true },
        { name: 'Alex TEST' },
        { name: 'Hans Meier' },
        { name: '(empty)' },
      ],
      groups: [
        { name: 'Samsung TV Customers' },
        { name: 'Design' },
        { name: 't' },
        { name: 'Chat group payever' },
      ],
    }, ['contacts', 'groups']);

    return (
      <Loader isLoading={this.state.isLoading}>
        <ListView
          contentContainerStyle={styles.container}
          dataSource={ds}
          renderHeader={() => <Search />}
          renderRow={(item, type) => <Contact item={item} type={type} />}
          renderSectionHeader={(_, type) => <ListHeader type={type} />}
        />
      </Loader>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 37,
    paddingVertical: 30,
  },
});