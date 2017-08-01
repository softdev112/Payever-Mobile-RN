import { Component } from 'react';
import { SectionList } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import moment from 'moment';
import { ErrorBox, Loader, StyleSheet, View, TextButton } from 'ui';

import Contact from './Contact';
import ListHeader from './ListHeader';
import Search from './Search';

import type CommunicationStore from '../../../../store/communication';
import type ConversationInfo
  from '../../../../store/communication/models/ConversationInfo';
import type ProfilesStore from '../../../../store/profiles';

const NUM_CONTACTS_TO_SHOW = 5;
const MIN_ROW_HEIGHT = 70;
const INIT_LIST_HEIGHT = 400;

@inject('communication', 'profiles')
@observer
export default class Contacts extends Component {
  props: {
    communication: CommunicationStore;
    profiles: ProfilesStore;
    style?: Object | number;
  };

  state: {
    shrinkLists: boolean;
    listHeight: number;
    isContactsShrink: boolean;
    isGroupsShrink: boolean;
    selectedContact: ConversationInfo;
  };

  constructor(props) {
    super(props);

    this.renderHeader = this.renderHeader.bind(this);

    this.state = {
      shrinkLists: false,
      listHeight: INIT_LIST_HEIGHT,
      isContactsShrink: true,
      isGroupsShrink: true,
      selectedContact: null,
    };
  }

  async componentWillMount() {
    const { communication, profiles } = this.props;

    //noinspection JSIgnoredPromiseFromCall
    if (!communication.ui.pickContactMode) {
      await communication.loadMessengerInfo(profiles.currentProfile);
    }

    communication.search('');
  }

  onContactSelected(item) {
    this.setState({ selectedContact: item });
  }

  onShowMoreContacts() {
    const { isContactsShrink } = this.state;
    this.setState({ isContactsShrink: !isContactsShrink });
  }

  onShowMoreGroups() {
    const { isGroupsShrink } = this.state;
    this.setState({ isGroupsShrink: !isGroupsShrink });
  }

  onListLayout({ nativeEvent }) {
    const { communication: { messengerInfo } } = this.props;
    const { conversations, groups, marketingGroups } = messengerInfo;

    // If list height > rows count * MIN_ROW_HEIGHT do not show more/less
    // buttons at all
    const totalConvCount =
      conversations.length + groups.length + marketingGroups.length;
    const { height } = nativeEvent.layout;

    this.setState({
      listHeight: height,
      shrinkLists: totalConvCount * MIN_ROW_HEIGHT >= height,
    });
  }

  getSectionsData() {
    const { communication } = this.props;
    const { isContactsShrink, isGroupsShrink, shrinkLists } = this.state;

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
            if (shrinkLists && isContactsShrink
              && patchedData.length > NUM_CONTACTS_TO_SHOW) {
              section.data = patchedData.slice(0, NUM_CONTACTS_TO_SHOW);
            }

            break;

          case 1:
            if (shrinkLists && isGroupsShrink
              && patchedData.length > NUM_CONTACTS_TO_SHOW) {
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

  renderSectionFooter({ section }) {
    const { messengerInfo } = this.props.communication;
    const { isContactsShrink, isGroupsShrink, shrinkLists } = this.state;

    if (!shrinkLists) return null;

    // Skip foundMessages
    let action;
    let btnText = '';
    switch (section.key) {
      case '1':
        if (messengerInfo.conversations.length <= NUM_CONTACTS_TO_SHOW) {
          return null;
        }

        action = ::this.onShowMoreContacts;
        btnText = isContactsShrink ? 'More...' : 'Less...';
        break;

      case '2':
        if (messengerInfo.groups.length <= NUM_CONTACTS_TO_SHOW) {
          return null;
        }

        action = ::this.onShowMoreGroups;
        btnText = isGroupsShrink ? 'More...' : 'Less...';
        break;

      default:
        return null;
    }

    return (
      <TextButton
        style={styles.moreBtn}
        title={btnText}
        onPress={action}
      />
    );
  }

  render() {
    const { communication, style } = this.props;
    const { selectedContact } = this.state;
    const selectedContactId = selectedContact && selectedContact.id;
    const info = communication.messengerInfo;

    if (!info || communication.isLoading) {
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
          onLayout={::this.onListLayout}
          ListHeaderComponent={this.renderHeader}
          sections={this.getSectionsData()}
          initialNumToRender={20}
          renderItem={({ item }) => (
            <Contact
              onSelected={::this.onContactSelected}
              item={item}
              selected={selectedContactId === item.id}
            />
          )}
          renderSectionHeader={({ section }) => (
            <ListHeader
              conversationInfo={info}
              type={section.title}
            />
          )}
          renderSectionFooter={::this.renderSectionFooter}
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
    alignSelf: 'flex-end',
    marginRight: 20,
    justifyContent: 'center',
    paddingBottom: 6,
  },
});