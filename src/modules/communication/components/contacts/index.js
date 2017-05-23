import { Component } from 'react';
import { SectionList } from 'react-native';
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
    const { communication, profiles, pickUpMode } = this.props;

    //noinspection JSIgnoredPromiseFromCall
    if (!pickUpMode) {
      communication.loadMessengerInfo(profiles.currentProfile);
    }

    communication.search('');
  }

  render() {
    const { communication, pickUpMode, phoneView, style } = this.props;
    let sections = [];
    if (pickUpMode) {
      // Take only contacts and groups
      sections = [
        communication.contactsAndGroupsData[0],
        communication.contactsAndGroupsData[1],
      ];
    } else {
      sections = communication.contactsAndGroupsData;
    }

    const info = communication.messengerInfo;

    if (!info) {
      return (
        <View style={style}>
          <Loader isLoading={communication.isLoading}>
            {communication.isError && (
              <ErrorBox message={communication.error} />
            )}
          </Loader>
        </View>
      );
    }

    return (
      <View style={[style, styles.contentContainer]}>
        <Search />
        <SectionList
          sections={sections}
          renderItem={({ item }) => (
            <Contact item={item} phoneView={phoneView} />
          )}
          renderSectionHeader={({ section }) => (
            <ListHeader
              conversationInfo={info}
              pickUpMode={pickUpMode}
              type={section.title}
            />
          )}
          keyExtractor={c => c.id}
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