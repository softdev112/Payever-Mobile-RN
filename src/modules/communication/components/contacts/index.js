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
  static defaultProps = {
    pickUpMode: false,
  };

  props: {
    communication?: CommunicationStore;
    pickUpMode?: boolean;
    style?: Object | number;
    profiles?: ProfilesStore;
  };

  state: {
    isListShrink: boolean;
  };

  renderHeader: () => Component;
  renderSectionFooter: () => Component;

  constructor(props) {
    super(props);

    this.renderHeader = this.renderHeader.bind(this);
    this.renderSectionFooter = this.renderSectionFooter.bind(this);
    this.getSectionsData = this.getSectionsData.bind(this);

    this.state = {
      isListShrink: true,
    };
  }

  componentDidMount() {
    const { communication, profiles, pickUpMode } = this.props;

    //noinspection JSIgnoredPromiseFromCall
    if (!pickUpMode) {
      communication.loadMessengerInfo(profiles.currentProfile);
    }

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
          if (!contact1 || !contact1.latestMessage) return -1;
          if (!contact2 || !contact2.latestMessage) return 1;

          const date1 = contact1.latestMessage.date;
          const date2 = contact2.latestMessage.date;
          if (moment(date1).isBefore(date2)) {
            return 1;
          } else if (moment(date1).isSame(date2)) {
            return 0;
          }

          return -1;
        }

        if (idx === 2) return section;

        let patchedData = section.data.sort(sortByLastMessage);
        if (isListShrink && patchedData.length > NUM_CONTACTS_TO_SHOW) {
          patchedData = patchedData.slice(0, NUM_CONTACTS_TO_SHOW);
        }

        section.data = patchedData;

        return section;
      });

    if (communication.pickUpMode) {
      // Take only contacts and groups
      return [sections[0], sections[1]];
    }

    return sections;
  }

  renderHeader() {
    return <Search />;
  }

  renderSectionFooter() {
    const { isListShrink } = this.state;
    return (
      <TextButton
        style={styles.moreBtn}
        title={isListShrink ? 'More...' : 'Less...'}
        onPress={::this.onShowMoreContacts}
      />
    );
  }

  render() {
    const { communication, pickUpMode, style } = this.props;
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
          sections={this.getSectionsData()}
          renderItem={({ item }) => <Contact item={item} />}
          renderSectionHeader={({ section }) => (
            <ListHeader
              conversationInfo={info}
              pickUpMode={pickUpMode}
              type={section.title}
            />
          )}
          SectionSeparatorComponent={
            ({ section }) => this.renderSectionFooter(section)
          }
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
    justifyContent: 'center',
  },
});