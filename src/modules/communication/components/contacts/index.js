import { Component } from 'react';
import { ListView, ListViewDataSource } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import { Loader, StyleSheet } from 'ui';

import Contact from './Contact';
import ListHeader from './ListHeader';
import Search from './Search';
import type MessengerInfo from
  '../../../../store/CommunicationStore/models/MessengerInfo';
import type CommunicationStore
  from '../../../../store/CommunicationStore/index';
import type UserProfilesStore
  from '../../../../store/UserProfilesStore/index';


@inject('communication', 'userProfiles')
@observer
export default class Contacts extends Component {
  dataSource: ListViewDataSource;

  props: {
    communication?: CommunicationStore;
    userProfiles?: UserProfilesStore;
  };

  state: {
    info: MessengerInfo;
  };

  constructor(props) {
    super(props);

    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (r1, r2) => r1 !== r2,
    });

    this.state = { dataSource };
  }

  async componentWillMount() {
    const { communication, userProfiles } = this.props;

    const info = await communication.loadMessengerInfo(
      userProfiles.currentProfile
    );
    this.setState({
      dataSource: this.state.dataSource.cloneWithRowsAndSections({
        contacts: info.conversations.slice(),
        groups: info.groups.slice(),
      }, ['contacts', 'groups']),
    });
  }

  render() {
    const dataSource: ListViewDataSource = this.state.dataSource;

    return (
      <Loader isLoading={dataSource.getRowCount() < 1}>
        <ListView
          contentContainerStyle={styles.container}
          dataSource={dataSource}
          enableEmptySections
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