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

  renderHeader: () => Component;

  constructor(props) {
    super(props);

    this.renderHeader = this.renderHeader.bind(this);
  }

  componentDidMount() {
    const { communication, profiles, pickUpMode } = this.props;

    //noinspection JSIgnoredPromiseFromCall
    if (!pickUpMode) {
      communication.loadMessengerInfo(profiles.currentProfile);
    }

    communication.search('');
  }

  renderHeader() {
    return <Search />;
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
});