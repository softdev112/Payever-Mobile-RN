import { Component } from 'react';
import { ListView } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import { ErrorBox, Loader, StyleSheet, View } from 'ui';

import Contact from './Contact';
import ListHeader from './ListHeader';
import Search from './Search';

import type CommunicationStore from '../../../../store/communication';
import type ProfilesStore from '../../../../store/profiles';

@inject('communication', 'profiles')
@observer
export default class Contacts extends Component {
  static defaultProps = {
    phoneView: true,
    pickUpMode: false,
  };

  props: {
    communication?: CommunicationStore;
    phoneView: boolean;
    pickUpMode?: boolean;
    style?: Object | number;
    profiles?: ProfilesStore;
  };

  componentDidMount() {
    const { communication, profiles } = this.props;

    //noinspection JSIgnoredPromiseFromCall
    communication.loadMessengerInfo(profiles.currentProfile);
    communication.search('');
  }

  render() {
    const { communication, pickUpMode, phoneView, style } = this.props;
    let ds;
    if (pickUpMode) {
      ds = communication.contactsAndGroupsDataSource;
    } else {
      ds = communication.contactDataSource;
    }

    const info = communication.messengerInfo;

    if (!info) {
      return (
        <View style={style}>
          <Loader isLoading={ds.isLoading}>
            {ds.isError && <ErrorBox message={ds.error} />}
          </Loader>
        </View>
      );
    }

    return (
      <View style={style}>
        <ListView
          contentContainerStyle={styles.contentContainer}
          dataSource={ds}
          enableEmptySections
          renderHeader={() => <Search />}
          renderRow={(item, type) => (
            <Contact item={item} phoneView={phoneView} type={type} />
          )}
          renderSectionHeader={(_, type) => (
            <ListHeader
              conversationInfo={info}
              pickUpMode={pickUpMode}
              hideMessages={communication.foundMessages.length < 1}
              type={type}
            />
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});