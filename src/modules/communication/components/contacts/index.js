import { Component } from 'react';
import { ListView, ListViewDataSource } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import { Loader, StyleSheet } from 'ui';

import Contact from './Contact';
import ListHeader from './ListHeader';
import Search from './Search';

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

  componentWillMount() {
    const { communication, userProfiles } = this.props;

    //noinspection JSIgnoredPromiseFromCall
    communication.loadMessengerInfo(userProfiles.currentProfile);
    communication.search('');
  }

  render() {
    const { communication } = this.props;
    const ds = communication.contactDataSource;

    return (
      <Loader isLoading={ds.isLoading}>
        <ListView
          contentContainerStyle={styles.container}
          dataSource={ds}
          enableEmptySections
          renderHeader={() => <Search />}
          renderRow={(item, type) => <Contact item={item} type={type} />}
          renderSectionHeader={(_, type) => (
            <ListHeader
              type={type}
              hideMessages={communication.foundMessages.length < 1}
            />
          )}
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