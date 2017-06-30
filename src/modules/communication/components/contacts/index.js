import { Component } from 'react';
import { SectionList } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import moment from 'moment';
import { ErrorBox, Loader, StyleSheet, View, TextButton } from 'ui';

import Contact from './Contact';
import ListHeader from './ListHeader';
import Search from './Search';

import type CommunicationStore from '../../../../store/communication';
import type ProfilesStore from '../../../../store/profiles';

const NUM_CONTACTS_TO_SHOW = 5;

@inject('communication', 'profiles')
@observer
export default class Contacts extends Component {
  props: {
    communication?: CommunicationStore;
    style?: Object | number;
    profiles?: ProfilesStore;
  };

  state: {
    isListShrink: boolean;
  };

  renderHeader: () => Component;
  renderFooter: () => Component;

  constructor(props) {
    super(props);

    this.renderHeader = this.renderHeader.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.getSectionsData = this.getSectionsData.bind(this);

    this.state = {
      isListShrink: true,
    };
  }

  async componentWillMount() {
    const { communication, profiles } = this.props;

    //noinspection JSIgnoredPromiseFromCall
    if (!communication.ui.pickContactMode) {
      await communication.loadMessengerInfo(profiles.currentProfile);
    }

    const { messengerInfo } = communication;
    this.setState({
      contactsCount: messengerInfo.conversations.length,
      groupsCount: messengerInfo.groups.length,
    });

    communication.search('');
  }

  onShowMoreContacts() {
    const { isListShrink } = this.state;
    this.setState({ isListShrink: !isListShrink });
  }

  getSectionsData() {
    const { communication } = this.props;
    const { isListShrink } = this.state;

    const sections = communication.getContactsAndGroupsData()
      .map((section, idx) => {
        function sortByLastMessage(contact1, contact2) {
          if (!contact1 || !contact1.latestMessage
            || !contact1.latestMessage.date) {
            return 1;
          }

          if (!contact2 || !contact2.latestMessage
            || !contact2.latestMessage.date) {
            return -1;
          }

          const date1 = contact1.latestMessage.date;
          const date2 = contact2.latestMessage.date;
          if (moment(date1).isBefore(date2)) {
            return 1;
          } else if (moment(date1).isSame(date2)) {
            return 0;
          }

          return -1;
        }

        const patchedData = section.data.sort(sortByLastMessage);
        switch (idx) {
          case 0:
            if (isListShrink && patchedData.length > NUM_CONTACTS_TO_SHOW) {
              section.data = patchedData.slice(0, NUM_CONTACTS_TO_SHOW);
            }

            break;

          case 1:
            if (isListShrink && patchedData.length > NUM_CONTACTS_TO_SHOW) {
              section.data = patchedData.slice(0, NUM_CONTACTS_TO_SHOW);
            }

            break;

          default:
            return section;
        }

        return section;
      });

    if (communication.ui.pickContactMode) {
      // Take only contacts and groups
      return [sections[0], sections[1]];
    }

    return sections;
  }

  renderHeader() {
    return <Search />;
  }

  renderFooter() {
    const { communication: { messengerInfo } } = this.props;
    const { isListShrink } = this.state;

    if (messengerInfo.conversations.length <= NUM_CONTACTS_TO_SHOW
      && messengerInfo.groups.length <= NUM_CONTACTS_TO_SHOW) {
      return null;
    }

    return (
      <TextButton
        style={styles.moreBtn}
        title={isListShrink ? 'More...' : 'Less...'}
        onPress={::this.onShowMoreContacts}
      />
    );
  }

  render() {
    const { communication, style } = this.props;
    const info = communication.messengerInfo;

    if (!info) {
      return (
        <View style={[styles.container, style]}>
          <Loader isLoading={communication.isLoading}>
            {communication.isError && (
              <ErrorBox message={communication.error} />
            )}
          </Loader>
        </View>
      );
    }

    return (
      <View style={[styles.container, style]}>
        <SectionList
          style={styles.contactsList}
          contentContainerStyle={styles.contentContainer}
          ListHeaderComponent={this.renderHeader}
          ListFooterComponent={this.renderFooter}
          sections={this.getSectionsData()}
          initialNumToRender={20}
          renderItem={({ item }) => <Contact item={item} />}
          renderSectionHeader={({ section }) => (
            <ListHeader
              conversationInfo={info}
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
  container: {
    flex: 1,

    // TODO: solve this for Android without this NavBar disappear after
    // TODO: first rendering
    '@media android': {
      borderColor: 'transparent',
      borderWidth: 1,
    },
  },

  contactsList: {
    paddingHorizontal: 8,
  },

  contentContainer: {
    paddingVertical: 8,
  },

  moreBtn: {
    height: 30,
    alignSelf: 'center',
    justifyContent: 'center',
  },
});