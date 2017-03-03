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
  };

  props: {
    communication?: CommunicationStore;
    phoneView: boolean;
    style?: Object | number;
    profiles?: ProfilesStore;
  };

  componentWillMount() {
    const { communication, profiles } = this.props;

    //noinspection JSIgnoredPromiseFromCall
    communication.loadMessengerInfo(profiles.currentProfile);
    communication.search('');
  }

  render() {
    const { communication, phoneView, style } = this.props;
    const ds = communication.contactDataSource;
    const info = communication.messengerInfo;

    if (!info) {
      return (
        <View style={style}>
          <Loader isLoading={ds.isLoading}>
            <ErrorBox message={ds.error} />
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
    paddingHorizontal: 37,
    paddingVertical: 30,
  },
});